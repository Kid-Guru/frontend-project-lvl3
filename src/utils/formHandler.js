import validate from './validate.js';

export default (formData, sources) => {
  const validationResult = validate(formData);
  const { rrsLink } = formData;
  let isValid = validationResult.length === 0;
  const errors = validationResult.map((item) => item.message);
  if (sources.some((i) => i === rrsLink)) {
    isValid = false;
    errors.push('Источник уже добавлен');
  }
  return { isValid, rrsLink, errors };
};
