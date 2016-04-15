<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	<div class="imageUpload" data-target="{{ route('admin.form.element.file.uploadImage') }}" data-token="{{ csrf_token() }}">
		<div>
			<div class="thumbnail">
				<img class="no-value {{ empty($value) ? '' : 'hidden' }}" src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image" width="200px" height="150px" />
				<img class="has-value {{ empty($value) ? 'hidden' : '' }}" src="{{ asset($value) }}" width="200px" height="150px" />
			</div>
		</div>
		<div>
			<div class="btn btn-primary imageBrowse"><i class="fa fa-upload"></i> {{ trans('sleeping_owl::lang.image.browse') }}</div>
			<div class="btn btn-danger imageRemove"><i class="fa fa-times"></i> {{ trans('sleeping_owl::lang.image.remove') }}</div>
		</div>
		<input name="{{ $name }}" class="imageValue" type="hidden" value="{{ $value }}">
		<div class="errors">
			@include(AdminTemplate::getViewPath('form.element.errors'))
		</div>
	</div>
</div>