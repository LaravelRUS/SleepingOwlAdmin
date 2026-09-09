<?php

namespace SleepingOwl\Admin\Configuration;

use Illuminate\Contracts\Config\Repository;
use SleepingOwl\Admin\Themes\CssColor;

final class DataTablesAutoUpdateConfiguration
{
    private const DEFAULT_COLOR = '#dc3545';

    private const DEFAULT_INTERVAL_SECONDS = 300;

    /** @var list<array{class: string, interval: int, interval_ms: int, color: string}> */
    private array $profiles;

    public function __construct(Repository $config)
    {
        $this->profiles = $this->normalizeProfiles(
            $config->get('sleeping_owl.datatables_settings.autoupdate', [])
        );
    }

    public function enabled(): bool
    {
        return $this->profiles !== [];
    }

    /**
     * @return list<array{class: string, interval: int, interval_ms: int, color: string}>
     */
    public function profiles(): array
    {
        return $this->profiles;
    }

    /**
     * @return list<array{class: string, interval: int, interval_ms: int, color: string}>
     */
    private function normalizeProfiles(mixed $profiles): array
    {
        if (! is_array($profiles)) {
            throw new \InvalidArgumentException(
                '[sleeping_owl.datatables_settings.autoupdate] must be a map keyed by table CSS class.'
            );
        }

        $normalized = [];

        foreach ($profiles as $class => $settings) {
            if (! is_string($class) || preg_match('/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/', $class) !== 1) {
                throw new \InvalidArgumentException(
                    '[sleeping_owl.datatables_settings.autoupdate] keys must be valid CSS class names.'
                );
            }

            if (! is_array($settings)) {
                throw new \InvalidArgumentException(
                    "[sleeping_owl.datatables_settings.autoupdate.{$class}] must be an array."
                );
            }

            $interval = $this->normalizeIntervalSeconds($settings['interval'] ?? null);
            $normalized[] = [
                'class' => $class,
                'interval' => $interval,
                'interval_ms' => $interval * 1000,
                'color' => $this->normalizeColor($settings['color'] ?? null, $class),
            ];
        }

        return $normalized;
    }

    private function normalizeIntervalSeconds(mixed $value): int
    {
        $seconds = (int) $value;

        return $seconds >= 1 ? $seconds : self::DEFAULT_INTERVAL_SECONDS;
    }

    private function normalizeColor(mixed $value, string $class): string
    {
        $color = trim((string) $value);

        if ($color === '') {
            return self::DEFAULT_COLOR;
        }

        return CssColor::from(
            $color,
            "sleeping_owl.datatables_settings.autoupdate.{$class}.color"
        )->value();
    }
}
