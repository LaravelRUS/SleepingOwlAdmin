@if ($visibled)
    @push('footer-scripts')
        {{--
        <script>
            // Admin.WYSIWYG.switchOn('{!! $name !!}', '{{ $editor }}', {!! $parameters !!})
            // Admin.Modules.call('form.elements.wysiwyg');
        </script>
        --}}
    @endpush

    <div class="form-group form-element-wysiwyg {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        {!! Form::textarea($name, $value, $attributesArray) !!}

        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>
@endif
