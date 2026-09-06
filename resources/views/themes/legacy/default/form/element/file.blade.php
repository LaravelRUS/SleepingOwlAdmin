@if ($visibled)
    <div class="form-group form-element-file{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        <element-file
                url="{{ route('admin.form.element.file', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			], false) }}"
                value="{{ $value }}"
                :readonly="{{ $readonly ? 'true' : 'false' }}"
                name="{{ $name }}"
                inline-template
        >
            <div>
                <div v-if="errors.length" class="alert alert-warning" v-show="errors.length" style="display:none;">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="closeAlert()">
                        <span aria-hidden="true">&times;</span>
                    </button>

                    <p v-for="error in errors">
                        <i class="fas fa-file-alt" aria-hidden="true"></i> @{{ error }}
                    </p>
                </div>

                <div class="form-element-files clearfix " v-if="has_value" v-show="has_value" style="display:none;">
                    <div class="form-element-files__item">
                        <div class="form-element-files__file">
                            <i class="fa-fw fas fa-file-alt"></i>
                        </div>
                        <div class="form-element-files__info">
                            <a :href="file" class="btn btn-default btn-xs pull-right" download title="{{ trans('sleeping_owl::lang.button.download') }}" target="_blank">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </a>

                            <button type="button" v-if="has_value" class="btn btn-danger btn-xs"
                                    @click.prevent="remove()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="!readonly">
                    <div class="btn btn-primary upload-button btn-sm">
                        <i :class="uploadClass"></i> {{ trans('sleeping_owl::lang.file.browse') }}
                    </div>
                </div>

                <input :name="name" type="hidden" :value="val">
            </div>
        </element-file>

        <div class="errors">
            @include(AdminTemplate::getViewPath('form.element.partials.errors'))
        </div>
    </div>
@endif
