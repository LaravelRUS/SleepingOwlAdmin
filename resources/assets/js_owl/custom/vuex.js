import store from './tasks_cart/store/index.js';
import { mapState } from 'vuex'
import {mapGetters, mapActions} from 'vuex';

window.store = store;
window.mapState = mapState;
window.mapGetters = mapGetters;
window.mapActions = mapActions;
