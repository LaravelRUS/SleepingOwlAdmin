module.exports = (function () {
  /** Scroll to top button implementation in vanilla JavaScript (ES6 - ECMAScript 6) **/

  let intervalId = 0; // Needed to cancel the scrolling when we're at the top of the page
  const scrollButton = document.getElementById('scrolltotop'); // Reference to our scroll button

  function scrollStep() {
    // Check if we're at the top already. If so, stop scrolling by clearing the interval
    if (window.pageYOffset === 0) {
      clearInterval(intervalId);
    }
    window.scroll(0, window.pageYOffset - 1000);
  }

  function trackScroll() {
    var scrolled = window.pageYOffset;
    var coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      scrollButton.classList.add('show');
    }
    if (scrolled < coords) {
      scrollButton.classList.remove('show');
    }
  }

  function scrollToTop() {
    // Call the function scrollStep() every 16.66 millisecons
    intervalId = setInterval(scrollStep, 400.66);
  }

  // When the DOM is loaded, this click handler is added to our scroll button
  if (scrollButton) {
    scrollButton.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', trackScroll);
  }
})();
