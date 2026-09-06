<?php

use Illuminate\Config\Repository;
use SleepingOwl\Admin\Configuration\DataTablesAutoUpdateConfiguration;

class DataTablesAutoUpdateConfigurationTest extends TestCase
{
    public function test_it_preserves_configured_auto_update_values(): void
    {
        $configuration = $this->configuration([
            'dt_autoupdate' => true,
            'dt_autoupdate_class' => 'project-orders',
            'dt_autoupdate_color' => 'rgb(10 20 30 / 50%)',
            'dt_autoupdate_interval' => 2,
        ]);

        $this->assertTrue($configuration->enabled());
        $this->assertSame(2, $configuration->intervalMinutes());
        $this->assertSame(120000, $configuration->intervalMilliseconds());
        $this->assertSame('project-orders', $configuration->tableClass());
        $this->assertSame('.datatables.project-orders', $configuration->tableSelector());
        $this->assertSame('rgb(10 20 30 / 50%)', $configuration->color());
    }

    public function test_it_keeps_legacy_fallbacks_for_empty_values(): void
    {
        $configuration = $this->configuration([
            'dt_autoupdate' => false,
            'dt_autoupdate_class' => null,
            'dt_autoupdate_color' => '',
            'dt_autoupdate_interval' => 0,
        ]);

        $this->assertFalse($configuration->enabled());
        $this->assertSame(5, $configuration->intervalMinutes());
        $this->assertNull($configuration->tableClass());
        $this->assertSame('.datatables', $configuration->tableSelector());
        $this->assertSame('#dc3545', $configuration->color());
    }

    public function test_it_rejects_sub_minimum_intervals_with_the_documented_fallback(): void
    {
        $configuration = $this->configuration([
            'dt_autoupdate_interval' => -10,
        ]);

        $this->assertSame(5, $configuration->intervalMinutes());
    }

    public function test_it_rejects_an_unsafe_progress_color(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('[sleeping_owl.dt_autoupdate_color]');

        $this->configuration([
            'dt_autoupdate_color' => '#fff; } body { display: none',
        ]);
    }

    private function configuration(array $values): DataTablesAutoUpdateConfiguration
    {
        return new DataTablesAutoUpdateConfiguration(new Repository([
            'sleeping_owl' => $values,
        ]));
    }
}
