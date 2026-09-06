@if ($visibled)
    <div class="form-group form-element-radio {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @foreach ($options as $option)
            <div class="radio">
                <label>
                    @php
                        $radioAttributes = (new \SleepingOwl\Admin\Support\HtmlAttributeBag($attributesArray ?? []))
                            ->merge([
                                'checked' => $value == $option['id'],
                                'name' => $name,
                                'value' => $option['id'],
                            ]);
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
