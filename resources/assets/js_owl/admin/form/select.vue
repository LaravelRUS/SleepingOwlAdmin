<template>
    <div data-soa-select-root>
        <Multiselect
            track-by="id"
            label="text"
            :allow-empty="allowEmpty"
            :deselect-label="required ? '' : labels.deselect"
            :disabled="effectiveReadonly"
            :internal-search="!remote"
            :limit="resolvedLimit"
            :loading="loading"
            :max="resolvedMax"
            :multiple="multiple"
            :options="localOptions"
            :placeholder="placeholder"
            :searchable="true"
            :select-label="labels.select"
            :selected-label="labels.selected"
            :taggable="effectiveTaggable"
            :model-value="selection"
            @search-change="searchOptions"
            @tag="addTag"
            @update:model-value="selectionChanged"
        >
            <template #noResult>{{ emptyMessage }}</template>
            <template #noOptions>{{ emptyMessage }}</template>
        </Multiselect>

        <span v-if="remoteStatusMessage" data-soa-select-status aria-live="polite">
            {{ remoteStatusMessage }}
        </span>

        <input
            v-if="!multiple"
            ref="nativeControl"
            v-bind="attributes"
            data-soa-select-native
            type="hidden"
            :disabled="effectiveReadonly"
            :value="singleValue"
        />
        <select
            v-else
            ref="nativeControl"
            v-bind="attributes"
            data-soa-select-native
            hidden
            multiple
            :disabled="effectiveReadonly"
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
import { mergeRemoteSelectOptions } from './select-remote-options'
import { createRemoteSelectSearch } from './select-remote-search'
import { normalizeLegacySelect2Options } from './select2-option-migration'

export default defineComponent({
    name: 'ElementSelect',
    components: { Multiselect },
    props: {
        attributes: { type: Object, required: true },
        legacyOptions: { type: Object, default: () => ({}) },
        labels: { type: Object, required: true },
        limit: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        multiple: Boolean,
        options: { type: Array, default: () => [] },
        remote: { type: Object, default: null },
        readonly: Boolean,
        required: Boolean,
        taggable: Boolean,
        value: { type: [Array, Number, String], default: null },
    },
    data() {
        const localOptions = copySelectOptions(this.options)

        return {
            legacy: normalizeLegacySelect2Options(this.legacyOptions),
            loading: false,
            localOptions,
            remoteError: false,
            remoteSearch: null,
            searchQuery: '',
            selection: initialSelectValue(localOptions, this.value, this.multiple),
        }
    },
    computed: {
        allowEmpty() {
            return this.legacy.allowEmpty ?? !this.required
        },
        effectiveReadonly() {
            return this.legacy.readonly ?? this.readonly
        },
        effectiveTaggable() {
            return this.legacy.taggable ?? this.taggable
        },
        emptyMessage() {
            return this.remoteError ? this.labels.error : this.labels.noItems
        },
        minimumSearchLength() {
            return this.legacy.minSymbols ?? Number(this.remote?.minSymbols ?? 0)
        },
        placeholder() {
            if (this.legacy.placeholder !== null) return this.legacy.placeholder

            return this.localOptions.length || this.remote
                ? this.labels.placeholder
                : this.labels.noItems
        },
        remoteStatusMessage() {
            if (this.remoteError) return this.labels.error
            if (this.loading) return this.labels.searching
            if (this.searchQuery && this.searchQuery.length < this.minimumSearchLength) {
                return this.labels.tooShort
            }

            return ''
        },
        resolvedLimit() {
            return this.limit > 0 ? this.limit : 99999
        },
        resolvedMax() {
            const maximum = this.legacy.max ?? this.max

            return maximum > 0 ? maximum : false
        },
        selectedIds() {
            return selectedOptionIds(this.selection, this.multiple)
        },
        singleValue() {
            return selectFormValue(this.selectedIds[0])
        },
    },
    mounted() {
        this.mountRemoteSearch()
    },
    beforeUnmount() {
        this.remoteSearch?.destroy()
        this.remoteSearch = null
    },
    methods: {
        addTag(value) {
            if (!this.effectiveTaggable || this.reachedMaximum()) return

            const next = appendSelectTag(this.localOptions, this.selection, value, this.multiple)
            this.localOptions = next.options
            this.selectionChanged(next.selection)
        },
        applyRemoteOptions(options) {
            this.remoteError = false
            this.localOptions = mergeRemoteSelectOptions(this.selection, options, this.multiple)
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
        mountRemoteSearch() {
            if (!this.remote) return

            this.remoteSearch = createRemoteSelectSearch({
                ...this.remote,
                document: this.$el.ownerDocument,
                http: globalThis.Admin.Http,
                minSymbols: this.minimumSearchLength,
                onError: () => {
                    this.remoteError = true
                },
                onLoading: (loading) => {
                    this.loading = loading
                    if (loading) this.remoteError = false
                },
                onResults: this.applyRemoteOptions,
            })
        },
        reachedMaximum() {
            return this.resolvedMax !== false && this.selectedIds.length >= this.resolvedMax
        },
        searchOptions(query) {
            this.searchQuery = String(query ?? '').trim()
            this.remoteSearch?.search(this.searchQuery)
        },
        async selectionChanged(value) {
            this.selection = value
            await nextTick()
            this.dispatchChange()
        },
    },
})
</script>
