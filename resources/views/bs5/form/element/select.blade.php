@if ($visibled)
    <div class="form-group form-element-select {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <deselect
            :value="{{ (ctype_digit(strval($value)) ? $value : json_encode($value)) }}"
            :id="'{{ $id }}'"
            :multiple="false"
            :options="{{ json_encode($options) }}"
            inline-template
        >
            <div>
                <multiselect
                    @if($readonly)
                      :disabled="true"
                    @endif
                    v-model="val"
                    track-by="id"
                    label="text"
                    :multiple="multiple"
                    :searchable="true"
                    :options="options"
                    @if(count($options))
                      placeholder="{{ trans('sleeping_owl::lang.select.placeholder') }}"
                    @else
                      placeholder="{{ trans('sleeping_owl::lang.select.no_items') }}"
                    @endif
                    select-label="{{ trans('sleeping_owl::lang.select.init') }}"
                    selected-label="{{ trans('sleeping_owl::lang.select.selected') }}"
                    @if($required)
                      :allow-empty="false"
                      deselect-label=""
                    @else
                      deselect-label="{{ trans('sleeping_owl::lang.select.deselect') }}"
                    @endif
                >
                <span slot="noResult">{{ trans('sleeping_owl::lang.select.no_items') }}</span>
                </multiselect>

                <input type="hidden"
                    {!! $attributes !!}
                    id="{{ $id }}"
                    name="{{ $name }}"
                    v-model="preparedVal"
                >
            </div>
        </deselect>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
