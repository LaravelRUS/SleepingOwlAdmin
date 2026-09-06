<?php

namespace SleepingOwl\Admin\Themes;

use InvalidArgumentException;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeCapabilities
{
    /** @var array<string, ThemeCapability> */
    private array $capabilities = [];

    /**
     * @param  list<ThemeCapability|string>  $capabilities
     */
    public function __construct(array $capabilities = [])
    {
        foreach ($capabilities as $capability) {
            $capability = $this->normalize($capability);
            $this->capabilities[$capability->value] = $capability;
        }
    }

    public static function fromTheme(ThemeInterface $theme): self
    {
        return new self($theme->capabilities());
    }

    public function supports(ThemeCapability $capability): bool
    {
        return isset($this->capabilities[$capability->value]);
    }

    /**
     * @return list<ThemeCapability>
     */
    public function all(): array
    {
        return array_values(array_filter(
            ThemeCapability::cases(),
            fn (ThemeCapability $capability) => $this->supports($capability)
        ));
    }

    /**
     * @return list<string>
     */
    public function ids(): array
    {
        return array_map(
            fn (ThemeCapability $capability) => $capability->value,
            $this->all()
        );
    }

    private function normalize(mixed $capability): ThemeCapability
    {
        if ($capability instanceof ThemeCapability) {
            return $capability;
        }

        if (is_string($capability) && ($known = ThemeCapability::tryFrom($capability))) {
            return $known;
        }

        $value = is_scalar($capability) ? (string) $capability : get_debug_type($capability);

        throw new InvalidArgumentException("Unknown theme capability [{$value}].");
    }
}
