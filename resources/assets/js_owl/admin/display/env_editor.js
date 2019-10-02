
Vue.component('env_editor', Vue.extend({
    props: {
        data: {
            type: Array,
            default: []
        },
        errorText: {
            type: Text
        }
    },
    mounted() {
        for (k in this.data) {
            this.values.push({
                key: k,
                value: this.data[k].value,
                deletable: this.data[k].deletable,
                editable: this.data[k].editable,
            });
        }
    },
    methods: {
        removeEnv(key) {
            if (this.values[key].deletable)
                this.values.splice(key, 1)
            else {
                new Noty({
                    type: 'error',
                    layout: 'topRight',
                    text: this.errorText
                }).show();
            }
        }
    },
    data() {
        return {
            values: [],
        }
    }
}));
