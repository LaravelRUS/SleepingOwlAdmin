@if ($visibled)
    @push('footer-scripts')
        {{--
        <script>
            // Admin.WYSIWYG.switchOn('{!! $name !!}', '{{ $editor }}', {!! $parameters !!})
            // Admin.Modules.call('form.elements.wysiwyg');
        </script>
        --}}
    @endpush

    <div class="card card-outline card-info {{ $collapsed ? 'collapsed-card':'' }} {{ $errors->has($name) ? 'has-error' : '' }}">
        <div class="card-header">
            <h3 class="card-title form-group">
                <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
                    {!! $label !!}

                    @if($required)
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

        <div class="card-body pad pt-0">
            {!! Form::textarea($name, $value, $attributesArray) !!}
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>
@endif
