<?php

namespace SleepingOwl\Admin\Themes;

use InvalidArgumentException;
use Stringable;

final class CssColor implements Stringable
{
    private const HEX_PATTERN = '/\A#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})\z/i';

    private function __construct(private string $value)
    {
    }

    public static function from(mixed $value, string $source = 'color'): self
    {
        if (! is_string($value)) {
            throw self::invalid($source);
        }

        $value = trim($value);

        if (! self::isSupported($value)) {
            throw self::invalid($source);
        }

        return new self($value);
    }

    public function value(): string
    {
        return $this->value;
    }

    public function __toString(): string
    {
        return $this->value();
    }

    private static function isSupported(string $value): bool
    {
        return strcasecmp($value, 'transparent') === 0
            || preg_match(self::HEX_PATTERN, $value) === 1
            || self::isSupportedFunction($value);
    }

    private static function isSupportedFunction(string $value): bool
    {
        $number = '[-+]?(?:\d+(?:\.\d+)?|\.\d+)';
        $channel = $number.'%?';
        $alpha = $number.'%?';
        $hue = $number.'(?:deg|grad|rad|turn)?';
        $percentage = $number.'%';
        $patterns = [
            "/\\Argb(?:a)?\\(\\s*{$channel}\\s*,\\s*{$channel}\\s*,\\s*{$channel}(?:\\s*,\\s*{$alpha})?\\s*\\)\\z/i",
            "/\\Argb(?:a)?\\(\\s*{$channel}\\s+{$channel}\\s+{$channel}(?:\\s*\\/\\s*{$alpha})?\\s*\\)\\z/i",
            "/\\Ahsla?\\(\\s*{$hue}\\s*,\\s*{$percentage}\\s*,\\s*{$percentage}(?:\\s*,\\s*{$alpha})?\\s*\\)\\z/i",
            "/\\Ahsla?\\(\\s*{$hue}\\s+{$percentage}\\s+{$percentage}(?:\\s*\\/\\s*{$alpha})?\\s*\\)\\z/i",
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $value) === 1) {
                return true;
            }
        }

        return false;
    }

    private static function invalid(string $source): InvalidArgumentException
    {
        return new InvalidArgumentException(
            "Invalid CSS color configured for [{$source}]. "
            .'Use hexadecimal, rgb/rgba, hsl/hsla, or transparent.'
        );
    }
}
