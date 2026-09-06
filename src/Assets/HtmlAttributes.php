<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;
use Stringable;

final class HtmlAttributes
{
    /**
     * @param  array<int|string, mixed>  $attributes
     */
    public function render(array $attributes): string
    {
        $rendered = [];

        foreach ($attributes as $name => $value) {
            $attribute = $this->renderAttribute($name, $value);
            if ($attribute !== null) {
                $rendered[] = $attribute;
            }
        }

        return $rendered === [] ? '' : ' '.implode(' ', $rendered);
    }

    private function renderAttribute(int|string $name, mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_int($name)) {
            $name = $value;
        }

        if (! is_scalar($name) || ! $this->isStringable($value)) {
            throw new InvalidArgumentException('HTML attributes must contain scalar values.');
        }

        $name = (string) $name;

        return $this->escape($name).'="'.$this->escape((string) $value).'"';
    }

    private function isStringable(mixed $value): bool
    {
        return is_scalar($value) || $value instanceof Stringable;
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
