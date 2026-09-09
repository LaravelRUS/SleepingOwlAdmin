<template>
    <div data-select-root>
        <Multiselect
            track-by="id"
            label="text"
            :allow-empty="allowEmpty"
            :deselect-label="required ? '' : labels.deselect"
            :disabled="effectiveDisabled"
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

        <span v-if="statusMessage" data-select-status aria-live="polite">
            {{ statusMessage }}
        </span>

        <input
            v-if="!multiple"
            ref="nativeControl"
            v-bind="attributes"
            data-select-native
            type="hidden"
            :disabled="effectiveDisabled"
            :value="singleValue"
        />
        <select
            v-else
            ref="nativeControl"
            v-bind="attributes"
            data-select-native
            hidden
            multiple
            :disabled="effectiveDisabled"
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

        <div
            v-if="required && multiple && !selectedIds.length"
            data-select-required
            :class="classes.required"
        >
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
import { createDependentSelectLoad } from './select-dependent-load'
import { dependentSelectValue } from './select-dependent-options'
import { mergeRemoteSelectOptions } from './select-remote-options'
import { createRemoteSelectSearch } from './select-remote-search'
import { normalizeLegacySelect2Options } from './select2-option-migration'

const SELECT_CLEAR_EVENT = 'select:clear'

export default defineComponent({
    name: 'ElementSelect',
    components: { Multiselect },
    props: {
        attributes: { type: Object, required: true },
        classes: { type: Object, default: () => ({}) },
        dependent: { type: Object, default: null },
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
            dependentLoad: null,
            dependentReady: !this.dependent || this.dependent.initialize === false,
            loadError: false,
            legacy: normalizeLegacySelect2Options(this.legacyOptions),
            loading: false,
            localOptions,
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
        effectiveDisabled() {
            return (
                this.effectiveReadonly ||
                Boolean(this.dependent && (this.loading || !this.dependentReady))
            )
        },
        effectiveTaggable() {
            return this.legacy.taggable ?? this.taggable
        },
        emptyMessage() {
            return this.loadError ? this.labels.error : this.labels.noItems
        },
        minimumSearchLength() {
            return this.legacy.minSymbols ?? Number(this.remote?.minSymbols ?? 0)
        },
        placeholder() {
            if (this.legacy.placeholder !== null) return this.legacy.placeholder

            return this.localOptions.length || this.remote || this.dependent
                ? this.labels.placeholder
                : this.labels.noItems
        },
        statusMessage() {
            if (this.loadError) return this.labels.error
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
        this.$el.addEventListener(SELECT_CLEAR_EVENT, this.clearSelection)
        this.mountRemoteSearch()
        this.mountDependentSelect()
    },
    beforeUnmount() {
        this.$el.removeEventListener(SELECT_CLEAR_EVENT, this.clearSelection)
        this.dependentLoad?.destroy()
        this.dependentLoad = null
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
        clearSelection() {
            if (this.required) return

            this.selectionChanged(this.multiple ? [] : null)
        },
        applyRemoteOptions(options) {
            this.loadError = false
            this.localOptions = mergeRemoteSelectOptions(this.selection, options, this.multiple)
        },
        async applyDependentOptions(result, context) {
            this.loadError = false
            this.localOptions = result.options
            this.selection = dependentSelectValue(result.options, result, this.value, this.multiple)
            this.dependentReady = true
            await nextTick()
            this.dispatchChange()
            this.dispatchDependentEvent('depdrop:change', {
                ...context,
                optionCount: result.options.length,
                selected: this.selectedIds,
            })
        },
        dispatchChange() {
            const control = this.$refs.nativeControl
            const EventConstructor = control?.ownerDocument.defaultView.Event
            if (control && EventConstructor) {
                control.dispatchEvent(new EventConstructor('change', { bubbles: true }))
            }
        },
        dispatchDependentEvent(name, detail = {}) {
            const control = this.$refs.nativeControl
            const EventConstructor = control?.ownerDocument.defaultView.CustomEvent
            if (control && EventConstructor) {
                control.dispatchEvent(new EventConstructor(name, { bubbles: true, detail }))
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
                    this.loadError = true
                },
                onLoading: (loading) => {
                    this.loading = loading
                    if (loading) this.loadError = false
                },
                onResults: this.applyRemoteOptions,
            })
        },
        mountDependentSelect() {
            if (!this.dependent) return

            this.dependentLoad = createDependentSelectLoad({
                ...this.dependent,
                document: this.$el.ownerDocument,
                http: globalThis.Admin.Http,
                onAfter: (context) => this.dispatchDependentEvent('depdrop:afterChange', context),
                onBefore: (context) => {
                    this.dependentReady = false
                    this.dispatchDependentEvent('depdrop:beforeChange', context)
                },
                onError: (error, context) => {
                    this.loadError = true
                    this.dispatchDependentEvent('depdrop:error', { ...context, error })
                },
                onInit: () => this.dispatchDependentEvent('depdrop:init'),
                onLoading: (loading) => {
                    this.loading = loading
                    if (loading) this.loadError = false
                },
                onResults: this.applyDependentOptions,
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
