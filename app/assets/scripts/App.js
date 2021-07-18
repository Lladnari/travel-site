// App.js

let iDebug = 5;

import '../styles/styles.css';
import MobileMenu from './modules/MobileMenu.js';
import RevealOnScroll from './modules/RevealOnScroll.js';
import StickyHeader from './modules/StickyHeader.js';

let stickyHeader = new StickyHeader();
let oMobileMenu = new MobileMenu();
new RevealOnScroll(document.querySelectorAll(".feature-item"), 85);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 75);

if (module.hot) {
    module.hot.accept();
}
