<?php

use Mockery as m;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Templates\Breadcrumbs;
use SleepingOwl\Admin\Templates\TemplateDefault;

class TemplateAssetProfileContractTest extends TestCase
{
    private array $cssAssets = [];

    private array $jsAssets = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->usePublicPath(dirname(__DIR__, 3).'/public');
    }

    public function test_production_profile_uses_only_the_production_vue_bundle(): void
    {
        $this->initializeTemplate(false);

        $this->assertSame(
            ['admin-default', 'admin-vue-init', 'admin-modules-load'],
            array_column($this->jsAssets, 'handle')
        );
        $this->assertAssetMatches('/default/js/admin-app.js?id=', $this->jsAssets[0]['path']);
        $this->assertStringNotContainsString('admin-app-dev.js', $this->joinedJsPaths());
        $this->assertCommonEntries();
        $this->assertVueSourceProfile('app.js', 'vue-prod', 'vue-dev');
    }

    public function test_development_profile_uses_only_the_development_vue_bundle(): void
    {
        $this->initializeTemplate(true);

        $this->assertSame(
            ['admin-default', 'admin-vue-init', 'admin-modules-load'],
            array_column($this->jsAssets, 'handle')
        );
        $this->assertAssetMatches('/default/js/admin-app-dev.js?id=', $this->jsAssets[0]['path']);
        $this->assertStringNotContainsString('/admin-app.js?', $this->joinedJsPaths());
        $this->assertCommonEntries();
        $this->assertVueSourceProfile('app-dev.js', 'vue-dev', 'vue-prod');
    }

    private function initializeTemplate(bool $development): void
    {
        config()->set('sleeping_owl.dev_assets', $development);
        $template = new SourcePublishedTemplate(
            $this->app,
            m::mock(AdminInterface::class),
            $this->recordingMeta(),
            m::mock(NavigationInterface::class),
            m::mock(Breadcrumbs::class)
        );

        $template->initialize();
    }

    private function recordingMeta(): MetaInterface
    {
        $meta = m::mock(MetaInterface::class);
        $meta->shouldReceive('addJs')->andReturnUsing(function (string $handle, string $path) use ($meta) {
            $this->jsAssets[] = compact('handle', 'path');

            return $meta;
        });
        $meta->shouldReceive('addCss')->andReturnUsing(function (string $handle, string $path) use ($meta) {
            $this->cssAssets[] = compact('handle', 'path');

            return $meta;
        });

        return $meta;
    }

    private function assertCommonEntries(): void
    {
        $this->assertAssetMatches('/default/js/vue.js?id=', $this->jsAssets[1]['path']);
        $this->assertAssetMatches('/default/js/modules.js?id=', $this->jsAssets[2]['path']);
        $this->assertSame(['admin-default'], array_column($this->cssAssets, 'handle'));
        $this->assertAssetMatches('/default/css/admin-app.css?id=', $this->cssAssets[0]['path']);
    }

    private function assertVueSourceProfile(
        string $entry,
        string $requiredRuntime,
        string $forbiddenRuntime
    ): void {
        $source = file_get_contents(dirname(__DIR__, 3)."/resources/assets/js_owl/{$entry}");

        $this->assertStringContainsString("require('./libs/{$requiredRuntime}')", $source);
        $this->assertStringNotContainsString($forbiddenRuntime, $source);
    }

    private function assertAssetMatches(string $prefix, string $path): void
    {
        $this->assertStringStartsWith($prefix, $path);
        $this->assertMatchesRegularExpression('/\\?id=[a-f0-9]{32}$/', $path);
    }

    private function joinedJsPaths(): string
    {
        return implode('|', array_column($this->jsAssets, 'path'));
    }
}

class SourcePublishedTemplate extends TemplateDefault
{
    public function assetDir()
    {
        return 'default';
    }
}
