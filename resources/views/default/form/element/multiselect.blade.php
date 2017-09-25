<div class="form-group form-element-multiselect {{ $errors->has($name) ? 'has-error' : '' }}">
    <label for="{{ $name }}" class="control-label">
        {{ $label }}

        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <deselect :value="{{json_encode($value)}}"
              :id="'{{str_replace(['[', ']'], '', $name)}}'"
              :multiple="true" :options="{{json_encode($options)}}" inline-template>
        <div>
            <multiselect @if($readonly)
                         :disabled="true"
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
                         :taggable="{{ $tagable ? 'true' : 'false'}}"
                         :select-label="'{{trans('sleeping_owl::lang.select.init')}}'"
                         :selected-label="'{{trans('sleeping_owl::lang.select.selected')}}'"
                         :deselect-label="'{{trans('sleeping_owl::lang.select.deselect')}}'"
            >
            </multiselect>

            <select v-show="true == false" id="{{str_replace(['[', ']'], '', $name)}}" multiple name="{{$name}}" {!! $attributes !!}>

                <option :selected="hasOption(opt.id)" :value="opt.id"
                        v-for="opt in options">
                    @{{ opt.text }}
                </option>
            </select>
        </div>
    </deselect>

    @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
    @include(AdminTemplate::getViewPath('form.element.partials.errors'))
</div>
