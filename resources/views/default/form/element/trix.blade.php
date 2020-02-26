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

    <div class="card card-outline card-info {{ $collapsed ? 'collapsed-card':'' }} {{ $errors->has($name) ? 'has-error' : '' }}">
        <div class="card-header">
            <h3 class="card-title form-group">
                <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
                    {!! $label !!}

                    @if($required && !$readonly)
                        <span class="form-element-required">*</span>
                    @endif
                </label>
            </h3>

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


        <div class="card-body pad pt-0" v-pre>
          <input type="hidden" {!! $attributes !!} value="{{$value}}" v-pre>
          <a id="add">Add editor</a>
          @if ($readonly)
            <div {!! $attributes !!} v-pre>{!! $value !!}</div>
          @else
            <trix-editor input="{{$name}}" {!! $attributes !!} v-pre></trix-editor>
          @endif
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>

@endif
