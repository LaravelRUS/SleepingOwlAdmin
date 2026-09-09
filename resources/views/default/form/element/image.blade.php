@if ($visibled)
    <div class="form-group soa-field form-element-image mb-3{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="form-label control-label soa-label{{ $required ? ' required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @php
            $imageProps = array_replace([
                'assetPrefix' => (string) $asset_prefix,
                'classes' => [
                    'alert' => 'alert alert-warning soa-alert',
                    'alertClose' => 'btn-close float-end soa-icon-button',
                    'current' => 'form-element-files clearfix soa-attachment-list',
                    'downloadButton' => 'btn btn-light btn-sm float-end soa-button soa-button-sm soa-button-secondary',
                    'downloadIcon' => 'fa-fw fas fa-cloud-upload-alt',
                    'errorIcon' => 'fa-fw fas fa-image',
                    'info' => 'form-element-files__info soa-attachment-info soa-attachment-actions',
                    'insertCurrentButton' => 'btn btn-light btn-sm float-end me-1 soa-button soa-button-sm soa-button-secondary',
                    'insertIcon' => 'fa-fw fas fa-link',
                    'insertNewButton' => 'btn btn-light btn-sm soa-button soa-button-sm soa-button-secondary',
                    'item' => 'form-element-files__item soa-attachment',
                    'previewLink' => 'form-element-files__image soa-attachment-preview',
                    'removeButton' => 'btn btn-danger btn-sm soa-button soa-button-sm soa-button-danger',
                    'removeIcon' => 'fa-fw fas fa-times',
                    'uploadButton' => 'btn btn-primary upload-button btn-sm soa-button soa-button-sm soa-button-primary',
                    'uploadIcon' => 'fas fa-image',
                    'uploadingIcon' => 'fas fa-spinner fa-spin',
                ],
                'csrfToken' => csrf_token(),
                'labels' => [
                    'browse' => trans('sleeping_owl::lang.image.browse'),
                    'download' => trans('sleeping_owl::lang.button.download'),
                    'insertLink' => trans('sleeping_owl::lang.file.insert_link'),
                    'remove' => trans('sleeping_owl::lang.image.remove'),
                ],
                'maxFileSize' => $max_file_size,
                'messages' => [
                    'confirmRemove' => trans('sleeping_owl::lang.message.are_you_sure'),
                    'fileTooBig' => trans('sleeping_owl::lang.ckeditor.upload.error.filesize_limit_m', [
                        'size' => $max_file_size,
                    ]),
                    'invalidFileType' => trans('sleeping_owl::lang.ckeditor.upload.error.wrong_extension', [
                        'file' => $name,
                    ]),
                    'responseError' => trans('sleeping_owl::lang.ckeditor.upload.error.common'),
                ],
                'name' => $name,
                'onlyLink' => (bool) $paste_only_link,
                'readonly' => (bool) $readonly,
                'url' => route('admin.form.element.image', [
                    'adminModel' => AdminSection::getModel($model)->getAlias(),
                    'field' => $path,
                    'id' => $model->getKey(),
                ], false),
                'value' => $value,
            ], $imageExtraProps ?? []);
        @endphp

        <div
            v-pre
            data-vue-app
            data-vue-component="element-image"
            data-vue-props="{{ json_encode($imageProps, JSON_THROW_ON_ERROR) }}"
        ></div>

        <div class="errors">
            @include(AdminTemplate::getViewPath('form.element.partials.errors'))
        </div>
    </div>
@endif
