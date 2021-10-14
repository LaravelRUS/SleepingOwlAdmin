@if ($visibled)
    <div class="form-group form-element-image{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label{{ $required ? ' required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        <element-image
                url="{{ route('admin.form.element.image', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			], false) }}"
                value="{{ $value }}"
                asset_prefix="{{ $asset_prefix }}"
                :readonly="{{ $readonly ? 'true' : 'false' }}"
                :onlylink="{{ $paste_only_link ? 'true' : 'false' }}"
                name="{{ $name }}"
                inline-template
        >
            <div>
                <div v-if="errors.length" class="alert alert-warning" v-show="errors.length" style="display:none;">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="closeAlert()">
                        <span aria-hidden="true">&times;</span>
                    </button>

                    <p v-for="error in errors" v-show="errors">
                        <i class="fa-fw fas fa-image" aria-hidden="true"></i> @{{ error }}
                    </p>
                </div>

                <div class="form-element-files clearfix" v-if="has_value" v-show="has_value" style="display:none;">
                    <div class="form-element-files__item">
                        <a :href="createdimage" class="form-element-files__image" data-toggle="lightbox">
                            <img :src="createdimage"/>
                        </a>
                        <div class="form-element-files__info">
                            <a :href="createdimage" class="btn btn-default btn-sm pull-right" download target="_blank" title="{{ trans('sleeping_owl::lang.button.download') }}" data-toggle="tooltip">
                                <i class="fa-fw fas fa-cloud-upload-alt"></i>
                            </a>
                            <button type="button" v-if="!readonly" @click.prevent="insert(val)" class="btn btn-default btn-sm pull-right mr-1" title="{{ trans('sleeping_owl::lang.file.insert_link') }}" data-toggle="tooltip">
                                <i class="fa-fw fas fa-link"></i>
                            </button>

                            <button type="button" v-if="has_value && !readonly" class="btn btn-danger btn-xs" @click.prevent="remove()" title="{{ trans('sleeping_owl::lang.image.remove') }}" data-toggle="tooltip">
                                <i class="fa-fw fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="!readonly">
                    <div class="btn btn-primary upload-button btn-sm" v-if="!onlylink">
                        <i :class="uploadClass"></i> {{ trans('sleeping_owl::lang.image.browse') }}
                    </div>
                    <button type="button" @click.prevent="insert($event.target.value)" class="btn btn-default btn-sm" title="{{ trans('sleeping_owl::lang.file.insert_link') }}" data-toggle="tooltip">
                        <i class="fa-fw fas fa-link"></i>
                    </button>


                </div>

                <input :name="name" type="hidden" :value="val">
            </div>
        </element-image>


        <div class="errors">
            @include(AdminTemplate::getViewPath('form.element.partials.errors'))
        </div>
    </div>
@endif
