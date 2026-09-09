@if ($visibled)
    @php
        $checkboxAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
            ->merge(['type' => 'checkbox', 'value' => 1])
            ->class(['form-check-input', 'soa-choice-control']);

        if ($readonly) {
            $checkboxAttributes = $checkboxAttributes->except('disabled')->merge([
                'aria-readonly' => 'true',
                'disabled' => true,
            ]);
        }
        if ($value) {
            $checkboxAttributes = $checkboxAttributes->except('checked')->merge(['checked' => true]);
        }
    @endphp
    <div class="form-group soa-field form-element-checkbox mb-3 {{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <div class="form-check soa-choice">
            <input {!! $checkboxAttributes !!} />
            <label class="form-check-label soa-choice-label {{ $required ? 'required' : '' }}" for="{{ $checkboxAttributes->get('id') }}">
                {!! $label !!}
                @if($required)
                    <span class="form-element-required soa-required">*</span>
                @endif
            </label>

            @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
