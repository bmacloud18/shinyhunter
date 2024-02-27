//script for viewing a completed hunt or another user's active hunt

import api from './APIclient.js';
import header from './header.js';
import getPage from './getPage.js';

const url = window.location.href;

const query = window.location.search;
let parameters = new URLSearchParams(query);
let page_id = parameters.get('id');
const page = getPage(url);