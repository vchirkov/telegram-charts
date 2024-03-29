import './css/index.css';
import './css/index_night.css';
import './util/greet';

import React from 'react';
import {render} from 'react-dom';

import {App} from './components/App'

const appEl = document.getElementById('app');

render(<App width={appEl.clientWidth}/>, appEl);

