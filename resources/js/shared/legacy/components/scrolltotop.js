module.exports = (function () {

    const scrollTop = document.getElementById('scrolltotop');
    const scrollBottom = document.getElementById('scrolltobottom');

    function trackScrollTop() {
        let scrolled = window.pageYOffset;
        let coords = document.documentElement.clientHeight;

        if (scrolled > coords) {
            scrollTop.classList.add('show')
        }
        if (scrolled < coords) {
            scrollTop.classList.remove('show')
        }
    }

    function trackScrollBottom() {
        const scrolled = window.pageYOffset;
        const coords = document.documentElement.clientHeight;
        const down = document.body.scrollHeight;

        if (scrolled + coords + 10 > down) {
            scrollBottom.classList.add('hide')
        }
        if (scrolled + coords + 10 < down) {
            scrollBottom.classList.remove('hide')
        }
    }

    function scrollToTop() {
        window.scroll(0, 0)
    }

    function scrollToBottom() {
        window.scroll(0, document.body.scrollHeight || document.documentElement.scrollHeight)
    }

    if (scrollTop) {
        scrollTop.addEventListener('click', scrollToTop)
        window.addEventListener('scroll', trackScrollTop)
    }

    if (scrollBottom) {
        scrollBottom.addEventListener('click', scrollToBottom)
        window.addEventListener('scroll', trackScrollBottom);
    }

    return true
})()
