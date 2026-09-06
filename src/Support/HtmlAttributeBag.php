<?php

namespace SleepingOwl\Admin\Support;

use Illuminate\View\ComponentAttributeBag;

class HtmlAttributeBag extends ComponentAttributeBag
{
    public function merge(array $attributeDefaults = [], $escape = true)
    {
        return parent::merge($attributeDefaults, false);
    }

    public function __toString(): string
    {
        $html = [];

        foreach ($this->getAttributes() as $key => $value) {
            $attribute = $this->renderAttribute($key, $value);

            if ($attribute !== null) {
                $html[] = $attribute;
            }
        }

        return implode(' ', $html);
    }

    private function renderAttribute($key, $value): ?string
    {
        if ($value === false || $value === null) {
            return null;
        }

        if (is_numeric($key)) {
            $key = $value;
        }

        if ($value === true) {
            $value = $key === 'x-data' || str_starts_with($key, 'wire:') ? '' : $key;
        }

        return $key.'="'.e(trim((string) $value)).'"';
    }
}
