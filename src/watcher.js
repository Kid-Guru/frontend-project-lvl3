import onChange from 'on-change';
import { renderContent, renderForm } from './utils/render.js';

const state = {
  form: {
    status: '',
    url: '',
    message: [],
  },
  stateName: 'init',
  sources: [],
  feeds: [],
  posts: [],
};

const watchedState = onChange(state, (path) => {
  console.log(state);
  if (path === 'form') {
    renderForm(state.form);
  } else if (path === 'form.errors') {
    renderForm(state.form);
  } else if (path === 'form.url') {
    renderForm(state.form);
  } else if (path === 'posts') {
    renderContent(state);
  } else if (path === 'stateName') {
    renderForm(state.form, state.stateName);
  } else if (path.endsWith('touched') === true) {
    renderContent(state);
  }
});

export default watchedState;
