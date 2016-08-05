<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>

	<element-images
			url="{{ route('admin.form.element.file.uploadImage', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			]) }}"
			:values="{{ json_encode($value) }}"
			:readonly="{{ $readonly ? 'true' : 'false' }}"
			name="{{ $name }}"
			inline-template
	>

		<ul v-if="errors.length" class="alert alert-warning">
			<li v-for="error in errors">@{{ error }}</li>
		</ul>

		<div class="row form-group images-group" v-if="has_values">
			<div class="col-xs-6 col-md-3" v-for="image in values">
				<div class="thumbnail">
					<a class="close" @click="remove(image)" v-if="!readonly" aria-label="{{ trans('sleeping_owl::lang.image.removeMultiple') }}">
						<span aria-hidden="true">&times;</span>
					</a>

					<img :src="image" />
				</div>
			</div>
		</div>

		<div v-if="!readonly">
			<div class="btn btn-primary upload-button">
				<i class="fa fa-upload"></i> {{ trans('sleeping_owl::lang.image.browse') }}
			</div>
		</div>

		<input name="@{{ name }}" class="imageValue" type="hidden" value="@{{ serializedValues }}">
	</element-images>

	<div class="errors">
		@include(AdminTemplate::getViewPath('form.element.errors'))
	</div>
</div>