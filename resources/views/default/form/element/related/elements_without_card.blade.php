<div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!}>
      @if ($label)
        <h4>{{ $label }}</h4>
      @endif
      @if (isset($helpText) && $helpText)
        <div class="mb-2">
          @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        </div>
      @endif

      @include(AdminTemplate::getViewPath('form.element.related.inner_element'))
</div>
