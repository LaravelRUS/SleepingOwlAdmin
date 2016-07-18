<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }} well">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="text-danger">*</span>
        @endif
    </label>

    @if (! $readonly)
    {!! Form::file($name, ['id' => $name]) !!}
    @endif

    @if(!empty($value) && !$readonly)
    <div class="checkbox">
        <label>{!! Form::checkbox("{$name}_remove") !!} @lang('sleeping_owl::lang.file.remove')</label>
    </div>
    @endif
</div>