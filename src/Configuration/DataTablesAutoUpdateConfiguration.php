<?php

namespace SleepingOwl\Admin\Configuration;

use Illuminate\Contracts\Config\Repository;
use SleepingOwl\Admin\Themes\CssColor;

final class DataTablesAutoUpdateConfiguration
{
    private const DEFAULT_COLOR = '#dc3545';

    private const DEFAULT_INTERVAL_MINUTES = 5;

    private bool $enabled;

    private int $intervalMinutes;

    private ?string $tableClass;

    private string $color;

    public function __construct(Repository $config)
    {
        $this->enabled = (bool) $config->get('sleeping_owl.datatables_settings.dt_autoupdate', false);
        $this->intervalMinutes = $this->normalizeInterval(
            $config->get('sleeping_owl.datatables_settings.dt_autoupdate_interval')
        );
        $this->tableClass = $this->normalizeClass(
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

    public function intervalMinutes(): int
    {
        return $this->intervalMinutes;
    }

    public function intervalMilliseconds(): int
    {
        return $this->intervalMinutes * 60 * 1000;
    }

    public function tableClass(): ?string
    {
        return $this->tableClass;
    }

    public function tableSelector(): string
    {
        return '.datatables'.($this->tableClass === null ? '' : '.'.$this->tableClass);
    }

    public function color(): string
    {
        return $this->color;
    }

    private function normalizeInterval(mixed $value): int
    {
        $minutes = (int) $value;

        return $minutes >= 1 ? $minutes : self::DEFAULT_INTERVAL_MINUTES;
    }

    private function normalizeClass(mixed $value): ?string
    {
        $class = trim((string) $value);

        return $class === '' ? null : $class;
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
