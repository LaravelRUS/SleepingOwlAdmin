
Vue.component('env_editor', Vue.extend({
    props: {
        data: {
            type: Array,
            default: []
        },
    },
    mounted() {
        for (k in this.data){
            this.values.push({key: k, value: this.data[k]});
        }
    },

    data () {
        return {
            values: [],
        }
    }
}));
