import i18next from 'i18next';

const buildFeeds = (feedsState) => {
  if (feedsState.length === 0) {
    return '';
  }
  const feedsItems = feedsState.map((feed) => `<li class="list-group-item"><h3>${feed.channelTitle}</h3><p>${feed.channelDescription}</p></li>`);
  return `<h2>Фиды</h2><ul class="list-group mb-5">${feedsItems.join('')}</ul>`;
};
const buildPosts = (postsState) => {
  if (postsState.length === 0) {
    return '';
  }
  const postsItems = postsState.map((post, i) => `<li class="list-group-item d-flex justify-content-between align-items-start"><a href="${post.link}" class="font-weight-bold" data-id="${i}">${post.title}</a><button type="button" class="btn btn-primary btn-sm" data-id="${i}" data-toggle="modal" data-target="#modal">Просмотр</button></li>`);
  return `<h2>Посты</h2><ul class="list-group">${postsItems.join('')}</ul>`;
};

const renderForm = (stateForm) => {
  const form = document.querySelector('form');
  if (stateForm.rssLink === '') form.reset();
  const feedback = document.querySelector('.feedback');
  feedback.innerHTML = i18next.t(stateForm.errors.join(''));
  const submitButtonSpinner = document.querySelector('[type="submit"]').querySelector('.spinner-grow');
  const commandInvisibleClass = stateForm.fetching ? 'remove' : 'add';
  submitButtonSpinner.classList[commandInvisibleClass]('invisible');
};

const renderContent = (state) => {
  const feed = document.querySelector('.feed');
  const posts = document.querySelector('.posts');

  const feedsData = buildFeeds(state.feeds);
  feed.innerHTML = feedsData;
  const postsData = buildPosts(state.posts);
  posts.innerHTML = postsData;
};

export { renderContent, renderForm };
