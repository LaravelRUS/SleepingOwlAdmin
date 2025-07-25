@if ($visibled)
    <div class="form-group form-element-select {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <div class="adm-form-select-ajax">
                <x-sleepingowl::form.select
                    :name="$name"
                    :options="$options"
                    :value="$value"
                    :attributes="$attributes"
                    :attributesArr="$attributes_array"
                />
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
