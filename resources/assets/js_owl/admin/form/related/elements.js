import draggable from 'vuedraggable'

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

        draggable: {
            type: Boolean,
            default: false
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
        initAdminEvents() {
            this.$nextTick(() => {
                Admin.Modules.call('form.elements.date');
                Admin.Modules.call('form.elements.datetime');
                Admin.Modules.call('form.elements.daterange');
                Admin.Modules.call('form.elements.dependent-select');
                Admin.Modules.call('form.elements.select');
                Admin.Modules.call('form.elements.selectajax');
                Admin.Modules.call('form.elements.wysiwyg');
            });
        },

        addNewGroup() {
            const max = this.newGroups.length === 0 ? 0 : Math.max.apply(Math, this.newGroups);
            this.newGroups.push(max + 1);
            this.initAdminEvents();
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

    components: {
        draggable
    },
});
