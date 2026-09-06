<?php

use SleepingOwl\Admin\Assets\HtmlAttributes;
use SleepingOwl\Admin\Assets\MetaRenderer;

class MetaRendererTest extends TestCase
{
    public function test_it_renders_ordered_escaped_tags_and_replaces_stable_handles(): void
    {
        $meta = new MetaRenderer(new HtmlAttributes());
        $meta->title('Old title')
            ->description('Admin & tables')
            ->keywords(['admin', 'table'])
            ->meta(['name' => 'viewport', 'content' => 'width=device-width'])
            ->favicon('/favicon.svg', 'icon', 'image/svg+xml')
            ->title('New <title>');

        $rendered = $meta->render();

        $this->assertSame('<title>New &lt;title&gt;</title>', $meta->get('title'));
        $this->assertStringContainsString('content="Admin &amp; tables"', $rendered);
        $this->assertStringContainsString('content="admin, table"', $rendered);
        $this->assertStringContainsString('href="/favicon.svg"', $rendered);
        $this->assertLessThan(strpos($rendered, 'name="description"'), strpos($rendered, '<title>'));
    }
}
