import onChange from 'on-change';
import { renderContent, renderForm } from './utils/render.js';

const state = {
  form: {
    isValid: true,
    rssLink: '',
    errors: [],
    // fetching: false,
  },
  stateName: 'init',
  sources: [],
  feeds: [],
  posts: [],
};

const watchedState = onChange(state, (path) => {
  // console.log(state);
  if (path === 'form') {
    renderForm(state.form);
  } else if (path === 'form.errors') {
    renderForm(state.form);
  } else if (path === 'form.rssLink') {
    renderForm(state.form);
  } else if (path === 'posts') {
    renderContent(state);
  } else if (path === 'stateName') {
    renderForm(state.form, state.stateName);
  }
});

export default watchedState;
