import i18next from 'i18next';

const buildFeeds = (feedsState) => {
  if (feedsState.length === 0) {
    return '';
  }
  const feedsItems = feedsState.map((feed) => `<li class="list-group-item"><h3>${feed.channelTitle}</h3><p>${feed.channelDescription}</p></li>`);
  return `<h2>Фиды</h2><ul class="list-group-flush mb-5">${feedsItems.join('')}</ul>`;
};
const buildPosts = (postsState) => {
  if (postsState.length === 0) {
    return '';
  }
  const postsItems = postsState.map((post, i) => `<li class="list-group-item d-flex justify-content-between align-items-start bg-dark border-light"><a href="${post.link}" target="_blank" class="${post.touched ? 'fw-normal' : 'fw-bold'}" data-id="${post.id}" rel="noopener noreferrer">${post.title}</a><button type="button" class="btn btn-primary btn-sm" data-id="${post.id}" data-toggle="modal" >Просмотр</button></li>`);
  // return `<h2>Посты</h2><ul class="list-group">${postsItems.join('')}</ul>`;
  return `
  <div class="card bg-dark border-light text-light">
    <h2 class="card-header h4">
      Featured
    </h2>
  <div class="card-body">
    <ul class="list-group-flush">${postsItems.join('')}</ul>
  </div>
</div>`;
};

{/* <div class="card">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">

  </div>
</div> */}

const renderForm = (stateForm, stateName) => {
  const form = document.querySelector('form');
  if (stateForm.rssLink === '') form.reset();
  const feedback = document.querySelector('.feedback');
  feedback.innerHTML = i18next.t(stateForm.errors.join(''));
  const submitButton = document.querySelector('[type="submit"]');
  const submitButtonSpinner = submitButton.querySelector('.spinner-grow');
  const toSubmitButtonDisable = stateName === 'fetching' ? 'add' : 'remove';
  submitButton.classList[toSubmitButtonDisable]('disabled');
  const toInvisibleSpinner = stateName === 'fetching' ? 'remove' : 'add';
  submitButtonSpinner.classList[toInvisibleSpinner]('invisible');
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
