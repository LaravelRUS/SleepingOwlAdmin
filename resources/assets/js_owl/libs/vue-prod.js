import Vue from 'vue'

import { configureVueCompat } from './vue-compat-config'

configureVueCompat(Vue)
window.Vue = Vue
