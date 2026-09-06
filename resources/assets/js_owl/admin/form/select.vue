<template>
    <div data-soa-select-root>
        <Multiselect
            track-by="id"
            label="text"
            :allow-empty="!required"
            :deselect-label="required ? '' : labels.deselect"
            :disabled="readonly"
            :limit="resolvedLimit"
            :max="resolvedMax"
            :multiple="multiple"
            :options="localOptions"
            :placeholder="placeholder"
            :searchable="true"
            :select-label="labels.select"
            :selected-label="labels.selected"
            :taggable="taggable"
            :model-value="selection"
            @tag="addTag"
            @update:model-value="selectionChanged"
        >
            <template #noResult>{{ labels.noItems }}</template>
            <template #noOptions>{{ labels.noItems }}</template>
        </Multiselect>

        <input
            v-if="!multiple"
            ref="nativeControl"
            v-bind="attributes"
            data-soa-select-native
            type="hidden"
            :value="singleValue"
        />
        <select
            v-else
            ref="nativeControl"
            v-bind="attributes"
            data-soa-select-native
            hidden
            multiple
        >
            <option
                v-for="(option, index) in localOptions"
                :key="optionKey(option, index)"
                :selected="optionSelected(option.id)"
                :value="formValue(option.id)"
            >
                {{ option.text }}
            </option>
        </select>

        <div v-if="required && multiple && !selectedIds.length" class="text-danger pt-2 pb-3">
            {{ labels.required }}
        </div>
    </div>
</template>

<script>
import { defineComponent, nextTick } from 'vue'
import Multiselect from 'vue-multiselect'

import {
    appendSelectTag,
    copySelectOptions,
    initialSelectValue,
    isSelectOptionSelected,
    selectFormValue,
    selectOptionKey,
    selectedOptionIds,
} from './select-values'

export default defineComponent({
    name: 'ElementSelect',
    components: { Multiselect },
    props: {
        attributes: { type: Object, required: true },
        labels: { type: Object, required: true },
        limit: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        multiple: Boolean,
        options: { type: Array, default: () => [] },
        readonly: Boolean,
        required: Boolean,
        taggable: Boolean,
        value: { type: [Array, Number, String], default: null },
    },
    data() {
        const localOptions = copySelectOptions(this.options)

        return {
            localOptions,
            selection: initialSelectValue(localOptions, this.value, this.multiple),
        }
    },
    computed: {
        placeholder() {
            return this.localOptions.length ? this.labels.placeholder : this.labels.noItems
        },
        resolvedLimit() {
            return this.limit > 0 ? this.limit : 99999
        },
        resolvedMax() {
            return this.max > 0 ? this.max : false
        },
        selectedIds() {
            return selectedOptionIds(this.selection, this.multiple)
        },
        singleValue() {
            return selectFormValue(this.selectedIds[0])
        },
    },
    methods: {
        addTag(value) {
            if (!this.multiple || this.reachedMaximum()) return

            const next = appendSelectTag(this.localOptions, this.selection, value)
            this.localOptions = next.options
            this.selectionChanged(next.selection)
        },
        dispatchChange() {
            const control = this.$refs.nativeControl
            const EventConstructor = control?.ownerDocument.defaultView.Event
            if (control && EventConstructor) {
                control.dispatchEvent(new EventConstructor('change', { bubbles: true }))
            }
        },
        formValue(value) {
            return selectFormValue(value)
        },
        optionKey(option, index) {
            return selectOptionKey(option, index)
        },
        optionSelected(id) {
            return isSelectOptionSelected(this.selection, id, this.multiple)
        },
        reachedMaximum() {
            return this.resolvedMax !== false && this.selectedIds.length >= this.resolvedMax
        },
        async selectionChanged(value) {
            this.selection = value
            await nextTick()
            this.dispatchChange()
        },
    },
})
</script>
