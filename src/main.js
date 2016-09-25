/** ****************************************************************************
 * App start.
 *****************************************************************************/
import 'bootstrap';
import 'ratchet';
import 'indexedDBShim';

import App from 'app';

import './records/router';
import './info/router';
import './settings/router';
import './user/router';

import '../dist/_build/styles/ratchet.css';
import '../dist/_build/styles/icons.css';
import 'photoswipe/css/photoswipe.css';
import 'photoswipe/css/default-skin.css';
import './common/styles/app.scss';

// Load the mighty app :)
App.start();
