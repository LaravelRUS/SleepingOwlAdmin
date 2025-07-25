<div {!! $width !!} class="adm-form-select">
    <x-sleepingowl::form.select
        :name="''"
        :options="$options"
        :value="$default"
        :attributes="$attributesArray" />
</div>
