/**
 * @see http://www.daterangepicker.com/
 */
window.Cookies = require('js-cookie')


const Selector = {
  TOGGLE_BUTTON    : '[data-widget="pushmenu"]',
  SIDEBAR_MINI     : '.sidebar-mini',
  SIDEBAR_COLLAPSED: '.sidebar-collapse',
  BODY             : 'body',
  OVERLAY          : '#sidebar-overlay',
  WRAPPER          : '.wrapper'
}

const ClassName = {
  SIDEBAR_OPEN: 'sidebar-open',
  COLLAPSED   : 'sidebar-collapse',
  OPEN        : 'sidebar-open',
  SIDEBAR_MINI: 'sidebar-mini'
}


const sidebar = $('.sidebar-mini');
const sizecolapsed = 1200;
var collapse = sidebar.hasClass('sidebar-collapse')

function close() {
  collapsed();
  Cookies.set('menu-state', 'close');
}

function collapsed() {
  sidebar.addClass('sidebar-collapse');
  sidebar.removeClass('sidebar-open');
}

function open() {
  sidebar.removeClass('sidebar-collapse');
  sidebar.addClass('sidebar-open');
  Cookies.set('menu-state', 'open');
}

function toggle() {
  if (Cookies.get('menu-state') === 'open') {
    Cookies.set('menu-state', 'close');
  } else {
    Cookies.set('menu-state', 'open');
  }
}


$(window).on('load', () => {
  if (Cookies.get('menu-state') === 'open') {
    open();
  } else if (Cookies.get('menu-state') === 'close') {
    close();
  } else {
    open();
  }

  if($(window).width() <= sizecolapsed) {
    collapsed();
  }

  $('[data-widget="pushmenu"]').on('click', function() {
    toggle();
  });
});
