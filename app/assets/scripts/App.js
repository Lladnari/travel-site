// App.js

let iDebug = 0;

import '../styles/styles.css';
import 'lazysizes';
import MobileMenu from './modules/MobileMenu.js';
import RevealOnScroll from './modules/RevealOnScroll.js';
import StickyHeader from './modules/StickyHeader.js';

// import Modal from './modules/Modal.js';
// new Modal();

new StickyHeader();
new MobileMenu();
new RevealOnScroll(document.querySelectorAll(".feature-item"), 85);
new RevealOnScroll(document.querySelectorAll(".testimonial"), 75);
let modal; /* Create undefined global variable to use in functions. */

document.querySelectorAll(".open-modal").forEach(elm => {
    elm.addEventListener("click", evnt => {
        let iDelayMS = 100;
        let sFileName = "./modules/Modal.js";
        evnt.preventDefault();
        if (typeof modal == "undefined") { // first request.
            if (iDebug > 8) { console.log("Loading Modal.js..."); }
            import(/* webpackChunkName: "modal" */ "./modules/Modal.js").then(mFile => {
                setTimeout( () => modal = new mFile.default(), 10);
                setTimeout( () => modal.openTheModal(), iDelayMS); // wait until object is ready before calling.
                if (iDebug > 8) { console.log(sFileName + " loaded after "+ iDelayMS + "MS."); }
            }).catch( () => console.log(sFileName + " was not loaded.") );
        } else {
            modal.openTheModal();
            if (iDebug > 8) { console.log("Modal opened."); }
        }
    }) // elm.addEventListener()
}) // ...forEach()

if (module.hot) {
    module.hot.accept(); // Whjy?
}
