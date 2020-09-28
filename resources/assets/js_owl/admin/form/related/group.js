import { each } from 'lodash';

Vue.component('related-group', {
    props: {
        primary: {
            type: [Number, String],
            required: false,
        },

        name: {
            type: String,
            required: true,
        },

        index: {
            type: [Number, String],
            required: false,
        },

        label: {
            type: String,
            required: false,
        },

        removed: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        canRemove() {
            return true;
        },
    },

    mounted() {

        each(this.$el.querySelectorAll('input, select'), (el) => {
            const id = el.getAttribute('id');
            if (id) {
                el.setAttribute('id', `${id}_${this.index}`);
            }
        });

        if (!this.primary) {
            each(this.$el.querySelectorAll('input, select'), (el) => {
                const name = el.getAttribute('name');
                if (name) {
                    el.setAttribute('name', `${this.name}[new_${this.index}][${name}]`);
                }
            });
        }
    },

    methods: {
        handleRemove() {
            this.$emit('remove', this.primary, this.index);
        },
    },
});
