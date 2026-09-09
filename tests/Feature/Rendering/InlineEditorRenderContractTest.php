<?php

use PHPUnit\Framework\Attributes\DataProvider;

class InlineEditorRenderContractTest extends TestCase
{
    #[DataProvider('editorViews')]
    public function test_editor_variants_publish_the_native_contract(string $type): void
    {
        $html = $this->renderEditor($type);

        $this->assertStringContainsString('data-inline-editor="'.$type.'"', $html);
        $this->assertStringContainsString('data-name="status"', $html);
        $this->assertStringContainsString('data-pk="17"', $html);
        $this->assertStringContainsString('data-url="/admin/orders/async-inline"', $html);
        $this->assertStringContainsString('data-inline-editor-template-id="soa-inline-editor-template-', $html);
        $this->assertStringContainsString('data-inline-editor-template="'.$type.'"', $html);
        $this->assertStringContainsString('data-inline-editor-root', $html);
        $this->assertStringContainsString('data-inline-editor-form', $html);
        $this->assertStringContainsString('data-inline-editor-control', $html);
        if (in_array($type, ['boolean', 'checkbox'], true)) {
            $this->assertStringNotContainsString('data-inline-editor-clear', $html);
        } else {
            $this->assertStringContainsString('data-inline-editor-clear', $html);
        }
        $this->assertStringContainsString('data-inline-editor-cancel', $html);
        $this->assertStringContainsString('data-inline-editor-error', $html);
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
            '/data-inline-editor-options-id="(soa-inline-editor-options-[^"]+)"/',
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
        $this->assertStringContainsString('tabindex="-1"', $select);
        $this->assertStringContainsString('data-date-format="DD.MM.YYYY HH:mm"', $date);
        $this->assertStringNotContainsString('data-source=', $select);
        $this->assertStringNotContainsString('data-combodate=', $date);
    }

    public function test_readonly_column_renders_no_editor_host(): void
    {
        $html = $this->renderEditor('text', ['isReadonly' => true]);

        $this->assertStringNotContainsString('data-inline-editor', $html);
        $this->assertStringContainsString('<strong>Draft</strong>', $html);
    }

    public function test_required_column_renders_no_clear_control(): void
    {
        $html = $this->renderEditor('text', ['required' => true]);

        $this->assertStringNotContainsString('data-inline-editor-clear', $html);
    }

    public function test_empty_checklist_renders_no_clear_control(): void
    {
        $html = $this->renderEditor('checklist', ['value' => '']);

        $this->assertStringNotContainsString('data-inline-editor-clear', $html);
    }

    public function test_checklist_renders_localized_clear_all_action(): void
    {
        app()->setLocale('ru');

        $html = $this->renderEditor('checklist', [
            'limit' => 2,
            'maxLists' => 2,
            'text' => null,
            'value' => '1,2,3',
            'values' => ['Первый', 'Второй', 'Третий'],
        ]);

        $this->assertStringContainsString('class="soa-inline-editor-clear-all soa-button soa-button-ghost"', $html);
        $this->assertStringContainsString('>Очистить всё</button>', $html);
        $this->assertStringContainsString('class="badge table-badge soa-badge" v-pre>Первый</span>', $html);
        $this->assertStringContainsString('class="badge table-badge soa-badge" v-pre>Второй</span>', $html);
        $this->assertStringNotContainsString('v-pre>Третий</span>', $html);
        $this->assertStringContainsString('и еще 1', $html);
    }

    public function test_range_renders_synced_number_control_with_constraints(): void
    {
        $html = $this->renderEditor('range', ['required' => true]);

        $this->assertStringContainsString('data-inline-editor-range-number', $html);
        $this->assertStringContainsString('soa-inline-editor-range-number-wrap', $html);
        $this->assertMatchesRegularExpression(
            '/data-inline-editor-range-number[^>]+max="100"[^>]+min="0"[^>]+required[^>]+step="1"[^>]+type="number"/',
            $html
        );
    }

    public function test_developer_owned_editor_title_renders_as_html(): void
    {
        $html = $this->renderEditor('select', [
            'title' => '<i class="project-icon"></i> Status',
        ]);

        $this->assertStringContainsString('<i class="project-icon"></i> Status', $html);
        $this->assertStringNotContainsString('-title">&lt;i class=', $html);
    }

    #[DataProvider('editorControlMarkers')]
    public function test_each_editor_type_renders_its_control_in_blade(
        string $type,
        string $marker
    ): void {
        $this->assertStringContainsString($marker, $this->renderEditor($type));
    }

    public function test_project_can_override_editor_shell_and_one_control_partial(): void
    {
        view()->prependNamespace(
            'sleeping_owl',
            __DIR__.'/../../Fixtures/views/inline-editor-overrides'
        );

        $html = $this->renderEditor('text');

        $this->assertStringContainsString('class="project-editor-shell"', $html);
        $this->assertStringContainsString('class="project-editor-nesting"', $html);
        $this->assertStringContainsString('class="project-text-control"', $html);
        $this->assertStringContainsString('data-inline-editor-root', $html);
        $this->assertStringContainsString('data-inline-editor-control', $html);
        $this->assertStringNotContainsString('class="soa-inline-editor soa-inline-editor-popup"', $html);
    }

    public static function editorViews(): array
    {
        return [
            ['boolean'],
            ['checkbox'],
            ['checklist'],
            ['date'],
            ['datetime'],
            ['number'],
            ['range'],
            ['select'],
            ['text'],
            ['textarea'],
        ];
    }

    public static function editorControlMarkers(): array
    {
        return [
            ['boolean', 'data-inline-editor-check-input'],
            ['checkbox', 'data-inline-editor-check-input'],
            ['checklist', 'data-inline-editor-check-input'],
            ['date', 'data-date-control="date"'],
            ['datetime', 'data-date-control="datetime"'],
            ['number', 'type="number"'],
            ['range', 'data-inline-editor-range-input'],
            ['select', 'data-inline-editor-select'],
            ['text', 'type="text"'],
            ['textarea', '<textarea class="soa-inline-editor-control soa-input"'],
        ];
    }

    private function renderEditor(string $type, array $override = []): string
    {
        $logicalView = $type === 'checklist'
            ? 'column.editable.checklist'
            : 'column.editable.partials.editor';
        $data = array_replace($this->editorData(), $this->editorPresentation($type), $override);
        if ($type === 'select') {
            $data['editorTitle'] = $data['title'];
        }

        return view(
            'sleeping_owl::default.'.$logicalView,
            $data
        )->render();
    }

    private function editorPresentation(string $type): array
    {
        $presentation = ['editorType' => $type];

        if (in_array($type, ['boolean', 'checkbox'], true)) {
            return $presentation + [
                'editorControlType' => $type === 'boolean' ? 'checklist' : 'checkbox',
                'editorDisplayHtml' => true,
                'editorEmptyText' => '<i>None</i>',
                'editorOptions' => [['value' => 1, 'text' => 'Yes']],
                'editorTextHtml' => true,
            ];
        }

        if ($type === 'select') {
            return $presentation + [
                'editorEmptyText' => trans('sleeping_owl::lang.select.no_items'),
                'editorOptions' => [['value' => 1, 'text' => 'One & Two']],
                'editorTextHtml' => true,
                'editorTitle' => 'Status',
            ];
        }

        if (in_array($type, ['date', 'datetime'], true)) {
            return $presentation + ['editorDateFormat' => 'DD.MM.YYYY HH:mm'];
        }

        if ($type === 'textarea') {
            return $presentation + [
                'editorDisplayHtml' => false,
                'editorTextHtml' => false,
            ];
        }

        return $presentation;
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
