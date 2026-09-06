@if ($visibled)
    <div class="form-group form-element-images{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}"{!! $style ? ' style="' . $style . '"' : '' !!}>
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @php
            $imagesProps = [
                'assetPrefix' => (string) $asset_prefix,
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
            ];
        @endphp

        <div
            v-pre
            data-soa-vue-app
            data-soa-vue-component="element-images"
            data-soa-vue-props="{{ json_encode($imagesProps, JSON_THROW_ON_ERROR) }}"
        ></div>

        <div class="errors">
            @include(AdminTemplate::getViewPath('form.element.partials.errors'))
        </div>
    </div>
@endif
