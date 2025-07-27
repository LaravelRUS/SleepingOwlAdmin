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
            if (is_array($val)) {
                $val = implode(' ', $val);
            }
            $renderedAttributes .= ' ' . $attr . '="' . e($val) . '"';
        }
    }

    //fix trim() attr
    $renderedAttributesString = '';
    if ($attributes && is_array($attributes)) {
        if (is_bool($val)) {
            if ($val) {
                $renderedAttributesString .= ' ' . $attr;
            }
        } else {
            if (is_array($val)) {
                $val = implode(' ', $val);
            }
            $renderedAttributesString .= ' ' . $attr . '="' . e($val) . '"';
        }
    }
@endphp

<select name="{{ $name }}"  {!! $renderedAttributesString !!} {!! $renderedAttributes !!}>
    @if(!empty($attributesArray['placeholder']))
        <option value="">{{ $attributesArray['placeholder'] }}</option>
    @endif
    @foreach($normalizedOptions as $option)
        <option value="{{ $option['id'] }}" @selected($option['id'] == $selectedValue)>
            {{ $option['text'] }}
        </option>
    @endforeach
</select>

