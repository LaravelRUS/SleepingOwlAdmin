<div class="form-group form-element-file fileUploadMultiple {{ $errors->has($name) ? 'has-error' : '' }}"
     data-target="{{ route('admin.form.element.file', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			])  }}" data-token="{{ csrf_token() }}">

    <label for="{{ $id }}" class="control-label">
        {{ $label }}
        @if($required)
            <span class="form-element-required">*</span>
        @endif
    </label>

    <script type="text/html" class="RenderFile">
        <div class="fileThumbnail">
            <div class="thumbnail">
                <div class="fileicon">
                    <div class="fileicon-inner" style="background-image:url('[%=img%]')">
                        <span class="file-extension">[%=ext%]</span>
                        <span class="file-mime">[%=mime%]</span>
                        <a href="[%=img%]" data-toggle="lightbox" style="display: block; width: 100%; height: 100%[%=lightbox_style%]"></a>
                    </div>
                </div>
                <div class="file-actions">
                    <div class="fileinfo" data-id="file" data-src="[%=src%]" data-url="[%=url%]">[%=basename%]</div>
                    <input type="text" class="tit" data-id="title" placeholder="Заголовок" />
                    <textarea class="desc" data-id="description" rows="5" placeholder="Описание"></textarea>
                    <div class="file-buttons">
                        <a href="#" class="btn btn-danger btn-xs pull-left fileRemove"><i class="fa fa-close"></i> Удалить</a>
                        <a href="[%=url%]" target="_blank" class="btn btn-default btn-xs pull-right"><i class="fa fa-cloud-download"></i></a>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>
    </script>

    <div class="files-group dropzone">
        @foreach ($value ?? [] as $item)
            <div class="fileThumbnail">
                <div class="thumbnail">
                    <div class="fileicon">
                        <div class="fileicon-inner" {!! @$item['mime_base'] == 'image' ? 'style="background-image:url(' . asset($item['url']) . ')"' : '' !!}>
                            @if (@$item['mime_base'] != 'image')
                                @if (@$item['ext'])
                                    <span class="file-extension">{{ $item['ext'] }}</span>
                                @endif
                                @if (@$item['mime'])
                                    <span class="file-mime">{{ $item['mime'] }}</span>
                                @endif
                            @else
                                <a href="{{ asset($item['url']) }}" data-toggle="lightbox" style="display: block; width: 100%; height: 100%"></a>
                            @endif
                        </div>
                    </div>
                    <div class="file-actions">
                        <div class="fileinfo" data-id="file" data-src="{{ @$item['url'] }}" data-url="{{ @asset($item['url']) }}">{{ @basename($item['url']) }}</div>
                        <input type="text" class="tit" data-id="title" placeholder="Заголовок" value="{{ @$item['title'] }}" />
                        <textarea class="desc" data-id="description" rows="5" placeholder="Описание">{{ @$item['desc'] }}</textarea>
                        <div class="file-buttons">
                            <a href="#" class="btn btn-danger btn-xs pull-left fileRemove"><i class="fa fa-close"></i> Удалить</a>
                            <a href="{{ @asset($item['url']) }}" target="_blank" class="btn btn-default btn-xs pull-right"><i class="fa fa-cloud-download"></i></a>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <div>
        <br/>
        <div class="btn btn-primary fileBrowse">Выбрать файлы</div>
    </div>

    <input name="{{ $name }}" class="fileValue" type="hidden" value="">

    <div class="errors">
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
</div>