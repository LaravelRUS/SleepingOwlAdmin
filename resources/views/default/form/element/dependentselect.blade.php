@if ($visibled)
    <div class="form-group form-element-dependentselect {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <div class="adm-form-dependent-select">

            <x-sleepingowl::form.select
                :name="$name"
                :options="$options"
                :value="$value"
                :attributes="$attributes"
            />
        </div>


        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
