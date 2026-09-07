@if ($visibled)
    <div class="form-group form-element-file{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @php
            $fileProps = array_replace([
                'classes' => [
                    'alert' => 'alert alert-warning',
                    'alertClose' => 'close',
                    'current' => 'form-element-files clearfix',
                    'downloadButton' => 'btn btn-default btn-xs pull-right',
                    'downloadIcon' => 'fas fa-cloud-upload-alt',
                    'errorIcon' => 'fas fa-file-alt',
                    'file' => 'form-element-files__file',
                    'fileIcon' => 'fa-fw fas fa-file-alt',
                    'info' => 'form-element-files__info',
                    'item' => 'form-element-files__item',
                    'removeButton' => 'btn btn-danger btn-xs',
                    'removeIcon' => 'fas fa-times',
                    'uploadButton' => 'btn btn-primary upload-button btn-sm',
                    'uploadIcon' => 'fas fa-file-upload',
                    'uploadingIcon' => 'fas fa-spinner fa-spin',
                ],
                'csrfToken' => csrf_token(),
                'labels' => [
                    'browse' => trans('sleeping_owl::lang.file.browse'),
                    'download' => trans('sleeping_owl::lang.button.download'),
                    'remove' => trans('sleeping_owl::lang.file.remove'),
                ],
                'maxFileSize' => $max_file_size,
                'messages' => [
                    'confirmRemove' => trans('sleeping_owl::lang.message.are_you_sure'),
                    'fileTooBig' => trans('sleeping_owl::lang.ckeditor.upload.error.filesize_limit_m', [
                        'size' => $max_file_size,
                    ]),
                    'responseError' => trans('sleeping_owl::lang.ckeditor.upload.error.common'),
                ],
                'name' => $name,
                'readonly' => (bool) $readonly,
                'url' => route('admin.form.element.file', [
                    'adminModel' => AdminSection::getModel($model)->getAlias(),
                    'field' => $path,
                    'id' => $model->getKey(),
                ], false),
                'value' => $value,
            ], $fileExtraProps ?? []);
        @endphp

        <div
            v-pre
            data-soa-vue-app
            data-soa-vue-component="element-file"
            data-soa-vue-props="{{ json_encode($fileProps, JSON_THROW_ON_ERROR) }}"
        ></div>

        <div class="errors">
            @include(AdminTemplate::getViewPath('form.element.partials.errors'))
        </div>
    </div>
@endif
