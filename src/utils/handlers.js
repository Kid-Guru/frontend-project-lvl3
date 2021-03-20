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

export { formHandler };
