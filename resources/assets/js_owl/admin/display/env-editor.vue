<template>
    <form method="post" :action="action">
        <input type="hidden" name="_token" :value="csrfToken" />
        <div class="links-row"></div>
        <div class="card card-default">
            <div class="card-heading"></div>
            <table id="env_editor_table" class="table table-striped">
                <thead>
                    <tr>
                        <th class="row-header">{{ labels.key }}</th>
                        <th class="row-header">{{ labels.value }}</th>
                        <th class="row-header"></th>
                    </tr>
                </thead>
                <thead class="table table-striped table table-striped">
                    <tr></tr>
                </thead>
                <tbody>
                    <tr v-for="(value, index) in values" :key="index" class="env-row">
                        <td class="row-link">
                            <span v-if="keysReadonly">{{ value.key }}</span>
                            <input
                                v-else
                                v-model="value.key"
                                class="form-control env-key"
                                type="text"
                                :name="`variables[${value.key}][key]`"
                                :readonly="!value.editable"
                            />
                        </td>
                        <td class="row-datetime">
                            <input
                                v-model="value.value"
                                class="form-control env-value"
                                type="text"
                                :name="`variables[${value.key}][value]`"
                                :readonly="!value.editable"
                            />
                        </td>
                        <td class="row-link" style="vertical-align: inherit">
                            <div v-if="canDelete" class="pull-right">
                                <button
                                    class="btn btn-xs btn-danger text-white env-remove"
                                    title="delete"
                                    type="button"
                                    @click="removeEnv(index)"
                                >
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="card-footer">
                <button
                    v-if="canAdd"
                    id="env_add_entry"
                    class="btn btn-primary text-white"
                    type="button"
                    @click="addEnv"
                >
                    <i class="fas fa-plus"></i> {{ labels.add }}
                </button>
                <div class="pull-right">
                    <button class="btn btn-primary" type="submit">
                        <i class="fas fa-check"></i> {{ labels.save }}
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
