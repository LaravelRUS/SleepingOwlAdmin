@if ($visibled)
    <div class="form-group form-element-textarea mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        <textarea v-pre {!! (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray))->class(['form-control']) !!}
                  @if($readonly) readonly @endif
		>{!! $value !!}</textarea>
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
