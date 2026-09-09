<?php

use Illuminate\Config\Repository;
use SleepingOwl\Admin\Configuration\DataTablesAutoUpdateConfiguration;

class DataTablesAutoUpdateConfigurationTest extends TestCase
{
    public function test_it_keeps_interval_and_color_bound_to_each_table_class(): void
    {
        $configuration = $this->configuration([
            'project-orders' => [
                'color' => 'rgb(10 20 30 / 50%)',
                'interval' => 15,
            ],
            'project-stock' => [
                'color' => 'black',
                'interval' => 60,
            ],
        ]);

        $this->assertTrue($configuration->enabled());
        $this->assertSame([
            [
                'class' => 'project-orders',
                'interval' => 15,
                'interval_ms' => 15000,
                'color' => 'rgb(10 20 30 / 50%)',
            ],
            [
                'class' => 'project-stock',
                'interval' => 60,
                'interval_ms' => 60000,
                'color' => 'black',
            ],
        ], $configuration->profiles());
    }

    public function test_an_empty_profile_map_disables_auto_update(): void
    {
        $configuration = $this->configuration([]);

        $this->assertFalse($configuration->enabled());
        $this->assertSame([], $configuration->profiles());
    }

    public function test_profile_values_have_safe_defaults(): void
    {
        $configuration = $this->configuration([
            'autoupdate' => [
                'color' => '',
                'interval' => 0,
            ],
        ]);

        $this->assertSame([[
            'class' => 'autoupdate',
            'interval' => 300,
            'interval_ms' => 300000,
            'color' => '#dc3545',
        ]], $configuration->profiles());
    }

    public function test_it_rejects_an_unsafe_progress_color(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage(
            '[sleeping_owl.datatables_settings.autoupdate.orders.color]'
        );

        $this->configuration([
            'orders' => ['color' => '#fff; } body { display: none'],
        ]);
    }

    public function test_it_rejects_invalid_profile_class_names(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('keys must be valid CSS class names');

        $this->configuration([
            'orders table' => ['interval' => 30],
        ]);
    }

    private function configuration(array $profiles): DataTablesAutoUpdateConfiguration
    {
        return new DataTablesAutoUpdateConfiguration(new Repository([
            'sleeping_owl' => [
                'datatables_settings' => ['autoupdate' => $profiles],
            ],
        ]));
    }
}
