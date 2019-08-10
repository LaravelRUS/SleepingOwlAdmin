@if ($displayed)
  @push('footer-scripts')
    <script>
    Admin.WYSIWYG.switchOn('{!!  $name !!}', '{{ $editor }}', {!! $parameters !!})
    </script>
  @endpush

  <div class="card card-outline card-info {{ $errors->has($name) ? 'has-error' : '' }}">
    <div class="card-header">
      <h3 class="card-title form-group">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
          {{ $label }}

          @if($required)
            <span class="form-element-required">*</span>
          @endif
        </label>
      </h3>

      <div class="card-tools">
        <button type="button" class="btn btn-tool btn-sm" data-widget="collapse" data-toggle="tooltip" title="Collapse"><i class="fas fa-minus"></i></button>
      </div>
    </div>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

    <div class="card-body pad">
      {!! Form::textarea($name, $value, $attributes) !!}
      @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>
  </div>
@endif
