<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>
	<div class="imageUploadMultiple" data-target="{{ route('admin.form.element.file.uploadImage') }}" data-token="{{ csrf_token() }}">
		<div class="row form-group images-group">
			@foreach ($value as $image)
				<div class="col-xs-6 col-md-3 imageThumbnail">
					<div class="thumbnail">
						<img data-value="{{ $image }}" src="{{ asset($image) }}" />
						<a href="#" class="imageRemove">Remove</a>
					</div>
				</div>
			@endforeach
		</div>
		<div>
			<div class="btn btn-primary imageBrowse"><i class="fa fa-upload"></i> {{ trans('sleeping_owl::lang.image.browseMultiple') }}</div>
		</div>
		<input name="{{ $name }}" class="imageValue" type="hidden" value="{{ !empty($value) && sizeof($value) != 0 ? implode(',', $value) : "" }}">
		<div class="errors">
			@include(AdminTemplate::getViewPath('form.element.errors'))
		</div>
	</div>
</div>