import axios from 'axios';
import i18next from 'i18next';
import parse from './utils/parse.js';
import formHandler from './utils/formHandler.js';
import watchedStateWrap from './watcher.js';
import ru from './locales/ru.js';
import resources from './locales/index.js';
import selectNewPosts from './utils/selectNewPosts.js';
import Modal from './utils/modal.js';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    console.log(i18next.store.data.ru.translation.form);
    const myModal = new Modal('exampleModal');
    const watchedState = watchedStateWrap();

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
          console.log(error.message);
          // if (!watchedState.form.message.some((err) => err === error.message)) {
          //   watchedState.form.message.push(error.message);
          // }
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
      console.log('CLICK!!!!', formData);
      const { status: formStatus, url, message } = formHandler(formData, watchedState.sources);
      watchedState.form = { status: formStatus, url, message };
      if (formStatus !== 'valid') return null;
      watchedState.stateName = 'fetching';
      // clearInterval(refreshingFunctionID);
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`)
        .then((response) => {
          const feedID = watchedState.sources.length + 1;
          const parsedData = parse(response.data, feedID);
          // watchedState.form.fetching = false;
          watchedState.stateName = 'idle';
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
        })
        .catch((error) => {
          console.log(error.message);
          watchedState.stateName = 'idle';
          // watchedState.form.errors.push(error.message);
          // watchedState.form.fetching = false;
        })
        .then(() => {
          setTimeout(refreshFeeds, 5000);
        });
      return null;
    });

    const posts = document.querySelector('.posts');
    posts.addEventListener('click', (e) => {
      const clickedElemId = e.target.dataset.id;
      if (clickedElemId) {
        watchedState.posts.find((post) => post.id === clickedElemId).touched = true;
      }
      const closestButton = e.target.closest('button[data-toggle=modal]');
      if (closestButton) {
        const { id } = closestButton.dataset;
        const searchedPost = watchedState.posts.find((post) => post.id === id);
        myModal.show(searchedPost);
      }
    });
  });
};
