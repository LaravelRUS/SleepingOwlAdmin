@if ($visibled)
  @push('footer-scripts')
      {{-- <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/trix/1.2.0/trix.js"></script> --}}

      <script type="text/javascript">
        // document.getElementById("add").addEventListener("click", function() {
        //   document.body.insertAdjacentHTML("beforeend", "<trix-editor></trix-editor>")
        // })

        document.addEventListener("trix-initialize", function(event) {
          // console.log(11111123);
        })
      </script>
  @endpush

    <div class="card card-outline card-info soa-card {{ $collapsed ? 'collapsed-card':'' }} {{ $errors->has($name) ? 'has-error' : '' }}">
        <div class="card-header soa-card-header">
            <h3 class="card-title form-group soa-card-title">
                <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
                    {!! $label !!}

                    @if($required && !$readonly)
                        <span class="form-element-required soa-required">*</span>
                    @endif
                </label>
            </h3>

            <div class="card-tools soa-card-tools">
                <button type="button" class="btn btn-tool soa-icon-button" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
                @if ($collapsed)
                    <button type="button" class="btn btn-tool btn-sm soa-icon-button" data-card-widget="collapse">
                        <i class="fas fa-plus"></i>
                    </button>
                @else
                    <button type="button" class="btn btn-tool btn-sm soa-icon-button" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                @endif
            </div>
        </div>


        <div class="card-body pad pt-0 soa-card-body" v-pre>
          <input type="hidden" {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!} value="{{$value}}" v-pre>
          <a id="add">Add editor</a>
          @if ($readonly)
            <div {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!} v-pre>{!! $value !!}</div>
          @else
            <trix-editor input="{{$name}}" {!! new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []) !!} v-pre></trix-editor>
          @endif
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>

@endif
