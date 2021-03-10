import * as yup from 'yup';

const schema = yup.object().shape({
  url: yup.string().required('form.fieldError.required').url('form.fieldError.invalidURL'),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return [];
  } catch (e) {
    return e.errors;
  }
};

export default validate;
