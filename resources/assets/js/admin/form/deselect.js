import Multiselect from 'vue-multiselect'
//import "vue-multiselect/dist/vue-multiselect.min.css"

Vue.component('deselect', Vue.extend({
    props: {
        value: {
            type: [Number, Array, String]
        },
        id:{
            type: String
        },
        options: {
            type: Array,
            default: []
        },
        multiple: {
            type: Boolean
        }
    },
    mounted() {
        this.val = _.first(this.options.filter(a => a.id === this.value));
        if (this.multiple) {
            this.val = this.options.filter(a => this.value.indexOf(a.id) !== -1)
        }
    },
    computed: {
        preparedVal(){
            if (this.val) {
                if (this.multiple) {
                    return this.val.map(a => a.id);
                }
                return this.val.id;
            }
        }
    },
    watch: {
        // whenever question changes, this function will run
        preparedVal: function (val) {
            this.$nextTick(() => {
                $("#" + this.id).trigger('change')
            });
        }
    },
    components: {
        Multiselect
    },
    methods: {
        hasOption(id){
            if (this.preparedVal) {
                return this.preparedVal.indexOf(id) !== -1;
            }
            return false;
        },
        addTag(newTag){
            const tag = {
                id: newTag,
                text: newTag
            };
            this.options.push(tag);
            this.val.push(tag);
        }
    },
    data () {
        return {
            val: '',
        }
    }
}));
