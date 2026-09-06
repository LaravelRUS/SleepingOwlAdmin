import { defineComponent } from 'vue'

import { withLegacyInlineTemplate } from '../../libs/vue-inline-template'
import { LegacyMultiselect, NativeMultiselect } from './multiselect-compat'

window.Multiselect = NativeMultiselect;

export default withLegacyInlineTemplate(defineComponent({
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
        //this.value значение поля multiselect, когда модель созадаётся this.value будет null, поэтому делаем проверку
        if (this.multiple && this.value) {
            this.val = this.options.filter(a => this.value.indexOf(a.id) !== -1 || this.value.indexOf(a.id.toString()) !== -1)
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
        Multiselect: LegacyMultiselect
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
}))
