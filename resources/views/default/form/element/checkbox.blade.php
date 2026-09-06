@if ($visibled)
    @php
        $checkboxAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
            ->merge(['type' => 'checkbox', 'value' => 1]);

        if ($readonly) {
            $checkboxAttributes = $checkboxAttributes->except('disabled')->merge(['disabled' => true]);
        }
        if ($value) {
            $checkboxAttributes = $checkboxAttributes->except('checked')->merge(['checked' => true]);
        }
    @endphp
    <div class="form-group form-element-checkbox {{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <div class="checkbox">
            <label class="{{ $required ? 'required' : '' }}">
                <input {!! $checkboxAttributes !!} />

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
