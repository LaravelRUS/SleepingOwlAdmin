module.exports = (function () {

  const scrollButton = document.getElementById('scrolltotop');

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
    window.scroll(0, 0);
  }

  if (scrollButton) {
    scrollButton.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', trackScroll);
  }
})();
