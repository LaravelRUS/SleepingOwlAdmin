import Multiselect from 'vue-multiselect'
//import "vue-multiselect/dist/vue-multiselect.min.css"

Vue.component('deselect', Vue.extend({
    props: {
        value: {},
        options: {},
        multi: false,
    },

    computed: {
        val(){
            if (!this.multi) {
                return this.opts.filter(a => a.id === this.value);
            }

            return this.opts.filter(a => {
                console.log(a.id, this.value.indexOf(a.id));
                return this.value.indexOf(a.id) !== -1
            })

        },
        opts(){
            let opts = [];
            _.each(this.options, function (elem, index) {
                opts.push({id: parseInt(index) || index, text: elem});
            });
            return opts;
        },
        selValue(){
            if (this.multi) {
                let opts = [];
                _.each(this.val, function (elem, index) {
                    opts.push(index);
                });
                return opts;
            }
            if (this.val) {
                return this.val.id;
            }
        }
    },
    components: {
        Multiselect
    },
    data () {
        return {}
    }
}));
