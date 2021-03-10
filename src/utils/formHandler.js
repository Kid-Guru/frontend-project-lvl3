import validate from './validate.js';

export default (formData, sources) => {
  const validationResult = validate(formData);
  const { url } = formData;
  let status = 'valid';
  if (validationResult.length !== 0) {
    status = 'invalid';
  }
  const message = validationResult.map((item) => item);
  if (sources.some((i) => i === url)) {
    status = 'invalid';
    message.push('Источник уже добавлен');
  }
  return {
    status, url, message,
  };
};
