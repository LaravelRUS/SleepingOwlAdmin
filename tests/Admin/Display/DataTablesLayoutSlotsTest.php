<?php

use PHPUnit\Framework\Attributes\DataProvider;
use SleepingOwl\Admin\Display\DataTablesLayoutSlots;

class DataTablesLayoutSlotsTest extends TestCase
{
    #[DataProvider('validPlacements')]
    public function test_it_accepts_numbered_datatables_layout_placements(string $placement): void
    {
        $this->assertTrue(DataTablesLayoutSlots::isPlacement($placement));
    }

    public static function validPlacements(): iterable
    {
        yield ['datatable.top3'];
        yield ['datatable.top3Start'];
        yield ['datatable.top3End'];
        yield ['datatable.top4Start'];
        yield ['datatable.bottom3'];
        yield ['datatable.bottom4End'];
        yield ['datatable.top25Start'];
    }

    #[DataProvider('invalidPlacements')]
    public function test_it_rejects_malformed_datatables_layout_placements(string $placement): void
    {
        $this->assertFalse(DataTablesLayoutSlots::isPlacement($placement));
    }

    public static function invalidPlacements(): iterable
    {
        yield ['datatable.top'];
        yield ['datatable.top0Start'];
        yield ['datatable.top03Start'];
        yield ['datatable.middle3'];
        yield ['datatable.bottom4Middle'];
        yield ['datatable.top3start'];
        yield ['table.top3Start'];
    }

    public function test_it_separates_datatables_slots_from_regular_blade_sections(): void
    {
        $blocks = DataTablesLayoutSlots::split([
            'before.card' => ['before'],
            'datatable.top3Start' => ['first', 'second'],
            'datatable.bottom4End' => ['last'],
            'card.footer' => ['footer'],
        ]);

        $this->assertSame([
            'before.card' => ['before'],
            'card.footer' => ['footer'],
        ], $blocks['sections']);
        $this->assertSame([
            'top3Start' => ['first', 'second'],
            'bottom4End' => ['last'],
        ], $blocks['slots']);
    }

    public function test_it_fails_fast_for_an_invalid_datatables_namespace_placement(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage(
            'Invalid DataTables layout placement [datatable.top3Middle].'
        );

        DataTablesLayoutSlots::split([
            'datatable.top3Middle' => ['invalid'],
        ]);
    }

    public function test_layout_slot_host_keeps_table_scope_position_and_raw_block_html(): void
    {
        $html = view('sleeping_owl::features.datatables.layout-slots', [
            'attributesArray' => ['data-id' => 'orders-42'],
            'datatableLayoutSlots' => [
                'top3Start' => [
                    '<button data-slot-action>Run</button>',
                    '<span data-slot-label>Ready</span>',
                ],
            ],
        ])->render();

        $this->assertStringContainsString('data-admin-datatables-layout-slots', $html);
        $this->assertStringContainsString('data-datatables-id="orders-42"', $html);
        $this->assertStringContainsString(
            'data-admin-datatables-layout-slot="top3Start"',
            $html
        );
        $this->assertStringContainsString('<button data-slot-action>Run</button>', $html);
        $this->assertStringContainsString('<span data-slot-label>Ready</span>', $html);
        $this->assertStringNotContainsString('&lt;button', $html);
    }

    public function test_layout_slot_host_is_not_rendered_without_a_table_id(): void
    {
        $html = view('sleeping_owl::features.datatables.layout-slots', [
            'attributesArray' => [],
            'datatableLayoutSlots' => ['top3' => ['content']],
        ])->render();

        $this->assertSame('', trim($html));
    }
}
