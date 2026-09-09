@if ($visibled)
    <div class="card card-outline card-info soa-card {{ $collapsed ? 'collapsed-card':'' }} {{ $errors->has($name) ? 'has-error' : '' }}">
        <div class="card-header soa-card-header">
            <h3 class="card-title form-group soa-card-title">
                <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
                    {!! $label !!}

                    @if($required)
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

        <div class="card-body pad pt-0 soa-card-body">
            @php($textareaAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag(array_merge(['name' => $name, 'id' => $name], $attributesArray)))->class(['soa-textarea']))
            <textarea {!! $textareaAttributes !!}>{{ old($name, $value) }}</textarea>
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(app('sleeping_owl.template')->getViewPath('form.element.partials.errors'))
    </div>
@endif
