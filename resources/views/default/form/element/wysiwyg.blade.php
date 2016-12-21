@push('footer-scripts')
<script>
    Admin.Modules.add('wysiwyg.{{ $name }}', function() {
        window.Admin.WYSIWYG.switchOn('{{ $name }}', '{{ $editor }}', {!! $parameters !!})
    })
</script>
@endpush

<div class="form-group form-element-wysiwyg {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

    {!! Form::textarea($name, $value, [
        'class' => 'form-control',
        'id' => $name
    ]) !!}

    @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
</div>
