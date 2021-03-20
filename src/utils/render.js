const buildFeeds = (feedsState) => {
  if (feedsState.length === 0) {
    return '';
  }
  const feedsItems = feedsState.map((feed) => `<li class="list-group-item px-0 "><h3 class="h4">${feed.channelTitle}</h3><p class="m-0">${feed.channelDescription}</p></li>`);
  return `
  <div class="card shadow">
  <div class="card-body">
    <h2 class="h3">Фиды</h2>
    <ul class="list-group-flush ps-0 m-0">${feedsItems.join('')}</ul>
  </div>
</div>`;
};
const buildPosts = (postsState) => {
  if (postsState.length === 0) {
    return '';
  }
  const postsItems = postsState.map((post) => `<li class="list-group-item d-flex justify-content-between align-items-center border-light px-0"><a href="${post.link}" target="_blank" class="${post.touched ? 'fw-normal font-weight-normal' : 'fw-bold font-weight-bold'} link-dark" data-id="${post.id}" rel="noopener noreferrer">${post.title}</a><button type="button" class="btn btn-primary btn-sm ms-2 fw-bolder" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#myModal" >Просмотр</button></li>`);
  return `
  <div class="card shadow">
  <div class="card-body">
    <h2 class="h3">Посты</h2>
    <ul class="list-group-flush ps-0">${postsItems.join('')}</ul>
  </div>
</div>`;
};

const renderForm = (stateForm, stateName, i18next) => {
  const form = document.querySelector('form');
  if (stateForm.url === '') form.reset();

  const inputURL = document.querySelector('input[name=url]');
  inputURL.readOnly = stateName === 'fetching';

  const feedback = document.querySelector('.feedback');
  const feedbackMessage = i18next.t(stateForm.message.join(''));
  const feedbackType = stateForm.status === 'valid' ? 'success' : 'danger';
  feedback.innerHTML = `<div class="text-${feedbackType}">${feedbackMessage}</div>`;

  const submitButton = document.querySelector('[type="submit"]');
  const submitButtonSpinner = submitButton.querySelector('.spinner-grow');
  submitButton.disabled = stateName === 'fetching';

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
