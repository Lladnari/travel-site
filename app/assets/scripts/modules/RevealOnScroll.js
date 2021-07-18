// RevealOnScroll.js

import throttle from "lodash/throttle"; // limit how often our functions are called.
import debounce from "lodash/debounce"; // Call when window resizing is done.

class RevealOnScroll {
   constructor(els, iThresholdPercent) {
      this.itemsToReveal = els; // document.querySelectorAll(".feature-item");
      this.thresholdPercent = iThresholdPercent;
      this.iBrowserHeight = window.innerHeight;
      this.scrollThrottle = throttle(this.calcCaller, 200).bind(this); // Execute code a maximum of 5x per second.
      this.iDebug = 5;

      this.hideInitially();
      this.events();
   }

   events() {
      window.addEventListener("scroll", this.scrollThrottle);
      window.addEventListener("resize", debounce( () => {
         if (this.iDebug > 8) { console.log("Resize just ran."); }
         this.iBrowserHeight = window.innerHeight; // Update value...
      }, 333)  // after waiting 1/3 second for resizing to finish.
      );
   }

   calcCaller() {
      if (this.iDebug > 8) { console.log("function ran"); }
      this.itemsToReveal.forEach(el => {
         if (el.isRevealed == false) { // Only test if elements are not visible.
            this.calculateIfScrolledTo(el);
         }
      });
   }

   calculateIfScrolledTo(el) { // Element's top edge away from top of view port. 
      let iWindowBottom = window.scrollY + this.iBrowserHeight;
      if (iWindowBottom > el.offsetTop) {
         // Intersection Observer uses less computing resources.
         if (this.iDebug > 8) { console.log("element was calculated"); }
         let iDistanceFromScreenTop = el.getBoundingClientRect().top
         let scrollPercent = (iDistanceFromScreenTop / this.iBrowserHeight) * 100
         if (scrollPercent < this.thresholdPercent) {
            el.classList.add("reveal-item--is-visible");
            el.isRevealed = true; // This element has already been revealed.
            if (el.isLastItem) {
               window.removeEventListener("scroll", this.scrollThrottle); // Stop listening.
            }
         } 
         /*
         else {
            console.log("Percentage: " + scrollPercent)
         } /* */
      }
   }

   hideInitially() {
      // single line single parameter arrow function.
      this.itemsToReveal.forEach(el => {
         el.classList.add("reveal-item");
         el.isRevealed = false;
      });
      let iLastItem = this.itemsToReveal.length -1;
      this.itemsToReveal[iLastItem].isLastItem = true; // All others default to false.

      /* Traditional function use.
      this.itemsToReveal.forEach(function(el) {
         el.classList.add("reveal-item");
      }); /* */
   }
}

export default RevealOnScroll;
