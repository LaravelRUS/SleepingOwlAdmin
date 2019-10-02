import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import * as types from './mutation_types'
Vue.use(Vuex);
window.$cookies = VueCookies;

const debug = process.env.NODE_ENV !== 'production';

// initial state
const state = {
    added: []
};

// getters
const getters = {
    // allProducts: state => state.all, // would need action/mutation if data fetched async
    // getNumberOfProducts: state => (state.all) ? state.all.length : 0,
    cartTasks: state => {
        return state.added.map((task) => {
            const t = state.added.find(p => p.id === task.id)

            return {
                id: t.id,
                task: t.task,
                gold: t.gold,
                experience: t.experience,
                grade: t.grade
            }
        })
    },
    addClassToButton: state => task => {
        const t = state.added.find(p => p.id === task.id);
        if(t)
            return 'text-green';
        else
            return '';
    }
};

// actions
const actions = {
    addToCart({ commit }, task){
        commit(types.ADD_TO_CART, {
            id: task.id,
            task: task.task,
            gold: task.gold,
            experience: task.experience,
            grade: task.grade
        });
    },
    removeFromCart({ commit }, index){
        commit(types.REMOVE_FROM_CART, {index});
    },
    getTasksFromCookies({ commit }){
        commit(types.GET_TASKS_FROM_COOKIES)
    }
};

// mutations
const mutations = {

    [types.ADD_TO_CART] (state, task) {
        const record = state.added.find(p => p.id === task.id);
        if (!record) {
            state.added.push({
                id: task.id,
                task: task.task,
                gold: task.gold,
                experience: task.experience,
                grade: task.grade,
                quantity: 1
            });

            //Записываем массив объектов в cookies
            $cookies.set('tasks', JSON.stringify(state.added))
        } else {
            state.added.forEach((item, i, arr) => {
                if(item.id === task.id){
                    arr.splice(i, 1);
                    //После удаления задачи, устанавливаем новые куки
                    $cookies.set('tasks', JSON.stringify(arr))
                }

            });
            swal('Задача удалена!');
        }
    },
    [types.REMOVE_FROM_CART] (state, index) {
        state.added.splice(index, 1);
        //После удаления задачи, устанавливаем новые куки
        $cookies.set('tasks', JSON.stringify(state.added))
    },
    [types.GET_TASKS_FROM_COOKIES] (state) {
        let tasksCookie = JSON.parse($cookies.get('tasks'));
        if(!state.added.length && tasksCookie.length)
            state.added = tasksCookie
    }

};

// one store for entire application
export default new Vuex.Store({
    state,
    strict: debug,
    getters,
    actions,
    mutations
});