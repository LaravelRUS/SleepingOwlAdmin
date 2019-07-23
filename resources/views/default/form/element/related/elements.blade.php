<related-elements
    inline-template
    name="{{ $name }}"
    label="{{ $label }}"
    :limit="{{ (int)$limit }}"
    :initial-groups-count="{{ (int)$groups->count() }}"
    :removed="{{ $remove->toJson() }}"
>
    <div>
        <h4 v-if="label">@{{ label }}</h4>
        <div class='grouped-elements clearfix'>
            @foreach($groups as $key => $group)
                @include(AdminTemplate::getViewPath('form.element.related.group'), [
                    'name' => $name,
                    'group' => $group,
                    'index' => $key,
                ])
            @endforeach
            <div v-for="index in newGroups">
                @include(AdminTemplate::getViewPath('form.element.related.group'), [
                    'name' => $name,
                    'group' => new \SleepingOwl\Admin\Form\Related\Group(null, $stub->all()),
                ])
            </div>
            <button
                v-if="canAddMore"
                type='button'
                @click="addNewGroup"
                class='grouped-elements__action pull-right related-action_add btn btn-success btn-sm'
            >
                <i class='icon icon-plus'></i>
                {{ trans('sleeping_owl::lang.related.add') }}
            </button>

        </div>
        <input v-for="id in removedExistingGroups" type='hidden' :name="`${name}[remove][]`" :value='id'>
    </div>
</related-elements>
