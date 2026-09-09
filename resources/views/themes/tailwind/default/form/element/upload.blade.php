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
            @php($fileAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag(array_merge(['type' => 'file', 'name' => $name], $attributesArray ?? [], ['id' => $name])))->class(['soa-file-input']))
            <input {!! $fileAttributes !!}>
        @endif

        @if(!empty($value) && !$readonly)
            <div class="form-check mt-2 soa-choice">
                <label class="form-check-label soa-choice-label"><input type="checkbox" name="{{ $name }}_remove" value="1" class="form-check-input soa-choice-control" @checked(old("{$name}_remove"))> @lang('sleeping_owl::lang.file.remove')</label>
            </div>
        @endif
    </div>
@endif
