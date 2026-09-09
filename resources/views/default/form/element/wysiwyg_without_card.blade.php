@if ($visibled)
    <div class="form-group soa-field form-element-wysiwyg mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @php($textareaAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag(array_merge(['name' => $name, 'id' => $name], $attributesArray)))->class(['soa-textarea']))
        <textarea {!! $textareaAttributes !!}>{{ old($name, $value) }}</textarea>

        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>
@endif
