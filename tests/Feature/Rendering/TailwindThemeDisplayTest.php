<?php

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Display\Column\Text;
use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Themes\TailwindTheme;

class TailwindThemeDisplayTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', TailwindTheme::class);
    }

    public function test_every_display_and_column_view_is_owned_by_tailwind(): void
    {
        $legacyRoot = realpath(__DIR__.'/../../../resources/views/themes/adminlte/default');
        $tailwindRoot = realpath(__DIR__.'/../../../resources/views/themes/shadcn/default');
        $views = [];

        foreach (['display', 'column'] as $group) {
            $directory = new RecursiveDirectoryIterator(
                $legacyRoot.DIRECTORY_SEPARATOR.$group,
                FilesystemIterator::SKIP_DOTS
            );

            foreach (new RecursiveIteratorIterator($directory) as $file) {
                if (! str_ends_with($file->getFilename(), '.blade.php')) {
                    continue;
                }

                $relative = substr($file->getPathname(), strlen($legacyRoot) + 1);
                $logical = str_replace([DIRECTORY_SEPARATOR, '.blade.php'], ['.', ''], $relative);
                $resolved = view()->getFinder()->find(
                    app('sleeping_owl.template')->getViewPath($logical)
                );

                $this->assertSame(
                    realpath($tailwindRoot.DIRECTORY_SEPARATOR.$relative),
                    realpath($resolved),
                    $logical
                );
                $views[] = $logical;
            }
        }

        $this->assertCount(68, $views);
    }

    public function test_sync_table_keeps_data_and_attributes_with_tailwind_presentation(): void
    {
        $display = new DisplayTable();
        $display->setColumns([(new Text('name', 'Name'))->setWidth('12rem')]);
        $params = $display->getColumns()->toArray();
        $model = new class extends Model {};
        $model->forceFill(['name' => 'Ledger entry']);
        $params['attributesArray'] = [
            'aria-label' => 'Orders ledger',
            'class' => 'project-table',
            'data-contract' => 'orders',
        ];
        $params['collection'] = collect([$model]);
        $params['pagination'] = '<ol><li><a href="?page=2">2</a></li></ol>';

        $html = view(
            app('sleeping_owl.template')->getViewPath('display.extensions.columns'),
            $params
        )->render();

        $this->assertContainsAll($html, [
            'class="table soa-table project-table"',
            'aria-label="Orders ledger"',
            'data-contract="orders"',
            '<col width="12rem"/>',
            '<th',
            'Name',
            '<td v-pre>',
            'Ledger entry',
            '<nav class="soa-pagination"',
            '<a href="?page=2">2</a>',
        ]);
    }

    public function test_bulk_actions_preserve_names_hooks_and_user_attributes(): void
    {
        $action = new class
        {
            public function render(): string
            {
                return '<option data-method="delete" value="archive">Archive</option>';
            }
        };

        $html = view(
            app('sleeping_owl.template')->getViewPath('display.extensions.actions'),
            [
                'actions' => [$action],
                'attributesArray' => [
                    'aria-label' => 'Bulk actions',
                    'class' => 'project-actions',
                    'data-contract' => 'actions',
                ],
                'placement' => 'card.footer',
            ]
        )->render();

        $this->assertContainsAll($html, [
            'class="soa-bulk-actions card-footer project-actions"',
            'aria-label="Bulk actions"',
            'data-contract="actions"',
            'id="action_form"',
            'class="form-control sleepingOwlActionsStore soa-select"',
            'id="sleepingOwlActionsStore"',
            'name="action"',
            'data-method="delete"',
            'class="row-action btn btn-action btn-light soa-button soa-button-secondary"',
            'data-method="post"',
        ]);
    }

    public function test_selection_filter_and_inline_editor_keep_behavior_contracts(): void
    {
        $checkbox = view(
            app('sleeping_owl.template')->getViewPath('column.checkbox'),
            [
                'append' => '',
                'attributesArray' => ['data-row' => '42'],
                'small' => '',
                'value' => 42,
                'visibled' => true,
            ]
        )->render();
        $filter = view(
            app('sleeping_owl.template')->getViewPath('column.filter.text'),
            [
                'attributesArray' => ['aria-label' => 'Filter orders', 'data-filter' => 'name'],
                'helpText' => 'Exact or partial name',
                'visibled' => true,
                'width' => '',
            ]
        )->render();
        $editor = view(
            app('sleeping_owl.template')->getViewPath('column.editable.partials.editor_template'),
            [
                'editorCanClear' => true,
                'editorControlId' => 'status-control',
                'editorTemplateId' => 'status-template',
                'editorTitle' => 'Status',
                'editorTitleId' => 'status-title',
                'editorType' => 'text',
                'mode' => 'popup',
                'name' => 'status',
                'required' => true,
                'value' => 'draft',
            ]
        )->render();

        $this->assertContainsAll($checkbox, [
            'class="adminCheckboxRow soa-checkbox"',
            'name="_id[]"',
            'value="42"',
            'data-row="42"',
        ]);
        $this->assertContainsAll($filter, [
            'class="form-control soa-input"',
            'aria-label="Filter orders"',
            'data-filter="name"',
            'Exact or partial name',
        ]);
        $this->assertContainsAll($editor, [
            '<dialog class="soa-inline-editor soa-inline-editor-popup soa-inline-editor-type-text"',
            'data-inline-editor-root',
            'aria-modal="true"',
            'class="soa-inline-editor-control soa-input"',
            'name="status"',
            'required',
            'data-inline-editor-submit',
            'data-inline-editor-cancel',
            'data-inline-editor-error',
        ]);
    }

    private function assertContainsAll(string $html, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $html);
        }
    }
}
