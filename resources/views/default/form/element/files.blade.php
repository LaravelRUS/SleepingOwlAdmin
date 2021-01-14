@if ($visibled)
    <div class="form-group form-element-file fileUploadMultiple{{ $class ? ' ' . $class : '' }} {{ $errors->has($name) ? 'has-error' : '' }}" {!! $style ? ' style="' . $style . '"' : '' !!}
    data-target="{{ route('admin.form.element.file', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			])  }}"
         data-token="{{ csrf_token() }}">

        <label for="{{ $id }}" class="control-label">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))

        @if (!$readonly)
            <script type="text/html" class="RenderFile">
                <div class="fileThumbnail">
                    <div class="thumbnail">
                        <div class="fileicon">
                            <div class="fileicon-inner" style="background-image:url('[%=img%]')">
                                <span class="file-extension">[%=ext%]</span>
                                <span class="file-mime">[%=mime%]</span>
                                <a href="[%=img%]" data-toggle="lightbox" style="[%=lightbox_style%]" class="file-image"></a>
                            </div>
                        </div>
                        <div class="file-actions">
                            <div class="fileinfo hidden" data-id="file" data-src="[%=src%]" data-url="[%=url%]">
                                [%=basename%]
                            </div>

                            <input type="text" class="form-control form-control-sm mb-2 tit{{ $show_title ? '' : ' hidden' }}"
                                   data-id="title"
                                   data-toggle="tooltip"
                                   data-original-title="{{ trans('sleeping_owl::lang.seo.title') }}"
                                   placeholder="{{ trans('sleeping_owl::lang.seo.title') }}"{{ $title_required ? ' required' : '' }}
                            />

                            <textarea class="form-control form-control-sm noresize desc{{ $show_description ? '' : ' hidden' }}"
                                      data-id="description"
                                      rows="3"
                                      data-toggle="tooltip"
                                      data-original-title="{{ trans('sleeping_owl::lang.seo.description') }}"
                                      placeholder="{{ trans('sleeping_owl::lang.seo.description') }}"{{ $description_required ? ' required' : '' }}
                            ></textarea>

                            @if (!empty($text_fields))
                                @foreach($text_fields as $field)
                                    <label style=" width: 100%">
                                        <span style="float: left;">
                                             {{@$field['label']}}
                                        </span>
                                        <input type="text" class="form-control form-control-sm mb-2 text-field"
                                               data-id="{{$field['name']}}"
                                               data-toggle="tooltip"
                                               data-original-title="{{ trans('sleeping_owl::lang.seo.description') }}"
                                               placeholder="{{isset($field['placeholder']) ? $field['placeholder'] : ''}}"
                                               {{isset($field['required']) && $field['required'] ? 'required' : ''}}
                                        >
                                    </label>
                                @endforeach
                            @endif
                            <div class="file-buttons mt-1 text-left">
                                <button class="btn btn-danger btn-delete btn-xs fileRemove">
                                    <i class="fas fa-fw fa-times"></i>
                                </button>
                                @if(!empty($checkboxes))
                                    @foreach($checkboxes as $checkbox)
                                        <span data-id="{{$checkbox['name']}}" class="btn btn-primary btn-xs checkbox-toggle" data-toggle="tooltip" data-value="1" title="{{@$checkbox['label']}}">
                                                <i class="fas fa-fw fa-check-square"></i>
                                                <i class="fas fa-fw fa-minus-square hidden"></i>
                                        </span>
                                    @endforeach
                                @endif

                                @if (isset($draggable) && $draggable)
                                    <a class="btn btn-clear btn-sm pull-right drag-cursor">
                                        <i class="fas fa-fw fa-arrows-alt"></i>
                                    </a>
                                @endif
                                <a href="[%=url%]" download class="btn btn-default btn-sm pull-right mr-1" title="{{ trans('sleeping_owl::lang.button.download') }}" target="_blank">
                                    <i class="fas fa-fw fa-cloud-upload-alt"></i>
                                </a>
                            </div>
                        </div>
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
                                    <a href="{{ asset($item['url']) }}" data-toggle="lightbox" class="file-image"></a>
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
                                   data-original-title="{{ trans('sleeping_owl::lang.seo.title') }}"
                                   placeholder="{{ trans('sleeping_owl::lang.seo.title') }}{{ $title_required ? ' *' : '' }}"
                                   value="{{ @$item['title'] }}"{{ $title_required ? ' required' : '' }} />

                            <textarea
                                class="form-control form-control-sm noresize desc{{ $show_description ? '' : ' hidden' }}"
                                data-id="description"
                                rows="3"
                                {{ $readonly ? 'disabled' : '' }}
                                data-toggle="tooltip"
                                data-original-title="{{ trans('sleeping_owl::lang.seo.description') }}"
                                placeholder="{{ trans('sleeping_owl::lang.seo.description') }}{{ $description_required ? ' *' : '' }}"
                                    {{ $description_required ? ' required' : '' }}>{{ @$item['desc'] }}</textarea>
                            @if (!empty($text_fields))
                                @foreach($text_fields as $field)
                                    <label style=" width: 100%">
                                        <span style="float: left;">
                                             {{@$field['label']}}
                                        </span>
                                        <input type="text" class="form-control form-control-sm mb-2 text-field"
                                               data-id="{{$field['name']}}"
                                               data-toggle="tooltip"
                                               data-original-title="{{ trans('sleeping_owl::lang.seo.description') }}"
                                               placeholder="{{isset($field['placeholder']) ? $field['placeholder'] : ''}}"
                                               {{isset($field['required']) && $field['required'] ? 'required' : ''}}
                                               value="{{ @$item[$field['name']] }}"
                                               @if (@$item['readonly']) readonly @endif
                                        >
                                    </label>
                                @endforeach
                            @endif
                            <div class="file-buttons mt-1{{ $readonly ? ' text-right' : ' text-left' }}">
                                @if (!$readonly)
                                    <button class="btn btn-danger btn-delete btn-xs fileRemove">
                                        <i class="fas fa-fw fa-times"></i>
                                    </button>
                                    @if(!empty($checkboxes))
                                        @foreach($checkboxes as $checkbox)
                                            @if(isset($item[$checkbox['name']]))
                                                <span data-id="{{$checkbox['name']}}" class="btn btn-xs checkbox-toggle {{$item[$checkbox['name']] == 1 ? 'btn-primary' : 'btn-danger'}}" data-toggle="tooltip" data-value="{{$item[$checkbox['name']]}}" title="{{@$checkbox['label']}}">
                                                <i class="fas fa-fw fa-check-square{{$item[$checkbox['name']] != 1 ? ' hidden' : ''}}"></i>
                                                <i class="fas fa-fw fa-minus-square{{$item[$checkbox['name']] == 1 ? ' hidden' : ''}}"></i>
                                                </span>
                                            @endif
                                        @endforeach
                                    @endif

                                    @if (isset($draggable) && $draggable)
                                        <a class="btn btn-clear btn-sm pull-right drag-cursor">
                                            <i class="fas fa-fw fa-arrows-alt"></i>
                                        </a>
                                    @endif
                                @endif
                                <a href="{{ @asset($item['url']) }}" download class="btn btn-default btn-sm mr-1{{ $readonly ? '' : ' pull-right' }}" title="{{ trans('sleeping_owl::lang.button.download') }}" target="_blank">
                                    <i class="fas fa-fw fa-cloud-upload-alt"></i>
                                </a>
                            </div>
                        </div>
                        <div class="file-clearfix"></div>
                    </div>
                </div>
            @endforeach
        </div>

        @if (!$readonly)
            <div class="form-element-button-add w-100 order-2 mt-2">
                <div class="btn btn-primary fileBrowse btn-sm">{{ trans('sleeping_owl::lang.file.browseMultiple') }}</div>
            </div>
        @endif

        <input name="{{ $name }}" class="fileValue" type="hidden" value="">

        <div class="errors">
            @include(AdminTemplate::getViewPath('form.element.partials.errors'))
        </div>
    </div>
@endif
