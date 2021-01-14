<div class="input-group input-date date" {!! $width !!}>
    <input
        data-date-format="{{ $pickerFormat }}"
        class="form-control column-filter"
        type="text"
        {!! $attributes !!} />

    <div class="input-group-prepend input-group-addon">
        <div class="input-group-text">
            <span class="far fa-calendar-alt"></span>
        </div>
    </div>
</div>
