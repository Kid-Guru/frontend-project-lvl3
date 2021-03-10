import axios from 'axios';
import i18next from 'i18next';
import parse from './utils/parse.js';
import formHandler from './utils/formHandler.js';
import watchedState from './watcher.js';
import ru from './locales/ru.js';
import selectNewPosts from './utils/selectNewPosts.js';
// import Modal from './utils/modal.js';

export default async () => {
  await i18next.init({
    lng: 'ru',
    // debug: true,
    resources: {
      ru,
    },
  });
  // const myModal = new Modal('exampleModal');

  const refreshFeeds = () => {
    const { sources } = watchedState;
    if (sources.length === 0) return null;
    const promises = sources.map((source) => axios.get(source));
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
        if (!watchedState.form.errors.some((err) => err === error.message)) {
          watchedState.form.errors.push(error.message);
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
    const { isValid, rssLink, errors } = formHandler(formData, watchedState.sources);
    watchedState.form = { isValid, rssLink, errors };
    if (!isValid) return null;
    // watchedState.form.fetching = true;
    watchedState.stateName = 'fetching';
    // clearInterval(refreshingFunctionID);
    axios.get(rssLink)
      .then((response) => {
        const feedID = watchedState.sources.length + 1;
        const parsedData = parse(response.data, feedID);
        // watchedState.form.fetching = false;
        watchedState.stateName = 'idle';
        return parsedData;
      })
      .then((parsedData) => {
        watchedState.sources.unshift(rssLink);
        watchedState.feeds.unshift(parsedData.feed);
        watchedState.posts = [...parsedData.posts, ...watchedState.posts];
      })
      .catch((error) => {
        watchedState.form.errors.push(error.message);
        watchedState.stateName = 'idle';
        // watchedState.form.fetching = false;
      })
      .then(() => {
        watchedState.form.rssLink = '';
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
};
