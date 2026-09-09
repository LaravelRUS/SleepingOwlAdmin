@if ($visibled)
    <div class="form-group soa-field form-element-radio mb-3 {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        @foreach ($options as $option)
            <div class="form-check soa-choice">
                <label class="form-check-label soa-choice-label">
                    @php
                        $radioAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
                            ->merge([
                                'checked' => $value == $option['id'],
                                'name' => $name,
                                'value' => $option['id'],
                            ])
                            ->class(['form-check-input', 'soa-choice-control']);
                    @endphp
                    <input {!! $radioAttributes !!} />
                    {!! $option['text'] !!}
                </label>
            </div>
        @endforeach

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
