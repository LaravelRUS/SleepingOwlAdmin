<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>

	<element-images
			url="{{ route('admin.form.element.image', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			]) }}"
			:values="{{ json_encode($value) }}"
			:readonly="{{ $readonly ? 'true' : 'false' }}"
			name="{{ $name }}"
			inline-template
	>

		<div v-if="errors.length" class="alert alert-warning">
			<button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="closeAlert()">
				<span aria-hidden="true">&times;</span>
			</button>

			<p v-for="error in errors"><i class="fa fa-hand-o-right" aria-hidden="true"></i> @{{ error }}</p>
		</div>

		<div class="form-element-files dropzone clearfix">
			<div class="form-element-files__item" v-for="uri in values">
				<a :href="image(uri)" class="form-element-files__image" data-toggle="images">
					<img :src="image(uri)" />
				</a>
				<div class="form-element-files__info">
					<a :href="image(uri)" class="btn btn-default btn-xs pull-right">
						<i class="fa fa-cloud-download"></i>
					</a>

					<button @click.prevent="remove(uri)" v-if="!readonly" class="btn btn-danger btn-xs" aria-label="{{ trans('sleeping_owl::lang.image.remove') }}">
						<i class="fa fa-times"></i>
					</button>
				</div>
			</div>
		</div>

		<div v-if="!readonly">
			<br />
			<div class="btn btn-primary upload-button">
				<i class="fa fa-upload"></i> {{ trans('sleeping_owl::lang.image.browse') }}
			</div>
		</div>

		<input name="@{{ name }}" type="hidden" value="@{{ serializedValues }}">
	</element-images>

	<div class="errors">
		@include(AdminTemplate::getViewPath('form.element.errors'))
	</div>
</div>