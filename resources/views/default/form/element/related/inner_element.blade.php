
  <div class='grouped-elements clearfix'>
      <draggable class="related-elements__draggable" :disabled="{{ isset($draggable) && $draggable ? 'false': 'true' }}" handle=".drag-handle">
          @foreach($groups as $key => $group)
              @include(AdminTemplate::getViewPath('form.element.related.group'), [
                  'name' => $name,
                  'group' => $group,
                  'index' => $key,
                  'draggable' => isset($draggable) ? $draggable : false,
              ])
          @endforeach
          
          <template v-for="index in newGroups">
              @include(AdminTemplate::getViewPath('form.element.related.group'), [
                  'name' => $name,
                  'group' => new \SleepingOwl\Admin\Form\Related\Group(null, $stub->all()),
                  'index' => "totalGroupsCount",
              ])
          </template>
      </draggable>


      @if (!$readonly)
        <div class="d-block clearfix">
          <button
            v-if="canAddMore"
            type='button'
            @click="addNewGroup"
            class='grouped-elements__action pull-right related-action_add btn btn-success btn-sm'
          >
            <i class='fas fa-plus'></i>
            {{ trans('sleeping_owl::lang.button.add') }}
          </button>
        </div>
      @endif

  </div>
  <input v-for="id in removedExistingGroups" type='hidden' :name="`${name}[remove][]`" :value='id'>
