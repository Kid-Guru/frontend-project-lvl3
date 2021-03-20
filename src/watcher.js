import onChange from 'on-change';
import { renderContent, renderForm } from './utils/render.js';

const watchedStateWrapper = (i18next) => {
  const state = {
    form: {
      status: '',
      url: '',
      isValid: true,
      message: [],
    },
    stateName: 'init',
    sources: [],
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, (path) => {
    if (path === 'form') {
      renderForm(state.form, state.stateName, i18next);
    } else if (path === 'form.message') {
      renderForm(state.form, state.stateName, i18next);
    } else if (path === 'form.url') {
      renderForm(state.form, state.stateName, i18next);
    } else if (path === 'posts') {
      renderContent(state);
    } else if (path === 'stateName') {
      renderForm(state.form, state.stateName, i18next);
    } else if (path.endsWith('touched') === true) {
      renderContent(state);
    }
  });

  return watchedState;
};

export default watchedStateWrapper;
