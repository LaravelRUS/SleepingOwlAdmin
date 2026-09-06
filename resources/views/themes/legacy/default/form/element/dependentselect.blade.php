@if ($visibled)
    <div class="form-group form-element-dependentselect {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <div>
{{--            {!! Form::select($name, $options, $value, $attributes) !!}--}}
            @php($selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control'])->getAttributes())
            {!! html()->select($name, $options, $value)->attributes($selectAttributes) !!}
        </div>


        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
