import { defineComponent } from 'vue'

import { withLegacyInlineTemplate } from '../../libs/vue-inline-template'

export default withLegacyInlineTemplate(defineComponent({
    props: {
        data: {
            type: Array,
            default: []
        },
        errorText: {
            type: String
        }
    },
    mounted() {
        for (const key in this.data) {
            this.values.push({
                key,
                value: this.data[key].value,
                deletable: this.data[key].deletable,
                editable: this.data[key].editable,
            });
        }
    },
    methods: {
        removeEnv(key) {
            if (this.values[key].deletable)
                this.values.splice(key, 1)
            else {
              const Toast = Swal.mixin({
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                      }
                    })

                    Toast.fire({
                      icon: 'error',
                      title: this.errorText
                    })
            }
        }
    },
    data() {
        return {
            values: [],
        }
    }
}))
