import validate from './validate.js';

export default (formData, sources) => {
  const validationResult = validate(formData);
  const { rssLink } = formData;
  let isValid = validationResult.length === 0;
  const errors = validationResult.map((item) => item.message);
  if (sources.some((i) => i === rssLink)) {
    isValid = false;
    errors.push('Источник уже добавлен');
  }
  return { isValid, rssLink, errors };
};
