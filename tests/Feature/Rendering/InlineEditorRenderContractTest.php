<?php

use PHPUnit\Framework\Attributes\DataProvider;

class InlineEditorRenderContractTest extends TestCase
{
    #[DataProvider('editorViews')]
    public function test_editable_views_publish_the_native_contract(string $view, string $type): void
    {
        $html = $this->renderEditor($view);

        $this->assertStringContainsString('data-soa-inline-editor="'.$type.'"', $html);
        $this->assertStringContainsString('data-name="status"', $html);
        $this->assertStringContainsString('data-pk="17"', $html);
        $this->assertStringContainsString('data-url="/admin/orders/async-inline"', $html);
        $this->assertStringContainsString('class="project-column"', $html);
        $this->assertStringContainsString('data-project="orders"', $html);
        $this->assertStringNotContainsString('class="inline-editable"', $html);
        $this->assertStringNotContainsString('class="dt-editable"', $html);
        $this->assertStringNotContainsString('class="dat-editable"', $html);
    }

    public function test_select_options_and_date_format_are_json_safe(): void
    {
        $select = $this->renderEditor('select');
        $date = $this->renderEditor('datetime');

        $this->assertMatchesRegularExpression(
            '/data-soa-inline-editor-options-id="(soa-inline-editor-options-[^"]+)"/',
            $select
        );
        $this->assertStringContainsString(
            '<script id="soa-inline-editor-options-',
            $select
        );
        $this->assertStringContainsString(
            '[{"value":1,"text":"One \u0026 Two"}]',
            $select
        );
        $this->assertStringNotContainsString('data-options=', $select);
        $this->assertStringContainsString('data-date-format="DD.MM.YYYY HH:mm"', $date);
        $this->assertStringNotContainsString('data-source=', $select);
        $this->assertStringNotContainsString('data-combodate=', $date);
    }

    public function test_readonly_column_renders_no_editor_host(): void
    {
        $html = $this->renderEditor('text', ['isReadonly' => true]);

        $this->assertStringNotContainsString('data-soa-inline-editor', $html);
        $this->assertStringContainsString('<strong>Draft</strong>', $html);
    }

    public static function editorViews(): array
    {
        return [
            ['checkbox', 'checkbox'],
            ['checklist', 'checklist'],
            ['date', 'date'],
            ['datetime', 'datetime'],
            ['number', 'number'],
            ['range', 'range'],
            ['select', 'select'],
            ['text', 'text'],
            ['textarea', 'textarea'],
        ];
    }

    private function renderEditor(string $view, array $override = []): string
    {
        return view(
            'sleeping_owl::default.column.editable.'.$view,
            array_replace($this->editorData(), $override)
        )->render();
    }

    private function editorData(): array
    {
        return [
            'append' => '',
            'attributesArray' => ['class' => 'project-column', 'data-project' => 'orders'],
            'checkedLabel' => 'Yes',
            'format' => 'DD.MM.YYYY HH:mm',
            'id' => 17,
            'isReadonly' => false,
            'max' => 100,
            'min' => 0,
            'mode' => 'popup',
            'name' => 'status',
            'options' => [['value' => 1, 'text' => 'One & Two']],
            'small' => null,
            'step' => 1,
            'text' => '<strong>Draft</strong>',
            'title' => 'Status',
            'uncheckedLabel' => '<i>None</i>',
            'url' => '/admin/orders/async-inline',
            'value' => 'draft',
            'visibled' => true,
        ];
    }
}
