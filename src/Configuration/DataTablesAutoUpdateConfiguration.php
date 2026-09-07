<?php

namespace SleepingOwl\Admin\Configuration;

use Illuminate\Contracts\Config\Repository;
use SleepingOwl\Admin\Themes\CssColor;

final class DataTablesAutoUpdateConfiguration
{
    private const DEFAULT_COLOR = '#dc3545';

    private const DEFAULT_INTERVAL_SECONDS = 300;

    private const DEFAULT_TABLE_CLASS = 'autoupdate';

    private bool $enabled;

    private int $intervalSeconds;

    /** @var list<string> */
    private array $tableClasses;

    private string $color;

    public function __construct(Repository $config)
    {
        $this->enabled = (bool) $config->get('sleeping_owl.datatables_settings.dt_autoupdate', false);
        $this->intervalSeconds = $this->normalizeIntervalSeconds(
            $config->get('sleeping_owl.datatables_settings.dt_autoupdate_interval')
        );
        $this->tableClasses = $this->normalizeClasses(
            $config->get('sleeping_owl.datatables_settings.dt_autoupdate_class')
        );
        $this->color = $this->normalizeColor(
            $config->get('sleeping_owl.datatables_settings.dt_autoupdate_color')
        );
    }

    public function enabled(): bool
    {
        return $this->enabled;
    }

    /** @deprecated Use intervalSeconds() for the configured interval. */
    public function intervalMinutes(): int
    {
        return (int) ceil($this->intervalSeconds / 60);
    }

    public function intervalSeconds(): int
    {
        return $this->intervalSeconds;
    }

    public function intervalMilliseconds(): int
    {
        return $this->intervalSeconds * 1000;
    }

    public function tableClass(): ?string
    {
        return $this->tableClasses[0] ?? null;
    }

    /** @return list<string> */
    public function tableClasses(): array
    {
        return $this->tableClasses;
    }

    public function tableSelector(): string
    {
        if ($this->tableClasses === []) {
            return '.datatables';
        }

        return implode(', ', array_map(
            static fn (string $class): string => '.datatables.'.$class,
            $this->tableClasses
        ));
    }

    public function color(): string
    {
        return $this->color;
    }

    private function normalizeIntervalSeconds(mixed $value): int
    {
        $seconds = (int) $value;

        return $seconds >= 1 ? $seconds : self::DEFAULT_INTERVAL_SECONDS;
    }

    /** @return list<string> */
    private function normalizeClasses(mixed $value): array
    {
        if ($value === null || $value === false || $value === '') {
            return [self::DEFAULT_TABLE_CLASS];
        }

        if (! is_string($value) && ! is_array($value)) {
            throw new \InvalidArgumentException(
                '[sleeping_owl.datatables_settings.dt_autoupdate_class] must be a string or an array.'
            );
        }

        $values = is_array($value) ? $value : [$value];
        $classes = [];

        foreach ($values as $item) {
            if (! is_string($item)) {
                throw new \InvalidArgumentException(
                    '[sleeping_owl.datatables_settings.dt_autoupdate_class] must contain only strings.'
                );
            }

            foreach (preg_split('/[\s,]+/u', trim($item), -1, PREG_SPLIT_NO_EMPTY) ?: [] as $class) {
                $class = ltrim($class, '.');
                if ($class !== '') {
                    $classes[] = $class;
                }
            }
        }

        $classes[] = self::DEFAULT_TABLE_CLASS;

        return array_values(array_unique($classes));
    }

    private function normalizeColor(mixed $value): string
    {
        $color = trim((string) $value);

        if ($color === '') {
            return self::DEFAULT_COLOR;
        }

        return CssColor::from($color, 'sleeping_owl.datatables_settings.dt_autoupdate_color')->value();
    }
}
