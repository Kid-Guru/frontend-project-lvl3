/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';
// import { fileURLToPath } from 'url';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import '@testing-library/jest-dom';
// import { waitFor, screen } from '@testing-library/dom';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import appRun from '../src/init.js';

// const { screen, waitFor } = testingLibraryDom;
// const { userEvent } = userEvent;

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const pathToIndex = getFixturePath('index.html');

const fsp = fs.promises;
nock.disableNetConnect();
axios.defaults.adapter = httpAdapter;

const elements = {};

beforeEach(async () => {
  document.body.innerHTML = await fsp.readFile(pathToIndex, 'utf-8');

  elements.input = screen.getByRole('textbox');
  elements.submit = screen.getByRole('button');
  // elements.feedback = screen.getByRole('feedback');
  elements.feedback = document.querySelector('.feedback');

  appRun();
});

test('test1 valid input', async () => {
  userEvent.type(elements.input, 'notUrl');
  userEvent.click(elements.submit);

  await waitFor(() => {
    expect(elements.feedback).toHaveTextContent(/Ссылка должна быть валидным URL/i);
  });
});
