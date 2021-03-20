import validate from './validate.js';

const formHandler = (formData, sources) => {
  const validationResult = validate(formData);
  const { url } = formData;
  let status = 'valid';
  if (validationResult.length !== 0) {
    status = 'invalid';
  }
  let message = validationResult.map((item) => item);
  if (sources.some((i) => i === url)) {
    status = 'invalid';
    message = ['form.message.alreadyAdd'];
  }
  return {
    status, url, message,
  };
};

const handleModalContent = (e, watchedState) => {
  const button = e.relatedTarget;
  const { id } = button.dataset;
  const clickedPost = watchedState.posts.find((post) => post.id === id);

  const modalTitle = e.target.querySelector('.modal-title');
  const modalBody = e.target.querySelector('.modal-body');
  const linkToFullArticle = e.target.querySelector('.full-article');

  modalTitle.textContent = clickedPost.title;
  modalBody.textContent = clickedPost.description;
  linkToFullArticle.setAttribute('href', clickedPost.link);
};

export { formHandler, handleModalContent };
