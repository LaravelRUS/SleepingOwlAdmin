@if ($visibled)
    <div class="form-group form-element-multiselect {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $id }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <deselect
            :value="{{ json_encode($value) }}"
            :id="'{{ $id }}'"
            :multiple="true"
            :options="{{ json_encode($options) }}"
            inline-template
        >
            <div>
                <multiselect
                    @if($readonly)
                      :disabled="true"
                    @endif
                    @if($required)
                      :allow-empty="false"
                    @endif
                    v-model="val"
                    track-by="id"
                    label="text"
                    :multiple="multiple"
                    @if($limit)
                     :limit="{!! $limit !!}"
                    @endif
                    :searchable="true"
                    :options="options"
                    @if(count($options))
                      placeholder="{{ trans('sleeping_owl::lang.select.placeholder') }}"
                    @else
                      placeholder="{{ trans('sleeping_owl::lang.select.no_items') }}"
                    @endif
                    @tag="addTag"
                    :taggable="{{ $taggable ? 'true' : 'false'}}"
                    select-label="{{ trans('sleeping_owl::lang.select.init') }}"
                    selected-label="{{ trans('sleeping_owl::lang.select.selected') }}"
                    deselect-label="{{ trans('sleeping_owl::lang.select.deselect') }}"
                >
                <span slot="noResult">{{ trans('sleeping_owl::lang.select.no_items') }}</span>
                <span slot="noOptions">{{ trans('sleeping_owl::lang.select.no_items') }}</span>
                </multiselect>

                <select v-show="true == false"
                    id="{{ $id }}"
                    multiple
                    name="{{ $name }}"
                    {!! $attributes !!}
                >
                    <option
                        :selected="hasOption(opt.id)"
                        :value="opt.id"
                        v-for="opt in options">
                        @{{ opt.text }}
                    </option>
                </select>

                @if ($required)
                  <div class="text-danger pt-2 pb-3" v-show="!val.length">
                    {{ trans('sleeping_owl::validation.required', ['attribute' => $label]) }}
                  </div>
                @endif
            </div>
        </deselect>




        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
