@if ($visibled)
    <div class="form-group soa-field form-element-images mb-3{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <label for="{{ $name }}" class="form-label control-label soa-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required soa-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @php
            $imagesProps = array_replace([
                'assetPrefix' => (string) $asset_prefix,
                'classes' => [
                    'actions' => 'form-element-button-add w-100 order-2 mt-2 soa-form-actions',
                    'alert' => 'alert alert-warning soa-alert',
                    'alertClose' => 'btn-close float-end soa-icon-button',
                    'dialog' => 'soa-images-dialog',
                    'dialogCloseButton' => 'btn btn-light soa-images-dialog__close soa-images-dialog-close soa-icon-button',
                    'dialogCloseIcon' => 'fas fa-times',
                    'dialogFrame' => 'soa-images-dialog__frame soa-images-dialog-frame',
                    'dialogImage' => 'soa-images-dialog__image soa-images-dialog-image',
                    'dialogNextButton' => 'btn btn-light soa-images-dialog__next soa-icon-button',
                    'dialogNextIcon' => 'fas fa-chevron-right',
                    'dialogPosition' => 'soa-images-dialog__position soa-images-dialog-position',
                    'dialogPreviousButton' => 'btn btn-light soa-images-dialog__previous soa-icon-button',
                    'dialogPreviousIcon' => 'fas fa-chevron-left',
                    'downloadButton' => 'btn btn-light btn-sm float-end soa-button soa-button-sm soa-button-secondary',
                    'downloadIcon' => 'fa-fw fas fa-cloud-upload-alt',
                    'dragButton' => 'btn btn-clear btn-sm float-end drag-cursor soa-icon-button',
                    'dragIcon' => 'fa-fw fas fa-arrows-alt',
                    'errorIcon' => 'fa-fw fas fa-images',
                    'gallery' => 'form-element-files dropzone clearfix soa-images__grid soa-images-grid soa-attachment-list',
                    'galleryReadonly' => 'dropzone-disabled',
                    'info' => 'form-element-files__info soa-attachment-info soa-attachment-actions',
                    'insertButton' => 'btn btn-light btn-sm float-end me-1 soa-button soa-button-sm soa-button-secondary',
                    'insertIcon' => 'fa-fw fas fa-link',
                    'insertNewButton' => 'btn btn-light btn-sm soa-button soa-button-sm soa-button-secondary',
                    'item' => 'form-element-files__item soa-images__item soa-images-item soa-attachment',
                    'order' => 'soa-images__order soa-images-order',
                    'previewButton' => 'form-element-files__image soa-images__preview soa-images-preview',
                    'removeButton' => 'btn btn-danger btn-sm gallery-remove soa-button soa-button-sm soa-button-danger',
                    'removeIcon' => 'fa-fw fas fa-times',
                    'root' => 'soa-images',
                    'sortableGhost' => 'soa-images__item--moving soa-images-item-moving',
                    'uploadButton' => 'btn btn-primary upload-button btn-sm soa-button soa-button-sm soa-button-primary',
                    'uploadIcon' => 'fas fa-images',
                    'uploadingIcon' => 'fas fa-spinner fa-spin',
                ],
                'csrfToken' => csrf_token(),
                'draggable' => (bool) $draggable,
                'labels' => [
                    'browse' => trans('sleeping_owl::lang.image.browseMultiple'),
                    'close' => trans('sleeping_owl::lang.image.closePreview'),
                    'download' => trans('sleeping_owl::lang.button.download'),
                    'insertLink' => trans('sleeping_owl::lang.file.insert_link'),
                    'next' => trans('sleeping_owl::lang.image.next'),
                    'preview' => trans('sleeping_owl::lang.image.preview'),
                    'previous' => trans('sleeping_owl::lang.image.previous'),
                    'remove' => trans('sleeping_owl::lang.image.remove'),
                    'reorder' => trans('sleeping_owl::lang.image.reorder'),
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
                'values' => $value,
            ], $imagesExtraProps ?? []);
        @endphp

        <div
            v-pre
            data-vue-app
            data-vue-component="element-images"
            data-vue-props="{{ json_encode($imagesProps, JSON_THROW_ON_ERROR) }}"
        ></div>

        <div class="errors">
            @include(AdminTemplate::getViewPath('form.element.partials.errors'))
        </div>
    </div>
@endif
