<?php

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Display\Column\Text;
use SleepingOwl\Admin\Display\DisplayDatatables;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Display\DisplayTable;

class ColumnVisibilityRenderTest extends TestCase
{
    public function test_plain_table_hides_the_whole_column_and_matching_footer_cells(): void
    {
        $display = new DisplayTable();
        $calls = 0;
        $hidden = (new Text('secret', 'Secret heading'))->setVisible(function ($column) use (&$calls) {
            $this->assertInstanceOf(Text::class, $column);
            $calls++;

            return false;
        });
        $display->setColumns([$hidden, new Text('name', 'Name heading')]);
        $display->getColumnFilters()->set([null, null]);
        $display->getColumnsTotal()->set(['Secret total', 'Name total']);

        $params = $display->getColumns()->toArray();
        $params['collection'] = collect([1, 2])->map(function ($id) {
            $model = new class extends Model {};
            $model->forceFill(['name' => 'Name '.$id, 'secret' => 'Secret '.$id]);

            return $model;
        });
        $params['pagination'] = null;
        $html = view('sleeping_owl::default.display.extensions.columns', $params)->render();

        $this->assertStringNotContainsString('Secret', $html);
        $this->assertStringContainsString('Name heading', $html);
        $this->assertStringContainsString('Name 1', $html);
        $this->assertStringContainsString('Name 2', $html);
        $this->assertSame([1], $display->getColumnFilters()->toArray()['filters']->keys()->all());
        $this->assertSame([1], $display->getColumnsTotal()->toArray()['elements']->keys()->all());
        $this->assertSame(1, $calls);
    }

    public function test_datatables_preserve_hidden_column_positions(): void
    {
        foreach ([new DisplayDatatables(), new DisplayDatatablesAsync()] as $display) {
            $display->setColumns([
                (new Text('secret', 'Secret heading'))->setVisible(false),
                new Text('name', 'Name heading'),
            ]);
            $display->getColumnFilters()->set([null, null]);
            $display->getColumnsTotal()->set(['Secret total', 'Name total']);
            $params = $display->getColumns()->toArray();
            $this->assertCount(2, $params['columns']);
            $this->assertCount(2, $display->getColumnFilters()->toArray()['filters']);
            $this->assertCount(2, $display->getColumnsTotal()->toArray()['elements']);

            $html = view('sleeping_owl::default.display.extensions.columns_async', $params)->render();
            $this->assertSame(2, substr_count($html, '<col width='));
            $this->assertSame(2, substr_count($html, '<th '));
        }
    }
}
