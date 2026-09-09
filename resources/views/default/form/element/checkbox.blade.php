@if ($visibled)
    @php
        $checkboxAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
            ->merge(['type' => 'checkbox', 'value' => 1])
            ->class(['form-check-input']);

        if ($readonly) {
            $checkboxAttributes = $checkboxAttributes->except('disabled')->merge(['disabled' => true]);
        }
        if ($value) {
            $checkboxAttributes = $checkboxAttributes->except('checked')->merge(['checked' => true]);
        }
    @endphp
    <div class="form-group form-element-checkbox mb-3 {{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <div class="form-check">
            <input {!! $checkboxAttributes !!} />
            <label class="form-check-label {{ $required ? 'required' : '' }}" for="{{ $checkboxAttributes->get('id') }}">
                {!! $label !!}
                @if($required)
                    <span class="form-element-required">*</span>
                @endif
            </label>

            @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
