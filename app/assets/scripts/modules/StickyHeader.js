// StickyHeader.js

import throttle from "lodash/throttle"; // Only call periodically.
import debounce from "lodash/debounce"; // Call when window resizing is done.

let iDebug = 5;

class StickyHeader {
   constructor() {
      this.siteHeader   = document.querySelector(".site-header");
      this.pageSections = document.querySelectorAll(".page-section");
      this.iBrowserHeight = window.innerHeight;
      this.previousScrollY = window.scrollY;
      this.sScrollDirection = "unknown";
      this.iDebug = 5;
      this.events();
   }

   events() {
      window.addEventListener("scroll", throttle( () => this.runOnScroll(), 200));
      window.addEventListener("resize", debounce( () => {
            this.iBrowserHeight = window.innerHeight; // Update value...
         }, 333)  // after waiting 1/3 second for resizing to finish.
      );
   }

   determineScrollDirection() {
      let iScrollY = window.scrollY;
      if(iScrollY > this.previousScrollY) {
         this.sScrollDirection = "down";
      } else {
         this.sScrollDirection = "up";
      }
      this.previousScrollY = iScrollY;
   }

   runOnScroll() {
      this.determineScrollDirection();

      if (window.scrollY > 60) {
         this.siteHeader.classList.add("site-header--dark");
      } else {
         this.siteHeader.classList.remove("site-header--dark");
         document.querySelectorAll(".primary-nav a").forEach(ele => ele.classList.remove("is-current-link"));
      }
      this.pageSections.forEach( el => this.calcSection(el) );
   }

   calcSection(el) {
      let sName = el.getAttribute("data-matching-link");
      let iBottomOfScreen = window.scrollY + this.iBrowserHeight;
      let iBottomOfElement = el.offsetTop + el.offsetHeight;
      let bScrollDown = false;
      let bScrollUp = false;
      let bInView = iBottomOfScreen > el.offsetTop;
      bInView = bInView && (window.scrollY < iBottomOfElement);
      if (bInView) {
         let iScreenTop = el.getBoundingClientRect().y;
         let iScrollPercent = (iScreenTop / this.iBrowserHeight) * 100;
         if (this.iDebug > 7) {console.log(sName + "'s element " + iScrollPercent + "% in view.");}
         bScrollDown  = this.sScrollDirection == "down";
         if ((this.iDebug > 8) && bScrollDown) { console.log("down..." + iScreenTop); }
         bScrollDown = bScrollDown && iScrollPercent < 35;
         bScrollDown = bScrollDown && iScrollPercent > -0.1;
         bScrollUp = this.sScrollDirection == "up";
         if ((this.iDebug > 8) && bScrollUp) { console.log("up..." + iScreenTop); }
         bScrollUp = bScrollUp && iScrollPercent < 33;
//         bScrollUp = bScrollUp && iScrollPercent > -0.1;
         bInView = bScrollDown || bScrollUp;
         if (bInView) {
            if (this.iDebug > 7) {console.log("True, update current link...");}
            let matchingLink = el.getAttribute("data-matching-link");
            document.querySelectorAll(`.primary-nav a:not(${matchingLink})`).forEach(el => el.classList.remove("is-current-link"));
//            document.querySelectorAll(".primary-nav a").forEach(ele => ele.classList.remove("is-current-link"));
            document.querySelector(matchingLink).classList.add("is-current-link");
         }
      }
   }
}

export default StickyHeader;
