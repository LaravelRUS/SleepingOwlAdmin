<?php

namespace SleepingOwl\Admin\Themes;

use InvalidArgumentException;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeIcons
{
    private const NAME_PATTERN = '/\A[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\z/';

    /** @var array<string, string> */
    private array $icons = [];

    /**
     * @param  array<string, string>  $icons
     */
    public function __construct(array $icons = [])
    {
        foreach ($icons as $name => $token) {
            $this->add($name, $token);
        }
    }

    public static function fromTheme(ThemeInterface $theme): self
    {
        return new self($theme->icons());
    }

    public function has(string $name): bool
    {
        return isset($this->icons[$name]);
    }

    public function get(string $name): ?string
    {
        return $this->icons[$name] ?? null;
    }

    /**
     * @return array<string, string>
     */
    public function all(): array
    {
        return $this->icons;
    }

    private function add(mixed $name, mixed $token): void
    {
        if (! is_string($name) || preg_match(self::NAME_PATTERN, $name) !== 1) {
            throw new InvalidArgumentException('Theme icon names must be non-empty logical identifiers.');
        }

        if (! is_string($token) || trim($token) === '') {
            throw new InvalidArgumentException("Theme icon [{$name}] must have a non-empty string token.");
        }

        $this->icons[$name] = $token;
    }
}
