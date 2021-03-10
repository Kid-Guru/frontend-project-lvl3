import validate from './validate.js';

export default (formData, sources) => {
  const validationResult = validate(formData);
  const { url } = formData;
  let isValid = validationResult.length === 0;
  const errors = validationResult.map((item) => item);
  if (sources.some((i) => i === url)) {
    isValid = false;
    errors.push('Источник уже добавлен');
  }
  return { isValid, url, errors };
};
