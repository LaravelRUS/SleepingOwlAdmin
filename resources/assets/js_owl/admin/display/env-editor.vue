<template>
    <form method="post" :action="action">
        <input type="hidden" name="_token" :value="csrfToken" />
        <div data-env-links :class="classes.links"></div>
        <div data-env-card :class="classes.card">
            <div data-env-card-heading :class="classes.cardHeading"></div>
            <table id="env_editor_table" data-env-table :class="classes.table">
                <thead>
                    <tr>
                        <th :class="classes.header">{{ labels.key }}</th>
                        <th :class="classes.header">{{ labels.value }}</th>
                        <th :class="classes.header"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(value, index) in values"
                        :key="index"
                        data-env-row
                        :class="classes.row"
                    >
                        <td :class="classes.keyCell">
                            <span v-if="keysReadonly">{{ value.key }}</span>
                            <input
                                v-else
                                v-model="value.key"
                                data-env-key
                                :class="classes.keyInput"
                                type="text"
                                :name="`variables[${value.key}][key]`"
                                :readonly="!value.editable"
                            />
                        </td>
                        <td :class="classes.valueCell">
                            <input
                                v-model="value.value"
                                data-env-value
                                :class="classes.valueInput"
                                type="text"
                                :name="`variables[${value.key}][value]`"
                                :readonly="!value.editable"
                            />
                        </td>
                        <td :class="classes.removeCell">
                            <div v-if="canDelete" :class="classes.removeWrapper">
                                <button
                                    data-env-remove
                                    :class="classes.removeButton"
                                    :title="labels.remove"
                                    :aria-label="labels.remove"
                                    type="button"
                                    @click="removeEnv(index)"
                                >
                                    <i :class="classes.removeIcon" aria-hidden="true"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div data-env-footer :class="classes.footer">
                <button
                    v-if="canAdd"
                    id="env_add_entry"
                    data-env-add
                    :class="classes.addButton"
                    type="button"
                    @click="addEnv"
                >
                    <i :class="classes.addIcon" aria-hidden="true"></i> {{ labels.add }}
                </button>
                <div :class="classes.saveWrapper">
                    <button data-env-save :class="classes.saveButton" type="submit">
                        <i :class="classes.saveIcon" aria-hidden="true"></i> {{ labels.save }}
                    </button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import { defineComponent } from 'vue'

import { appendEnvValue, createEnvValues, removeEnvValue } from './env-editor-values'

export default defineComponent({
    name: 'EnvEditor',
    props: {
        action: { type: String, required: true },
        canAdd: Boolean,
        canDelete: Boolean,
        classes: { type: Object, default: () => ({}) },
        csrfToken: { type: String, required: true },
        data: { type: [Array, Object], default: () => ({}) },
        errorText: { type: String, required: true },
        keysReadonly: Boolean,
        labels: { type: Object, required: true },
    },
    data() {
        return { values: createEnvValues(this.data) }
    },
    methods: {
        addEnv() {
            appendEnvValue(this.values)
        },
        removeEnv(index) {
            if (!removeEnvValue(this.values, index)) showAccessDenied(this.errorText)
        },
    },
})

function showAccessDenied(title) {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: bindToastTimer,
    })

    toast.fire({ icon: 'error', title })
}

function bindToastTimer(toast) {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
}
</script>
