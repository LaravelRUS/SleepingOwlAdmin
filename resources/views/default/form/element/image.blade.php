<div class="form-group form-element-image {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="form-element-required">*</span>
		@endif
	</label>

	@include(AdminTemplate::getViewPath('form.element.partials.helptext'))

	<element-image
			url="{{ route('admin.form.element.image', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			]) }}"
			value="{{ $value }}"
			:readonly="{{ $readonly ? 'true' : 'false' }}"
			name="{{ $name }}"
			inline-template
	>
		<div>
			<div v-if="errors.length" class="alert alert-warning">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="closeAlert()">
					<span aria-hidden="true">&times;</span>
				</button>

				<p v-for="error in errors"><i class="fa fa-hand-o-right" aria-hidden="true"></i> @{{ error }}</p>
			</div>
			<div class="form-element-files clearfix" v-if="has_value">
				<div class="form-element-files__item">
					<a :href="image" class="form-element-files__image" data-toggle="lightbox">
						<img :src="image" />
					</a>
					<div class="form-element-files__info">
						<a :href="image" class="btn btn-default btn-xs pull-right">
							<i class="fa fa-cloud-download"></i>
						</a>

						<button type="button" v-if="has_value && !readonly" class="btn btn-danger btn-xs" @click.prevent="remove()">
							<i class="fa fa-times"></i> {{ trans('sleeping_owl::lang.image.remove') }}
						</button>
					</div>
				</div>
			</div>

			<div v-if="!readonly">
				<div class="btn btn-primary upload-button">
					<i :class="uploadClass"></i> {{ trans('sleeping_owl::lang.image.browse') }}
				</div>

			</div>

			<input :name="name" type="hidden" :value="val">
		</div>
	</element-image>


	<div class="errors">
		@include(AdminTemplate::getViewPath('form.element.partials.errors'))
	</div>
</div>

