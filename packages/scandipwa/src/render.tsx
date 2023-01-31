/* eslint-disable @scandipwa/scandipwa-guidelines/export-level-one */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/scandipwa
 * @link https://github.com/scandipwa/scandipwa
 */

import { render } from 'react-dom';

import App from 'Component/App';

import 'Style/main';

// let's register service-worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swUrl = '/service-worker.js';

        navigator.serviceWorker.register(swUrl, { scope: '/' });
    });
}

// Code bellow enables the hot reloading of plugins
// Why? I have no idea. Further debugging needed.
// TODO: understand why this helps HMR
if (module.hot) {
    module.hot.accept();
}

function HotApp() {
    return <App />;
}

render(<HotApp />, document.getElementById('root'));
