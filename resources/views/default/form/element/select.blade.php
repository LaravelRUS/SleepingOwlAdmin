<div class="form-group form-element-select {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <deselect :value="{{json_encode($value)}}" :multi="false" :options="{{json_encode($options)}}" inline-template>
        <div>
            <multiselect v-model="val"
                         track-by="id"
                         label="text"
                         :multiple="multi"
                         :searchable="true"
                         :options="opts">
            </multiselect>

            <div v-show="true == false">
                {!! Form::select($name, $options, $value, $attributes + ['v-model' => 'selValue']) !!}
            </div>
        </div>
    </deselect>
    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
    @include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>