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
            'dt_autoupdate_interval' => 15,
        ]);

        $this->assertTrue($configuration->enabled());
        $this->assertSame(1, $configuration->intervalMinutes());
        $this->assertSame(15, $configuration->intervalSeconds());
        $this->assertSame(15000, $configuration->intervalMilliseconds());
        $this->assertSame('project-orders', $configuration->tableClass());
        $this->assertSame(['project-orders', 'autoupdate'], $configuration->tableClasses());
        $this->assertSame(
            '.datatables.project-orders, .datatables.autoupdate',
            $configuration->tableSelector()
        );
        $this->assertSame('rgb(10 20 30 / 50%)', $configuration->color());
    }

    public function test_it_accepts_named_progress_colors(): void
    {
        $configuration = $this->configuration([
            'dt_autoupdate_color' => 'black',
        ]);

        $this->assertSame('black', $configuration->color());
    }

    public function test_it_accepts_an_array_of_alternative_table_classes(): void
    {
        $configuration = $this->configuration([
            'dt_autoupdate_class' => ['project-orders', '.project-stock', 'project-orders'],
        ]);

        $this->assertSame(
            ['project-orders', 'project-stock', 'autoupdate'],
            $configuration->tableClasses()
        );
        $this->assertSame('project-orders', $configuration->tableClass());
        $this->assertSame(
            '.datatables.project-orders, .datatables.project-stock, .datatables.autoupdate',
            $configuration->tableSelector()
        );
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
        $this->assertSame(300, $configuration->intervalSeconds());
        $this->assertSame('autoupdate', $configuration->tableClass());
        $this->assertSame(['autoupdate'], $configuration->tableClasses());
        $this->assertSame('.datatables.autoupdate', $configuration->tableSelector());
        $this->assertSame('#dc3545', $configuration->color());
    }

    public function test_it_rejects_sub_minimum_intervals_with_the_documented_fallback(): void
    {
        $configuration = $this->configuration([
            'dt_autoupdate_interval' => -10,
        ]);

        $this->assertSame(300, $configuration->intervalSeconds());
    }

    public function test_it_rejects_an_unsafe_progress_color(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('[sleeping_owl.datatables_settings.dt_autoupdate_color]');

        $this->configuration([
            'dt_autoupdate_color' => '#fff; } body { display: none',
        ]);
    }

    public function test_it_rejects_non_string_class_items(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('[sleeping_owl.datatables_settings.dt_autoupdate_class]');

        $this->configuration([
            'dt_autoupdate_class' => ['orders', 10],
        ]);
    }

    private function configuration(array $values): DataTablesAutoUpdateConfiguration
    {
        return new DataTablesAutoUpdateConfiguration(new Repository([
            'sleeping_owl' => ['datatables_settings' => $values],
        ]));
    }
}
