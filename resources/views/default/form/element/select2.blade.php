<div class="form-group form-element-select {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $id }}" class="control-label">
        {!! $label !!}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <div class="adm-form-select2">

            @php
//            dd($attributes, $attributes_array);
//                /**
//                * @nit Daan Проверить зачем тут был pluck
//                :options="collect($options)->pluck('text', 'id')"
//                */
            @endphp

{{--        $attributes_array--}}
        <x-sleepingowl::form.select
            :name="$name"
            :options="$options"
            :value="$value"
            :attributes="$attributes_array" />
    </div>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
    @include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>
