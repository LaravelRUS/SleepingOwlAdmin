<?php

class TreeRenderContractTest extends TestCase
{
    public function test_tree_view_publishes_native_behavior_and_safe_parameters(): void
    {
        $html = $this->renderTree();

        $this->assertStringContainsString('data-tree', $html);
        $this->assertStringContainsString('data-tree-root', $html);
        $this->assertStringContainsString('data-tree-item', $html);
        $this->assertStringContainsString('data-tree-handle', $html);
        $this->assertSame(2, substr_count($html, 'class="soa-tree-toggle"'));
        $this->assertSame(2, substr_count($html, 'data-tree-toggle-expanded'));
        $this->assertSame(2, substr_count($html, 'data-tree-toggle-collapsed'));
        $this->assertMatchesRegularExpression(
            '/<button[^>]+class="soa-tree-toggle"[^>]+data-tree-toggle[^>]+aria-expanded="false"/s',
            $html
        );
        $this->assertMatchesRegularExpression(
            '/<button[^>]+class="soa-tree-toggle"[^>]+data-tree-toggle[^>]+hidden/s',
            $html
        );
        $this->assertStringContainsString('data-reorderable="true"', $html);
        $this->assertStringContainsString('class="soa-tree pb-3 project-tree"', $html);
        $this->assertStringContainsString('data-project="catalog"', $html);
        $this->assertStringContainsString('type="application/json"', $html);
        $this->assertStringContainsString('value\u0027s \u0026 tags', $html);
        $this->assertStringNotContainsString('data-parameters=', $html);
        $this->assertStringNotContainsString('class="dd', $html);
        $this->assertStringNotContainsString('nestable', $html);
    }

    public function test_tree_view_renders_nested_and_empty_drop_lists_to_the_max_depth(): void
    {
        $html = $this->renderTree();

        $this->assertSame(3, substr_count($html, 'data-tree-list'));
        $this->assertStringContainsString('data-tree-collapsed="true"', $html);
        $this->assertMatchesRegularExpression(
            '/<ol class="soa-tree-list" data-tree-list\s+hidden/',
            $html
        );
    }

    private function renderTree(): string
    {
        $child = (object) [
            'children' => collect(),
            'id' => 2,
            'level' => 3,
            'title' => 'Child',
        ];
        $root = (object) [
            'children' => collect([$child]),
            'id' => 1,
            'level' => 2,
            'title' => 'Root',
        ];

        return view('sleeping_owl::default.display.tree', [
            'attributesArray' => ['class' => 'project-tree', 'data-project' => 'catalog'],
            'card_class' => 'card-tree',
            'collapsedLevel' => 2,
            'controls' => [],
            'creatable' => false,
            'createUrl' => '/admin/tree/create',
            'items' => collect([$root]),
            'max_depth' => 3,
            'newEntryButtonText' => 'Create',
            'parameters' => ['filter' => "value's & tags"],
            'reorderable' => true,
            'url' => '/admin/tree',
            'value' => 'title',
        ])->render();
    }
}
