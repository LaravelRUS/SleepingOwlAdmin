/**
 * @see https://github.com/js-cookie/js-cookie
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


const sidebar = $('.sidebar-mini')
const sizecolapsed = 1200
var collapse = sidebar.hasClass('sidebar-collapse')

function close() {
  collapsed()
  localStorage.setItem('menu-state', 'close')
  Cookies.set('menu-state', 'close')
}

function collapsed() {
  sidebar.addClass('sidebar-collapse')
  sidebar.addClass('sidebar-open')
  // sidebar.removeClass('sidebar-open')
}

function open() {
  sidebar.removeClass('sidebar-collapse')
  sidebar.addClass('sidebar-open')
  localStorage.setItem('menu-state', 'open')
  Cookies.set('menu-state', 'open')
}

function toggle() {
  if (Cookies.get('menu-state') === 'open' || localStorage.getItem('menu-state') === 'open') {
    localStorage.setItem('menu-state', 'close')
    Cookies.set('menu-state', 'close')
  } else {
    localStorage.setItem('menu-state', 'open')
    Cookies.set('menu-state', 'open')
  }
}


$(window).on('load', () => {
  if (Cookies.get('menu-state') === 'open' || localStorage.getItem('menu-state') === 'open') {
    open()
  } else if (Cookies.get('menu-state') === 'close' || localStorage.getItem('menu-state') === 'close') {
    close()
  } else {
    open()
  }

  if($(window).width() <= sizecolapsed) {
    collapsed()
  }

  $('[data-widget="pushmenu"]').on('click', function() {
    toggle()
  })
})
