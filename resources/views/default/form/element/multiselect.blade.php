<div class="form-group form-element-multiselect {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <deselect :value="{{json_encode($value)}}" :multiple="true" :options="{{json_encode($options)}}" inline-template>
        <div>
            <multiselect v-model="val"
                         track-by="id"
                         label="text"
                         :multiple="multiple"
                         :limit="3"
                         :searchable="true"
                         :options="options"
                         placeholder="{{ trans('sleeping_owl::lang.select.placeholder') }}"
                         :selectLabel="'{{trans('sleeping_owl::lang.select.init')}}'"
                         :selectedLabel="'{{trans('sleeping_owl::lang.select.selected')}}'"
                         :deselectLabel="'{{trans('sleeping_owl::lang.select.deselect')}}'"
            >
            </multiselect>

            <select v-show="true == false" multiple name="{{$name}}">

                <option :selected="hasOption(opt.id)" :value="opt.id"
                        v-for="opt in options">
                    @{{ opt.text }}
                </option>
            </select>
        </div>
    </deselect>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
    @include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>