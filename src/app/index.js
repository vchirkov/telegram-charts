import './index.css';
import './util/greet';

import React from 'react';
import {render} from 'react-dom';

import {App} from './components/App'

const appEl = document.createElement('div');

document.body.appendChild(appEl);
appEl.className = 'container';

render(<App width={appEl.clientWidth}/>, appEl);

