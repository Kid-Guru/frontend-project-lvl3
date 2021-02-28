import axios from 'axios';
import i18next from 'i18next';
import parse from './utils/parse.js';
import formHandler from './utils/formHandler.js';
import watchedState from './watcher.js';
import ru from './locales/ru.js';
import selectNewPosts from './utils/selectNewPosts.js';

export default async () => {
  await i18next.init({
    lng: 'ru',
    // debug: true,
    resources: {
      ru,
    },
  });

  const refreshFeeds = () => {
    const { sources } = watchedState;
    if (sources.length === 0) return null;
    const promises = sources.map((source) => axios.get(source));
    Promise.all(promises)
      // eslint-disable-next-line arrow-body-style
      .then((responses) => responses.flatMap((response, index) => {
        return parse(response.data, index).posts;
      }))
      .catch((error) => {
        console.log(error);
      })
      .then((parsedPosts) => {
        const newPosts = selectNewPosts(parsedPosts, watchedState.posts);
        console.log(newPosts);
        watchedState.posts = [...newPosts, ...watchedState.posts];
        setTimeout(refreshFeeds, 5000);
      });
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    const { isValid, rssLink, errors } = formHandler(formData, watchedState.sources);
    watchedState.form = { isValid, rssLink, errors };
    if (!isValid) return null;
    watchedState.form.fetching = true;
    // clearInterval(refreshingFunctionID);
    axios.get(rssLink)
      .then((response) => {
        const feedID = watchedState.sources.length + 1;
        const parsedData = parse(response.data, feedID);
        watchedState.form.fetching = false;
        return parsedData;
      })
      .then((parsedData) => {
        watchedState.sources.unshift(rssLink);
        watchedState.feeds.unshift(parsedData.feed);
        watchedState.posts = [...parsedData.posts, ...watchedState.posts];
      })
      .catch((error) => {
        watchedState.form.errors.push(error.message);
        watchedState.form.fetching = false;
      })
      .then(() => {
        watchedState.form.rssLink = '';
        setTimeout(refreshFeeds, 5000);
      });
    return null;
  });
};
