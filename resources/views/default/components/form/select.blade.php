@php
    $selectedValue = old($name, $value);

    $normalizedOptions = [];

    foreach ($options as $key => $option) {
        if (is_array($option) && array_key_exists('id', $option) && array_key_exists('text', $option)) {
            $normalizedOptions[] = $option;
        } else {
            $normalizedOptions[] = ['id' => $key, 'text' => $option];
        }
    }

    $renderedAttributes = '';
    foreach ($attributesArray as $attr => $val) {
        if (is_bool($val)) {
            if ($val) {
                $renderedAttributes .= ' ' . $attr;
            }
        } else {
            $renderedAttributes .= ' ' . $attr . '="' . e($val) . '"';
        }
    }
@endphp


<select name="{{ $name }}" {!! $attributes !!} {!! $renderedAttributes !!}>
    @foreach($normalizedOptions as $option)
        @if(!empty($attributesArray['placeholder']))
            <option value="">{{ $attributesArray['placeholder'] }}</option>
        @endif
        <option value="{{ $option['id'] }}" @selected($option['id'] == $selectedValue)>
            {{ $option['text'] }}
        </option>
    @endforeach
</select>

