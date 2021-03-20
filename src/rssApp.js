import axios from 'axios';
import parse from './utils/parse.js';
import { formHandler, handleModalContent } from './utils/handlers.js';
import watchedStateWrap from './watcher.js';
import selectNewPosts from './utils/selectNewPosts.js';
import 'bootstrap/js/dist/modal.js';

export default (i18next) => {
  const watchedState = watchedStateWrap(i18next);

  const refreshFeeds = () => {
    const { sources } = watchedState;
    if (sources.length === 0) return null;
    const promises = sources.map((source) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${source}`));
    Promise.all(promises)
      // eslint-disable-next-line arrow-body-style
      .then((responses) => responses.flatMap((response, index) => {
        return parse(response.data, index).posts;
      }))
      .then((parsedPosts) => {
        const newPosts = selectNewPosts(parsedPosts, watchedState.posts);
        watchedState.posts = [...newPosts, ...watchedState.posts];
      })
      .catch((error) => {
        if (!watchedState.form.message.some((err) => err === error.message)) {
          watchedState.form.message = ['form.message.networkError'];
        }
      })
      .then(() => {
        setTimeout(refreshFeeds, 5000);
      });
    return null;
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    const { status: formStatus, url, message } = formHandler(formData, watchedState.sources);
    watchedState.form = { status: formStatus, url, message };
    if (formStatus !== 'valid') return null;
    watchedState.stateName = 'fetching';
    // clearInterval(refreshingFunctionID);
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`)
      .then((response) => {
        const newFeedID = watchedState.sources.length + 1;
        const parsedData = parse(response.data, newFeedID);
        return parsedData;
      })
      .then((parsedData) => {
        watchedState.sources.unshift(url);
        watchedState.feeds.unshift(parsedData.feed);
        watchedState.posts = [...parsedData.posts, ...watchedState.posts];
        watchedState.form = {
          status: 'valid',
          url: '',
          message: ['form.message.fetchingSucces'],
        };
        watchedState.stateName = 'idle';
      })
      .catch((error) => {
        if (error.message === 'parse xml error') {
          watchedState.form = {
            status: 'valid',
            url: '',
            message: ['form.message.invalidRSS'],
          };
        } else if (error.message === 'Network Error' || error.message === 'no internet') {
          watchedState.form.message = ['form.message.networkError'];
        }
        watchedState.stateName = 'idle';
      })
      .then(() => {
        setTimeout(refreshFeeds, 5000);
      });
    return null;
  });

  const posts = document.querySelector('.posts');
  posts.addEventListener('click', (e) => {
    const clickedPostId = e.target.dataset.id;
    if (clickedPostId) {
      const clickedPost = watchedState.posts.find((post) => post.id === clickedPostId);
      clickedPost.touched = true;
    }
  });

  const myModal = document.querySelector('#myModal');
  myModal.addEventListener('show.bs.modal', (e) => handleModalContent(e, watchedState));
};
