@if ($visibled)
    <div class="form-group form-element-wysiwyg mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @php($textareaAttributes = array_merge(['name' => $name, 'id' => $name], $attributesArray))
        <textarea {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($textareaAttributes) !!}>{{ old($name, $value) }}</textarea>

        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>
@endif
