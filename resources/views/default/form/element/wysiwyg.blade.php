@push('footer-scripts')
<script>
    Admin.Modules.add('wysiwyg.{{ $name }}', function() {
        window.Admin.WYSIWYG.switchOn('{{ $name }}', '{{ $editor }}', {!! $parameters !!})
    })
</script>
@endpush

<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="text-danger">*</span>
        @endif
    </label>

    {!! Form::textarea($name, $value, [
        'class' => 'form-control',
        'id' => $name
    ]) !!}

    @if(!empty($helpText))
        <span class="help-block">{!! $helpText !!}</span>
    @endif

    @include(app('sleeping_owl.template')->getViewPath('form.element.errors'))
</div>
