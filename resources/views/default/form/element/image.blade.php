<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>

	<element-image
			url="{{ route('admin.form.element.file.uploadImage', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			]) }}"
			value="{{ !empty($values) ? asset($value) : '' }}"
			:readonly="{{ $readonly ? 'true' : 'false' }}"
			name="{{ $name }}"
			inline-template
	>
			<ul v-if="errors.length" class="alert alert-warning">
				<li v-for="error in errors">@{{ error }}</li>
			</ul>
			<div class="thumbnail">
				<img v-if="has_value" :src="value" width="200px" height="150px" />
			</div>

			<div v-if="!readonly">
				<div class="btn btn-primary upload-button">
					<i class="fa fa-upload"></i> {{ trans('sleeping_owl::lang.image.browse') }}
				</div>
				<button class="btn btn-danger" @click.prevent="remove()">
					<i class="fa fa-times"></i> {{ trans('sleeping_owl::lang.image.remove') }}
				</button>
			</div>

			<input name="@{{ name }}" class="imageValue" type="hidden" value="@{{ value }}">
	</element-image>


	<div class="errors">
		@include(AdminTemplate::getViewPath('form.element.errors'))
	</div>
</div>