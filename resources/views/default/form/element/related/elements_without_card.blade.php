<related-elements
    inline-template
    name="{{ $name }}"
    label="{{ $label }}"
    :limit="{{ (int)$limit }}"
    :initial-groups-count="{{ (int)$groups->count() }}"
    :removed="{{ $remove->toJson() }}"
>
    <div {!! $attributes !!}>
      <h4 v-if="label">@{{ label }}</h4>
      @if (isset($helpText) && $helpText)
        <div class="mb-2">
          @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        </div>
      @endif

      @include(AdminTemplate::getViewPath('form.element.related.inner_element'))
    </div>
    
</related-elements>
