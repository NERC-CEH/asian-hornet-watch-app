/** ****************************************************************************
 * App start.
 *****************************************************************************/

import App from 'app';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import 'photoswipe/dist/default-skin/default-skin.png';
import 'photoswipe/dist/default-skin/default-skin.svg';

import './records/router';
import './info/router';
import './settings/router';
import './user/router';

import '../node_modules/ratchet/dist/css/ratchet.css';
import '../node_modules/ratchet/dist/fonts/ratchicons.ttf';
import '../node_modules/ratchet/dist/fonts/ratchicons.woff';
import '../dist/_build/styles/icons.css';
import './common/styles/app.scss';

// Load the mighty app :)
App.start();
