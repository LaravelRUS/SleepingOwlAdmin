<template>
    <div data-related-root :class="classes.root" @click="handleClick">
        <div ref="groups" data-related-groups :class="classes.groups"></div>

        <div v-if="!readonly" data-related-actions :class="classes.actions">
            <button
                v-if="canAddMore"
                type="button"
                data-related-add
                :class="classes.add"
                @click="addNewGroup"
            >
                <i data-related-add-icon :class="classes.addIcon" aria-hidden="true"></i>
                {{ labels.add }}
            </button>
        </div>

        <input
            v-for="id in removedExistingGroups"
            :key="id"
            type="hidden"
            :name="`${name}[remove][]`"
            :value="id"
            data-related-removed
        />
    </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue'
import Sortable from 'sortablejs'

import { createRelatedGroup } from './related-dom'
import { destroyRelatedGroup, initializeRelatedGroup } from './related-lifecycle'
import { createRelatedSortable } from './related-sortable'
import {
    canAddRelatedGroup,
    firstNewGroupIndex,
    isPersistedPrimary,
    normalizeRelatedGroups,
    normalizeRemovedGroups,
} from './related-state'

export default defineComponent({
    name: 'RelatedElements',
    props: {
        classes: { type: Object, default: () => ({}) },
        draggable: Boolean,
        groups: { type: Array, required: true },
        labels: { type: Object, required: true },
        limit: { type: Number, default: null },
        name: { type: String, required: true },
        readonly: Boolean,
        removed: { type: Array, default: () => [] },
        stubHtml: { type: String, required: true },
    },
    data() {
        const groups = normalizeRelatedGroups(this.groups)

        return {
            groupCount: 0,
            groupRecords: markRaw(new Map()),
            initialGroups: markRaw(groups),
            nextIndex: firstNewGroupIndex(groups),
            removedGroups: normalizeRemovedGroups(this.removed),
            sortable: null,
        }
    },
    computed: {
        canAddMore() {
            return canAddRelatedGroup(this.limit, this.groupCount)
        },
        removedExistingGroups() {
            return this.removedGroups.filter(isPersistedPrimary)
        },
    },
    mounted() {
        this.initialGroups
            .filter((group) => !this.removedGroups.includes(group.primary))
            .forEach((group) => this.mountGroup(group, false))
        const sortableEnabled = this.draggable && !this.readonly
        this.sortable = createRelatedSortable(Sortable, this.$refs.groups, sortableEnabled)
    },
    beforeUnmount() {
        this.sortable?.destroy()
        this.sortable = null
        const records = [...this.groupRecords.values()].reverse()
        records.forEach((record) => this.destroyGroup(record))
        this.groupRecords.clear()
    },
    methods: {
        addNewGroup() {
            if (this.readonly || !this.canAddMore) return

            const index = this.nextIndex++
            const record = {
                html: this.stubHtml,
                index: String(index),
                key: `new:${index}`,
                primary: '',
            }
            const element = this.mountGroup(record, true)
            this.$nextTick(() => initializeRelatedGroup(Admin, element))
        },
        destroyGroup(record) {
            destroyRelatedGroup(Admin, record.element)
        },
        handleClick(event) {
            if (this.readonly) return

            const button = event.target?.closest?.('[data-related-remove]')
            if (!button || !this.$refs.groups.contains(button)) return

            const group = button.closest('[data-related-group]')
            if (group) this.removeGroup(group.dataset.relatedKey)
        },
        mountGroup(group, isNew) {
            const context = { ...group, isNew, name: this.name }
            const element = createRelatedGroup(this.$el.ownerDocument, group.html, context)
            const record = markRaw({ ...group, element })
            this.$refs.groups.append(element)
            this.groupRecords.set(group.key, record)
            this.groupCount++

            return element
        },
        removeGroup(key) {
            const record = this.groupRecords.get(key)
            if (!record) return

            this.destroyGroup(record)
            record.element.remove()
            this.groupRecords.delete(key)
            this.groupCount--
            if (isPersistedPrimary(record.primary)) this.rememberRemoved(record.primary)
        },
        rememberRemoved(primary) {
            if (!this.removedGroups.includes(primary)) this.removedGroups.push(primary)
        },
    },
})
</script>
