<?php

use SleepingOwl\Admin\Display\Column\Editable\Text;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Support\Display\EditableColumnResolver;

class EditableColumnResolverTest extends TestCase
{
    public function test_it_finds_a_direct_editable_column(): void
    {
        $column = new Text('status');
        $display = (new DisplayTable())->setColumns([$column]);

        $this->assertSame($column, (new EditableColumnResolver())->find($display, 'status'));
        $this->assertNull((new EditableColumnResolver())->find($display, 'missing'));
    }

    public function test_it_recurses_through_tabs_form_elements_and_columns(): void
    {
        $column = new Text('status');
        $table = (new DisplayTable())->setColumns([$column]);
        $formColumn = new Column([$table]);
        $elements = new FormElements([$formColumn]);
        $tabbed = new DisplayTabbed([new DisplayTab($elements, 'General')]);

        $this->assertSame($column, (new EditableColumnResolver())->find($tabbed, 'status'));
    }
}
