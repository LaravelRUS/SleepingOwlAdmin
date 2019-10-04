@if ($visibled)
  <div class="form-group form-element-file fileUploadMultiple {{ $errors->has($name) ? 'has-error' : '' }}"
      data-target="{{ route('admin.form.element.file', [
  				'adminModel' => AdminSection::getModel($model)->getAlias(),
  				'field' => $path,
  				'id' => $model->getKey()
  			])  }}" data-token="{{ csrf_token() }}">

      <label for="{{ $id }}" class="control-label">
          {!! $label !!}

          @if($required)
              <span class="form-element-required">*</span>
          @endif
      </label>

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
                      <div class="fileinfo hidden" data-id="file" data-src="[%=src%]" data-url="[%=url%]">[%=basename%]</div>


                      <input type="text" class="form-control form-control-sm mb-2 tit{{ $show_title ? '' : ' hidden' }}"
                        data-id="title"
                        data-toggle="tooltip"
                        data-original-title="{{ trans('sleeping_owl::lang.seo.title') }}"
                        placeholder="{{ trans('sleeping_owl::lang.seo.title') }}{{ $title_required ? ' *' : '' }}"
                        />

                      <textarea class="form-control form-control-sm noresize desc{{ $show_description ? '' : ' hidden' }}"
                        data-id="description"
                        rows="3"
                        data-toggle="tooltip"
                        data-original-title="{{ trans('sleeping_owl::lang.seo.description') }}"
                        placeholder="{{ trans('sleeping_owl::lang.seo.description') }}{{ $description_required ? ' *' : '' }}"{{ $description_required ? ' required' : '' }}
                      ></textarea>

                      <div class="file-buttons mt-1 text-left">
                        <button class="btn btn-danger btn-delete btn-xs fileRemove">
                          <i class="fas fa-times"></i> {{ trans('sleeping_owl::lang.file.remove') }}
                        </button>
                        <a class="btn btn-clear btn-sm pull-right drag-cursor">
                          <i class="fas fa-arrows-alt"></i>
                        </a>
                        <a href="[%=url%]" download class="btn btn-default btn-sm pull-right mr-1" title="{{ trans('sleeping_owl::lang.button.download') }}" target="_blank">
                          <i class="fas fa-cloud-upload-alt"></i>
                        </a>
                      </div>
                  </div>

              </div>
          </div>

      </script>
      @endif

      <div class="files-group dropzone{{ $files_group_class }}{{ $readonly ? ' dissortable' : '' }}">
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
                            {{ $readonly ? 'disabled' : '' }}
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
                            placeholder="{{ trans('sleeping_owl::lang.seo.description') }}{{ $description_required ? ' *' : '' }}"{{ $description_required ? ' required' : '' }}>{{ @$item['desc'] }}</textarea>

                          <div class="file-buttons mt-1{{ $readonly ? ' text-right' : ' text-left' }}">
                            @if (!$readonly)
                              <button class="btn btn-danger btn-delete btn-xs fileRemove">
                                <i class="fas fa-times"></i> {{ trans('sleeping_owl::lang.file.remove') }}
                              </button>
                              <a class="btn btn-clear btn-sm pull-right drag-cursor">
                                <i class="fas fa-arrows-alt"></i>
                              </a>
                            @endif
                              <a href="{{ @asset($item['url']) }}" download class="btn btn-default btn-sm mr-1{{ $readonly ? '' : ' pull-right' }}" title="{{ trans('sleeping_owl::lang.button.download') }}" target="_blank">
                                <i class="fas fa-cloud-upload-alt"></i>
                              </a>
                              {{-- <a href="{{ @asset($item['url']) }}" class="btn btn-default btn-sm pull-right mr-1 fileLink" title="{{ trans('sleeping_owl::lang.file.insert_link') }}">
                                <i class="fas fa-link"></i>
                              </a> --}}
                          </div>
                      </div>

                  </div>
              </div>
          @endforeach

          @if (!$readonly)
            <div class="w-100 order-2">
              <hr/>
              <div class="btn btn-primary fileBrowse">{{ trans('sleeping_owl::lang.file.browseMultiple') }}</div>
            </div>
          @endif
      </div>


      <input name="{{ $name }}" class="fileValue" type="hidden" value="">

      <div class="errors">
          @include(AdminTemplate::getViewPath('form.element.partials.errors'))
      </div>
  </div>
@endif
