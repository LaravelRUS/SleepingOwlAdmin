@if ($visibled)
    <div class="form-group form-element-timestamp {{ $errors->has($name) ? 'has-error' : '' }}">
        <label for="{{ $name }}" class="control-label {{ $required ? 'required' : '' }}">
            {!! $label !!}

            @if($required)
                <span class="form-element-required">*</span>
            @endif
        </label>

        <div class="input-date input-group datetime">
            <input {!! $attributes !!}
                   value="{{ $value }}"
                   @if($readonly) readonly @endif
            >
            <span class="input-group-prepend input-group-addon">
				<div class="input-group-text">
					<span class="far fa-calendar-alt"></span>
				</div>
			</span>

        </div>

        @include(AdminTemplate::getViewPath('form.element.partials.helptext'))
        @include(AdminTemplate::getViewPath('form.element.partials.errors'))
    </div>
@endif
