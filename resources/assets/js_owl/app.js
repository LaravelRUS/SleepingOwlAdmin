/**
 * Load the production Vue compatibility runtime before the legacy
 * application dependencies.
 */

// Select build
// import Vue from 'vue/dist/vue'            //dev
// import Vue from 'vue/dist/vue.common.js'  //prod

require('./libs/vue-prod')

require('./bootstrap');
