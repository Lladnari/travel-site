// App.js

import '../styles/styles.css';
import MobileMenu from './modules/MobileMenu.js';

let oMobileMenu = new MobileMenu();

if (module.hot) {
    module.hot.accept();
}
