/**
 * NOTY is a jQuery plugin that makes it easy to create
 * - alert
 * - success
 * - error
 * - warning
 * - information
 * - confirmation
 *
 * Theme:
 * - metroui
 * - bootstrap-v4
 * - light
 * - mint
 * - nest
 * - relax
 * - semanticui
 * - sunset
 *
 * messages as an alternative the standard alert dialog.
 *
 * @see http://ned.im/noty/
 */

 // new Noty({
 //   text: 'Notification text',
 //   progressBar: true,
 //   theme: 'light',
 //   timeout: 3000,
 //   type: 'error'
 // }).show();


window.Noty = require('noty')

Noty.overrideDefaults({
    theme: 'metroui'
});
