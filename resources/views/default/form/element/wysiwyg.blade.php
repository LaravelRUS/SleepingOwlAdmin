@if ($visibled)
  @push('footer-scripts')
    <script>
    Admin.WYSIWYG.switchOn('{!!  $name !!}', '{{ $editor }}', {!! $parameters !!})
    </script>
  @endpush

  <div class="card card-outline card-info {{ $collapsed ? 'collapsed-card':'' }} {{ $errors->has($name) ? 'has-error' : '' }}">
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
        @if ($collapsed)
          <button type="button" class="btn btn-tool btn-sm" data-card-widget="collapse"><i class="fas fa-plus"></i></button>
        @else
          <button type="button" class="btn btn-tool btn-sm" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
        @endif
      </div>
      @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

    <div class="card-body pad pb-0">
      {!! Form::textarea($name, $value, $attributes) !!}
    </div>
  </div>
@endif
