Vue.component('related-elements', {
    props: {
        limit: {
            type: Number,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        removed: {
            type: Array,
            default: () => [],
        },
        initialGroupsCount: [Number, String],
        label: {
            type: String,
            required: false,
        },
    },

    data() {
        return {
            newGroups: [],
            existingGroupsCount: this.initialGroupsCount,
            removedGroups: this.removed,
        };
    },

    watch: {
        removedGroups(newGroups, previousGroups) {
            if (newGroups.length > previousGroups.length) {
                this.existingGroupsCount--;
            } else {
                this.existingGroupsCount++;
            }
        },
    },

    computed: {
        removedExistingGroups() {
            return this.removedGroups.filter(primary => primary.indexOf('new_') !== 0);
        },

        totalGroupsCount() {
            return this.existingGroupsCount + this.newGroups.length;
        },

        canAddMore() {
            if (!this.limit) {
                return true;
            }

            return this.limit > this.totalGroupsCount;
        },
    },

    methods: {
        addNewGroup() {
            const max = this.newGroups.length === 0 ? 0 : Math.max.apply(Math, this.newGroups);
            this.newGroups.push(max + 1);
        },

        removeGroup(primary, index) {
            if (primary && this.removedGroups.indexOf(primary) === -1) {
                this.removedGroups.push(primary);
            }

            if (index) {
                this.newGroups.splice(this.newGroups.indexOf(index), 1);
            }
        },
    },
});
