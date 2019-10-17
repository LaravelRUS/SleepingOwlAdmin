@if ($visibled)
    <div class="form-group form-element-images{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        <element-images
                url="{{ route('admin.form.element.image', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			]) }}"
                :values="{{ json_encode($value) }}"
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
                        <i class="fas fa-images" aria-hidden="true"></i> @{{ error }}
                    </p>
                </div>

                <div data-disable="true" class="form-element-files dropzone clearfix{{ $readonly ? ' dropzone-disabled': '' }}">
                    <draggable class="draggable" v-model="vals" :disabled="{{ $readonly ? 'true': 'false' }}">

                        <div class="form-element-files__item" v-for="(uri, index) in vals">
                            <a :href="image(uri)" class="form-element-files__image" data-toggle="images">
                                <img :src="image(uri)"/>
                            </a>

                            <div class="form-element-files__info">
                                <a class="btn btn-clear btn-sm pull-right drag-cursor" v-if="!readonly">
                                    <i class="fas fa-arrows-alt"></i>
                                </a>
                                <a :href="image(uri)" class="btn btn-default btn-sm pull-right" download target="_blank" title="{{ trans('sleeping_owl::lang.button.download') }}">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                </a>
                                <button type="button" v-if="!readonly" @click.prevent="insert(index)" class="btn btn-default btn-sm pull-right mr-1" title="{{ trans('sleeping_owl::lang.file.insert_link') }}">
                                    <i class="fas fa-link"></i>
                                </button>

                                <button type="button" @click.prevent="remove(index)" v-if="!readonly" class="btn btn-danger btn-xs" title="{{ trans('sleeping_owl::lang.image.remove') }}">
                                    <i class="fas fa-times"></i> {{ trans('sleeping_owl::lang.image.remove') }}
                                </button>
                            </div>
                        </div>

                    </draggable>

                </div>

                <div v-if="!readonly">
                    <br/>
                    <div class="btn btn-primary upload-button btn-sm">
                        <i :class="uploadClass"></i> {{ trans('sleeping_owl::lang.image.browseMultiple') }}
                    </div>
                    <button type="button" @click.prevent="insert()" class="btn btn-default btn-sm" title="{{ trans('sleeping_owl::lang.file.insert_link') }}">
                        <i class="fas fa-link"></i>
                    </button>
                </div>

                <input :name="name" type="hidden" :value="serializedValues">
            </div>
        </element-images>

        <div class="errors">
            @include(AdminTemplate::getViewPath('form.element.partials.errors'))
        </div>
    </div>
@endif
