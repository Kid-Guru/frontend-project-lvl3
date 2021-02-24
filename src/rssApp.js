import onChange from 'on-change';
import axios from 'axios';
// import validate from './utils/validate.js';
import parse from './utils/parse.js';
import render from './utils/render.js';
import formHandler from './utils/formHandler.js';

export default () => {
  const form = document.querySelector('form');
  // const submitButton = document.querySelector('[type="submit"]');
  const state = {
    form: {
      isValid: true,
      data: {
        rrsLink: '',
      },
      errors: [],
    },
    fetching: false,
    sources: [],
    feeds: [],
    posts: [],
    refreshingFunction: null,
  };
  const watchedState = onChange(state, (path, value) => {
    console.log(state);
    render(state);
    // if (path === 'form.data') {
    //   if (value === 'invalid') {
    //     // Отрисовка ошибок, хранящихся где-то в состоянии
    //     // watchedState.registrationForm.errors
    //   }
    // }
  });

  const refreshFeeds = () => {
    const { sources } = watchedState;
    const promises = sources.map((source) => axios.get(source));
    Promise.all(promises)
      .then((responses) => {
        const parsedPosts = responses.flatMap((response) => parse(response.data).posts);
        console.log(parsedPosts);
        return parsedPosts;
      })
      .catch((error) => {
        console.log(error);
      })
      .then((parsedPosts) => {
        watchedState.posts = [...parsedPosts];
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    const { isValid, rrsLink, errors } = formHandler(formData, watchedState.sources);

    // const validationResult = validate(formData);
    // const isValid = validationResult.length === 0;
    // const {rrsLink} = formData;
    // const errors = validationResult.map(item => item.message);

    // console.log(validationResult);
    watchedState.form = { isValid, data: rrsLink, errors };
    if (!isValid) return null;
    watchedState.fetching = true;
    clearInterval(watchedState.refreshingFunction);
    axios.get(rrsLink)
      .then((response) => {
        console.dir(response);
        const parsedData = parse(response.data);
        watchedState.fetching = false;
        // console.log(parsedDOM)
        return parsedData;
      })
      .then((parsedData) => {
        const currentsources = watchedState.sources;
        if (currentsources.some((sourse) => sourse === parsedData.feed.channelLink)) {
          throw new Error('Источник уже добавлен');
        }
        // console.log(parsedData);
        watchedState.sources.unshift(formData.rrsLink);
        watchedState.feeds.unshift(parsedData.feed);
        watchedState.posts = [...parsedData.posts, ...watchedState.posts];
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        watchedState.refreshingFunction = setInterval(refreshFeeds, 5000);
      });
  });
};
