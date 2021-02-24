import * as yup from 'yup';

const schema = yup.object().shape({
  rssLink: yup.string().required('Поле обязательно').url('Ссылка должна быть валидным URL'),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return [];
  } catch (e) {
    return e.inner;
  }
};

export default validate;
