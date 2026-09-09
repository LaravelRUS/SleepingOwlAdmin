<?php

namespace SleepingOwl\Admin\Configuration;

use Illuminate\Contracts\Config\Repository;
use SleepingOwl\Admin\Themes\CssColor;

final class DataTablesAutoUpdateConfiguration
{
    private const DEFAULT_COLOR = '#dc3545';

    private const DEFAULT_INTERVAL_SECONDS = 300;

    private bool $enabled;

    /** @var list<array{class: string, interval: int, interval_ms: int, color: string}> */
    private array $profiles;

    public function __construct(Repository $config)
    {
        [$this->enabled, $profiles, $path] = $this->normalizeConfiguration(
            $config->get('sleeping_owl.datatables_settings.autoupdate', [])
        );
        $this->profiles = $this->normalizeProfiles($profiles, $path);
    }

    public function enabled(): bool
    {
        return $this->enabled && $this->profiles !== [];
    }

    /**
     * @return list<array{class: string, interval: int, interval_ms: int, color: string}>
     */
    public function profiles(): array
    {
        return $this->profiles;
    }

    /**
     * @return list<array{class: string, interval: int, color: string}>
     */
    public function runtimeProfiles(): array
    {
        return array_map(static fn (array $profile): array => [
            'class' => $profile['class'],
            'interval' => $profile['interval_ms'],
            'color' => $profile['color'],
        ], $this->profiles);
    }

    /** @return array{bool, array<mixed>, string} */
    private function normalizeConfiguration(mixed $configuration): array
    {
        $path = 'sleeping_owl.datatables_settings.autoupdate';

        if (! is_array($configuration)) {
            throw new \InvalidArgumentException(
                "[{$path}] must contain an enabled flag and a profiles map."
            );
        }

        $structured = array_key_exists('enabled', $configuration)
            || array_key_exists('profiles', $configuration);

        if (! $structured) {
            return [$configuration !== [], $configuration, $path];
        }

        $enabled = $configuration['enabled'] ?? false;
        if (! is_bool($enabled)) {
            throw new \InvalidArgumentException("[{$path}.enabled] must be a boolean.");
        }

        $profiles = $configuration['profiles'] ?? [];
        if (! is_array($profiles)) {
            throw new \InvalidArgumentException("[{$path}.profiles] must be a map keyed by table CSS class.");
        }

        // Direct class entries were the short-lived pre-structure format. They
        // may coexist with injected package defaults after recursive merging.
        $legacyProfiles = array_diff_key($configuration, array_flip(['enabled', 'profiles']));

        return [$enabled, array_replace($profiles, $legacyProfiles), "{$path}.profiles"];
    }

    /**
     * @param  array<mixed>  $profiles
     * @return list<array{class: string, interval: int, interval_ms: int, color: string}>
     */
    private function normalizeProfiles(array $profiles, string $path): array
    {
        $normalized = [];

        foreach ($profiles as $class => $settings) {
            if (! is_string($class) || preg_match('/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/', $class) !== 1) {
                throw new \InvalidArgumentException(
                    "[{$path}] keys must be valid CSS class names."
                );
            }

            if (! is_array($settings)) {
                throw new \InvalidArgumentException(
                    "[{$path}.{$class}] must be an array."
                );
            }

            $interval = $this->normalizeIntervalSeconds($settings['interval'] ?? null);
            $normalized[] = [
                'class' => $class,
                'interval' => $interval,
                'interval_ms' => $interval * 1000,
                'color' => $this->normalizeColor($settings['color'] ?? null, "{$path}.{$class}.color"),
            ];
        }

        return $normalized;
    }

    private function normalizeIntervalSeconds(mixed $value): int
    {
        $seconds = (int) $value;

        return $seconds >= 1 ? $seconds : self::DEFAULT_INTERVAL_SECONDS;
    }

    private function normalizeColor(mixed $value, string $path): string
    {
        $color = trim((string) $value);

        if ($color === '') {
            return self::DEFAULT_COLOR;
        }

        return CssColor::from(
            $color,
            $path
        )->value();
    }
}
