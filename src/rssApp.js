import axios from 'axios';
import parse from './utils/parse.js';
import formHandler from './utils/formHandler.js';
import watchedState from './watcher.js';

export default () => {
  const form = document.querySelector('form');
  // const submitButton = document.querySelector('[type="submit"]');

  const refreshFeeds = () => {
    const { sources } = watchedState;
    const promises = sources.map((source) => axios.get(source));
    Promise.all(promises)
      .then((responses) => {
        const parsedPosts = responses.flatMap((response) => parse(response.data).posts);
        // console.log(parsedPosts);
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
    const { isValid, rssLink, errors } = formHandler(formData, watchedState.sources);
    // console.log(validationResult);
    watchedState.form = { isValid, rssLink, errors };
    if (!isValid) return null;
    watchedState.fetching = true;
    clearInterval(watchedState.refreshingFunction);
    axios.get(rssLink)
      .then((response) => {
        console.dir(response);
        const parsedData = parse(response.data);
        watchedState.fetching = false;
        // console.log(parsedDOM)
        return parsedData;
      })
      .then((parsedData) => {
        // console.log(parsedData);
        watchedState.sources.unshift(rssLink);
        watchedState.feeds.unshift(parsedData.feed);
        watchedState.posts = [...parsedData.posts, ...watchedState.posts];
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        watchedState.form.rssLink = '';
        watchedState.refreshingFunction = setInterval(refreshFeeds, 5000);
      });
    return null;
  });
};
