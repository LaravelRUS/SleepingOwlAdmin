<?php

use Illuminate\Contracts\Routing\UrlGenerator;
use SleepingOwl\Admin\Assets\Asset;
use SleepingOwl\Admin\Assets\AssetRenderer;
use SleepingOwl\Admin\Assets\HtmlAttributes;

class AssetRendererTest extends TestCase
{
    public function test_it_renders_escaped_script_and_style_attributes(): void
    {
        $renderer = new AssetRenderer($this->urlGenerator(), new HtmlAttributes());

        $script = $renderer->render(Asset::script(
            'module',
            'js/module.js',
            null,
            false,
            ['type' => 'module', 'data-context' => 'admin&table']
        ));
        $style = $renderer->render(Asset::style('theme', 'css/theme.css'));

        $this->assertSame(
            '<script type="module" data-context="admin&amp;table" src="https://cdn.test/js/module.js"></script>',
            $script
        );
        $this->assertSame(
            '<link media="all" type="text/css" rel="stylesheet" href="https://cdn.test/css/theme.css">',
            $style
        );
    }

    private function urlGenerator(): UrlGenerator
    {
        $url = Mockery::mock(UrlGenerator::class);
        $url->shouldReceive('asset')->andReturnUsing(
            static fn (string $path): string => 'https://cdn.test/'.$path
        );

        return $url;
    }
}
