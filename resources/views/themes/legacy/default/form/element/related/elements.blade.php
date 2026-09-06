<div class="card card-outline card-info {{ $collapsed ? 'collapsed-card':'' }} {{ $errors->has($name) ? 'has-error' : '' }}">
      <div class="card-header">
        @if ($label)
          <h4 class="card-title form-group">{{ $label }}</h4>
        @endif
        @if (isset($helpText) && $helpText)
            <div class="mb-2">
                @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
            </div>
        @endif

        <div class="card-tools">
          <button type="button" class="btn btn-tool" data-card-widget="maximize">
            <i class="fas fa-expand"></i>
          </button>
          @if ($collapsed)
            <button type="button" class="btn btn-tool btn-sm" data-card-widget="collapse">
              <i class="fas fa-plus"></i>
            </button>
          @else
            <button type="button" class="btn btn-tool btn-sm" data-card-widget="collapse">
              <i class="fas fa-minus"></i>
            </button>
          @endif
        </div>
      </div>

      <div class="card-body pad pt-0">
        <div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
          @include(AdminTemplate::getViewPath('form.element.related.inner_element'))
        </div>
      </div>
</div>
