<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>

	<element-file
			url="{{ route('admin.form.element.file', [
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			]) }}"
			value="{{ $value }}"
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

        <div class="form-element-files clearfix" v-if="has_value">
            <div class="form-element-files__item">
                <div class="form-element-files__file">
                    <i class="fa fa-fw fa-lg fa-file-o"></i>
                </div>
                <div class="form-element-files__info">
                    <a :href="file" class="btn btn-default btn-xs pull-right">
                        <i class="fa fa-cloud-download"></i>
                    </a>

                    <button v-if="has_value" class="btn btn-danger btn-xs" @click.prevent="remove()">
                        <i class="fa fa-times"></i> {{ trans('sleeping_owl::lang.image.remove') }}
                    </button>
                </div>
            </div>
        </div>

		<div v-if="!readonly">
			<div class="btn btn-primary upload-button">
				<i class="fa fa-upload"></i> {{ trans('sleeping_owl::lang.file.browse') }}
			</div>
		</div>

		<input name="@{{ name }}" type="hidden" value="@{{ value }}">
	</element-file>

	<div class="errors">
		@include(AdminTemplate::getViewPath('form.element.errors'))
	</div>
</div>