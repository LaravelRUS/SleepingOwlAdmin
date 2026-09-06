@if ($visibled)
    <div class="form-group form-element-select {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <div>
            {{--            {!! Form::select($name, $options, $value, $attributes) !!}--}}
            @php($selectAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control'])->getAttributes())
            @php($select = html()->select($name, $options, $value)->attributes($selectAttributes))
            {!! $select->hasAttribute('multiple') ? $select->multiple() : $select !!}
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
