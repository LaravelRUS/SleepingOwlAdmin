/**
 * @see https://github.com/js-cookie/js-cookie
 */
window.Cookies = require('js-cookie')

// const Selector = {
//     TOGGLE_BUTTON    : '[data-widget="pushmenu"]',
//     SIDEBAR_MINI     : '.sidebar-mini',
//     SIDEBAR_COLLAPSED: '.sidebar-collapse',
//     BODY             : 'body',
//     OVERLAY          : '#sidebar-overlay',
//     WRAPPER          : '.wrapper'
// }
//
// const ClassName = {
//     SIDEBAR_OPEN: 'sidebar-open',
//     COLLAPSED   : 'sidebar-collapse',
//     OPEN        : 'sidebar-open',
//     SIDEBAR_MINI: 'sidebar-mini'
// }

const $sidebar = $('body')

const sizeColapsed = 1200

$(document).ready(function () {
    if (localStorage.getItem('sidebar-state') && !$sidebar.hasClass(localStorage.getItem('sidebar-state'))) {
        $('[data-widget="pushmenu"]').PushMenu('toggle')
    }

    if ($(window).width() <= sizeColapsed && $sidebar.hasClass('sidebar-open')) {
        $('[data-widget="pushmenu"]').PushMenu('toggle')
    }

    $(document).on('collapsed.lte.pushmenu', () => {
        localStorage.setItem('sidebar-state', 'sidebar-collapse');
        Cookies.set('sidebar-state', 'sidebar-collapse');
    })

    $(document).on('shown.lte.pushmenu', () => {
        localStorage.setItem('sidebar-state', 'sidebar-open');
        Cookies.set('sidebar-state', 'sidebar-open');
    })
});
