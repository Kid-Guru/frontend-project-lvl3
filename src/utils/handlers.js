import validate from './validate.js';

const formHandler = (formData, sources) => {
  const validationResult = validate(formData);
  const { url } = formData;

  const errors = [...validationResult];

  const isSourceAlreadyExists = sources.some((i) => i === url);
  if (isSourceAlreadyExists) errors.push('form.message.alreadyExists');

  const firstError = errors[0] || '';
  const status = errors.length === 0 ? 'valid' : 'invalid';
  return {
    status, url, message: [firstError],
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
