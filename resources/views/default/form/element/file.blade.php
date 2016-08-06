<div class="form-group {{ $errors->has($name) ? 'has-error' : '' }}">
	<label for="{{ $name }}" class="control-label">
		{{ $label }}

		@if($required)
			<span class="text-danger">*</span>
		@endif
	</label>

	<element-file
			url="{{ route('admin.form.element.file', [
				'type' => 'file',
				'adminModel' => AdminSection::getModel($model)->getAlias(),
				'field' => $path,
				'id' => $model->getKey()
			]) }}"
			value="{{ !empty($values) ? asset($value) : '' }}"
			:readonly="{{ $readonly ? 'true' : 'false' }}"
			name="{{ $name }}"
			inline-template
	>
		<div v-if="errors.length" class="alert alert-warning">
			<p v-for="error in errors"><i class="fa fa-hand-o-right" aria-hidden="true"></i> @{{ error }}</p>
		</div>

        <div class="form-element-files clearfix" v-if="has_value">
            <div class="form-element-files__item">
                <div class="form-element-files__file" data-toggle="lightbox">
                    <i class="fa fa-fw fa-lg fa-file-o"></i>
                </div>
                <div class="form-element-files__info">
                    <a :href="value" class="btn btn-default btn-xs pull-right">
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
		@endif
		<input name="{{ $name }}" class="imageValue" type="hidden" value="{{ $value }}">
		<div class="errors">
			@include(AdminTemplate::getViewPath('form.element.errors'))
		</div>
	</div>
</div>