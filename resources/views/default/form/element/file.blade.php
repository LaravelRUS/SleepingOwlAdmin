<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	<div class="imageUpload" data-target="{{ route('admin.form.element.file.uploadFile') }}" data-token="{{ csrf_token() }}">
		<div>
			<div class="thumbnail">
				<div class="no-value {{ empty($value) ? '' : 'hidden' }}">
					<i class="fa fa-fw fa-file-o"></i> no file
				</div>
				<div class="has-value {{ empty($value) ? 'hidden' : '' }}">
					<a href="{{ asset($value) }}" data-toggle="tooltip" title="{{ trans('sleeping_owl::lang.table.download') }}"><i class="fa fa-fw fa-file-o"></i> <span>{{ $value }}</span></a>
				</div>
			</div>
		</div>
		<div>
			<div class="btn btn-primary imageBrowse"><i class="fa fa-upload"></i> {{ trans('sleeping_owl::lang.file.browse') }}</div>
			<div class="btn btn-danger imageRemove"><i class="fa fa-times"></i> {{ trans('sleeping_owl::lang.file.remove') }}</div>
		</div>
		<input name="{{ $name }}" class="imageValue" type="hidden" value="{{ $value }}">
		<div class="errors">
			@include(AdminTemplate::getViewPath('form.element.errors'))
		</div>
	</div>
</div>