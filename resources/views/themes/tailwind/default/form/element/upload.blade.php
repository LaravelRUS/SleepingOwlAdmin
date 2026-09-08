@if ($visibled)
    <div class="form-group soa-field form-element-upload mb-3 border rounded p-3{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @if (! $readonly)
            {!! html()->file($name)->attributes(
                (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))->class(['soa-file-input'])->getAttributes()
            )->id($name) !!}
{{--            {!! Form::file($name, ['id' => $name]) !!}--}}
        @endif

        @if(!empty($value) && !$readonly)
            <div class="form-check mt-2 soa-choice">
                <label class="form-check-label soa-choice-label">{!! html()->checkbox("{$name}_remove")->class('form-check-input soa-choice-control') !!} @lang('sleeping_owl::lang.file.remove')</label>
            </div>
        @endif
    </div>
@endif
