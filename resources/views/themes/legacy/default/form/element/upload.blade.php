@if ($visibled)
    <div class="form-group form-element-upload mb-3 border rounded p-3{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <label for="{{ $name }}" class="form-label control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @if (! $readonly)
            {!! html()->file($name)->id($name) !!}
{{--            {!! Form::file($name, ['id' => $name]) !!}--}}
        @endif

        @if(!empty($value) && !$readonly)
            <div class="form-check mt-2">
                <label class="form-check-label">{!! html()->checkbox("{$name}_remove")->class('form-check-input') !!} @lang('sleeping_owl::lang.file.remove')</label>
            </div>
        @endif
    </div>
@endif
