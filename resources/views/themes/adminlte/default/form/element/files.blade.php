@if ($visibled)
    <div class="form-element-files-wrapper">
        <label for="{{ $id }}" class="form-label control-label form-element-files-control-label">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        <div class="form-group form-element-file fileUploadMultiple mb-3{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}" {!! $style ? ' style="' . $style . '"' : '' !!}
        data-target="{{ route('admin.form.element.file', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			], false)  }}"
             data-token="{{ csrf_token() }}">

            @if (!$readonly)
                <script type="text/html" class="RenderFile">
                    <div class="fileThumbnail">
                        <div class="thumbnail">
                            <div class="fileicon">
                                <div class="fileicon-inner" style="background-image:url('[%=img%]')">
                                    <span class="file-extension">[%=ext%]</span>
                                    <span class="file-mime">[%=mime%]</span>
                                    <a href="[%=img%]" data-lightbox style="[%=lightbox_style%]" class="file-image"></a>
                                </div>
                            </div>
                            <div class="file-actions">
                                <div class="fileinfo hidden" data-id="file" data-src="[%=src%]" data-url="[%=url%]">
                                    [%=basename%]
                                </div>

                                <input type="text" class="form-control form-control-sm mb-2 tit{{ $show_title ? '' : ' hidden' }}"
                                       data-id="title"
                                       data-toggle="tooltip"
                                       data-bs-toggle="tooltip"
                                       data-original-title="{{ trans('sleeping_owl::lang.seo.title') }}"
                                       placeholder="{{ trans('sleeping_owl::lang.seo.title') }}"{{ $title_required ? ' required' : '' }}
                                />

                                <textarea class="form-control form-control-sm noresize desc{{ $show_description ? '' : ' hidden' }}"
                                          data-id="description"
                                          rows="3"
                                          data-toggle="tooltip"
                                          data-bs-toggle="tooltip"
                                          data-original-title="{{ trans('sleeping_owl::lang.seo.description') }}"
                                          placeholder="{{ trans('sleeping_owl::lang.seo.description') }}"{{ $description_required ? ' required' : '' }}
                            ></textarea>

                                <input type="hidden"
                                       name="original_name"
                                       class="orig"
                                       data-id="original_name"
                                       value="[%=orig%]" />

                                <div class="file-buttons mt-1 text-start">
                                    <button class="btn btn-danger btn-delete btn-sm fileRemove" title="{{ trans('sleeping_owl::lang.button.remove') }}">
                                        <i class="fas fa-fw fa-times"></i>
                                    </button>

                                    @if (isset($draggable) && $draggable)
                                        <a class="btn btn-clear btn-sm float-end drag-cursor drag-handle">
                                            <i class="fas fa-fw fa-arrows-alt"></i>
                                        </a>
                                    @endif
                                    <a href="[%=url%]" download class="btn btn-light btn-sm float-end me-1" title="{{ trans('sleeping_owl::lang.button.download') }}">
                                        <i class="fas fa-fw fa-cloud-download-alt"></i>
                                    </a>
                                </div>
                            </div>
                            @if ($show_original_name)
                                <div class="file-original_name">
                                    [%=orig%]
                                </div>
                            @endif
                            <div class="file-clearfix"></div>
                        </div>
                    </div>
                </script>
            @endif

            <div class="files-group dropzone {{ $files_group_class }}{{ $readonly ? ' dissortable' : '' }}"
                 data-draggable="{{ $draggable }}">
                @foreach ($value ?? [] as $item)
                    <div class="fileThumbnail">
                        <div class="thumbnail">
                            <div class="fileicon">
                                <div class="fileicon-inner" {!! @$item['mime_base'] == 'image' || @$item['ext'] == 'svg' ? 'style="background-image:url(' . asset($item['url']) . ')"' : '' !!}>
                                    @if (@$item['mime_base'] != 'image' && @$item['ext'] != 'svg')
                                        @if (@$item['ext'])
                                            <span class="file-extension h1">{{ $item['ext'] }}</span>
                                        @endif
                                        @if (@$item['mime'])
                                            <span class="file-mime small text-secondary">{{ $item['mime'] }}</span>
                                        @endif
                                    @else
                                        <a href="{{ asset($item['url']) }}" data-lightbox class="file-image"></a>
                                    @endif
                                </div>
                            </div>
                            <div class="file-actions">
                                <div class="fileinfo hidden"
                                     data-id="file"
                                     data-src="{{ @$item['url'] }}"
                                     data-url="{{ @asset($item['url']) }}">{{ @basename($item['url']) }}</div>

                                <input type="text"
                                       class="form-control form-control-sm mb-2 tit{{ $show_title ? '' : ' hidden' }}"
                                       data-id="title"
                                       data-toggle="tooltip"
                                       data-bs-toggle="tooltip"
                                       data-original-title="{{ trans('sleeping_owl::lang.seo.title') }}"
                                       placeholder="{{ trans('sleeping_owl::lang.seo.title') }}{{ $title_required ? ' *' : '' }}"
                                       value="{{ @$item['title'] }}"{{ $title_required ? ' required' : '' }} />

                                <textarea
                                        class="form-control form-control-sm noresize desc{{ $show_description ? '' : ' hidden' }}"
                                        data-id="description"
                                        rows="3"
                                        {{ $readonly ? 'disabled' : '' }}
                                        data-toggle="tooltip"
                                        data-bs-toggle="tooltip"
                                        data-original-title="{{ trans('sleeping_owl::lang.seo.description') }}"
                                        placeholder="{{ trans('sleeping_owl::lang.seo.description') }}{{ $description_required ? ' *' : '' }}"
                                    {{ $description_required ? ' required' : '' }}>{{ @$item['desc'] }}</textarea>

                                <input type="hidden"
                                       name="original_name"
                                       class="orig"
                                       data-id="original_name"
                                       value="{{ @$item['orig'] }}" />

                                <div class="file-buttons mt-1{{ $readonly ? ' text-end' : ' text-start' }}">
                                    @if (!$readonly)
                                        <button class="btn btn-danger btn-delete btn-sm fileRemove" title="{{ trans('sleeping_owl::lang.button.remove') }}">
                                            <i class="fas fa-fw fa-times"></i>
                                        </button>

                                        @if (isset($draggable) && $draggable)
                                            <a class="btn btn-clear btn-sm float-end drag-cursor drag-handle">
                                                <i class="fas fa-fw fa-arrows-alt"></i>
                                            </a>
                                        @endif
                                    @endif
                                    <a href="{{ @asset($item['url']) }}" download class="btn btn-light btn-sm me-1{{ $readonly ? '' : ' float-end' }}" title="{{ trans('sleeping_owl::lang.button.download') }}">
                                        <i class="fas fa-fw fa-cloud-download-alt"></i>
                                    </a>
                                </div>
                            </div>
                            @if ($show_original_name)
                                <div class="file-original_name">
                                    {!! @$item['orig'] !!}
                                </div>
                            @endif
                            <div class="file-clearfix"></div>
                        </div>
                    </div>
                @endforeach
            </div>

            @if (!$readonly)
                <div class="form-element-button-add w-100 order-2 mt-2">
                    <div class="btn btn-primary fileBrowse btn-sm">
                        <i class="fas fa-spinner fa-spin" style="display: none;"></i>
                        {{ trans('sleeping_owl::lang.file.browseMultiple') }}
                    </div>
                </div>
            @endif

            <input name="{{ $name }}" class="fileValue" type="hidden" value="">

            <div class="errors">
                @include(AdminTemplate::getViewPath('form.element.partials.errors'))
            </div>
        </div>
    </div>
@endif
