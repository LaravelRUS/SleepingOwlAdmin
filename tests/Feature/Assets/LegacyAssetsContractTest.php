<?php

use Illuminate\Support\HtmlString;
use SleepingOwl\Admin\Assets\AssetDependencySorter;
use SleepingOwl\Admin\Assets\AssetPackage as Package;
use SleepingOwl\Admin\Assets\AssetPackageRegistry as PackageManager;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Assets\AssetRenderer;
use SleepingOwl\Admin\Templates\Assets;
use SleepingOwl\Admin\Templates\Meta;

class LegacyAssetsContractTest extends TestCase
{
    public function test_provider_exposes_shared_asset_services(): void
    {
        $packages = $this->app->make('assets.packages');
        $assets = $this->app->make('assets');
        $meta = $this->app->make('sleeping_owl.meta');

        $this->assertInstanceOf(PackageManager::class, $packages);
        $this->assertInstanceOf(Assets::class, $assets);
        $this->assertInstanceOf(Meta::class, $meta);
        $this->assertSame($packages, $assets->packageManager());
        $this->assertSame($assets, $meta->assets());
        $this->assertSame($assets, $this->app->make('assets'));
    }

    public function test_javascript_preserves_handles_dependencies_attributes_and_placement(): void
    {
        $assets = $this->freshAssets();
        $base = $assets->addJs('contract-base', 'contract/base.js', [], false, [
            'defer' => 'defer',
            'data-context' => 'admin&table',
        ]);
        $feature = $assets->addJs(
            'contract-feature',
            'contract/feature.js',
            'contract-base',
            false,
            ['type' => 'module']
        );
        $assets->addJs('contract-footer', 'contract/footer.js');

        $this->assertSame('contract-base', $base->getHandle());
        $this->assertSame(['contract-base'], $feature->getDependency());
        $this->assertSame(['type' => 'module'], $feature->getAttributes());
        $this->assertFalse($feature->isFooter());
        $this->assertJavascriptPlacement($assets);
    }

    public function test_css_preserves_dependencies_attributes_and_order(): void
    {
        $assets = $this->freshAssets();
        $base = $assets->addCss('contract-base', 'contract/base.css');
        $theme = $assets->addCss(
            'contract-theme',
            'contract/theme.css',
            'contract-base',
            ['media' => 'print', 'data-theme' => 'admin&lte']
        );

        $rendered = $assets->renderStyles();

        $this->assertSame(['media' => 'all'], $base->getAttributes());
        $this->assertSame(['contract-base'], $theme->getDependency());
        $this->assertStringContainsString('media="all"', $rendered);
        $this->assertStringContainsString('data-theme="admin&amp;lte"', $rendered);
        $this->assertAppearsBefore('contract/base.css', 'contract/theme.css', $rendered);
    }

    public function test_stringable_sources_are_normalized_before_registration(): void
    {
        $assets = $this->freshAssets();

        $script = $assets->addJs('mix-script', new HtmlString('contract/mix.js'));
        $style = $assets->addCss('mix-style', new HtmlString('contract/mix.css'));

        $this->assertSame('contract/mix.js', $script->source());
        $this->assertSame('contract/mix.css', $style->source());
    }

    public function test_duplicate_asset_and_package_handles_use_the_latest_registration(): void
    {
        $manager = new PackageManager();
        $assets = $this->freshAssets($manager);

        $assets->addJs('duplicate-js', 'contract/first.js');
        $assets->addJs('duplicate-js', 'contract/second.js');
        $assets->addCss('duplicate-css', 'contract/first.css');
        $assets->addCss('duplicate-css', 'contract/second.css');

        $replacement = Package::create('duplicate-package');
        $manager->add('duplicate-package');
        $manager->add($replacement);

        $this->assertStringNotContainsString('contract/first.js', $assets->getJs('duplicate-js'));
        $this->assertStringContainsString('contract/second.js', $assets->getJs('duplicate-js'));
        $this->assertStringNotContainsString('contract/first.css', $assets->getCss('duplicate-css'));
        $this->assertStringContainsString('contract/second.css', $assets->getCss('duplicate-css'));
        $this->assertSame($replacement, $manager->load('duplicate-package'));
    }

    public function test_packages_load_dependencies_and_contribute_ordered_assets(): void
    {
        $manager = new PackageManager();
        $assets = $this->freshAssets($manager);

        $manager->add('contract-core')
            ->js(null, 'contract/package-core.js', null, false)
            ->css(null, 'contract/package-core.css');
        $manager->add('contract-feature')
            ->with('contract-core')
            ->js(null, 'contract/package-feature.js', 'contract-core', false)
            ->css(null, 'contract/package-feature.css', 'contract-core');

        $assets->loadPackage('contract-feature');

        $this->assertEqualsCanonicalizing(
            ['contract-core', 'contract-feature'],
            $assets->loadedPackages()
        );
        $this->assertAppearsBefore(
            'contract/package-core.css',
            'contract/package-feature.css',
            $assets->renderStyles()
        );
        $this->assertAppearsBefore(
            'contract/package-core.js',
            'contract/package-feature.js',
            $assets->renderScripts(false)
        );
    }

    public function test_meta_tags_are_registered_by_handle_and_rendered_in_order(): void
    {
        $meta = new Meta($this->freshAssets());

        $meta->setTitle('Contract title')
            ->setMetaDescription('Contract description')
            ->setMetaKeywords(['admin', 'table'])
            ->setMetaRobots('noindex, nofollow')
            ->addMeta(['name' => 'viewport', 'content' => 'width=device-width & safe'])
            ->setFavicon('/favicon.svg', 'icon', 'image/svg+xml');

        $rendered = $meta->render();

        $this->assertSame('<title>Contract title</title>', $meta->getGroup('meta', 'title'));
        $this->assertStringContainsString('content="width=device-width &amp; safe"', $rendered);
        $this->assertStringContainsString('href="/favicon.svg"', $rendered);
        $this->assertAppearsBefore('<title>', 'name="description"', $rendered);
        $this->assertAppearsBefore('name="description"', 'name="keywords"', $rendered);
    }

    public function test_global_config_is_shared_through_meta_and_overwrites_duplicate_keys(): void
    {
        $assets = $this->freshAssets();
        $meta = new Meta($assets);

        $this->assertSame($meta, $meta->putGlobalVar('locale', 'uk'));
        $meta->putGlobalVar('features', ['tables' => true]);
        $meta->putGlobalVar('locale', 'fr');

        $this->assertSame([
            'locale' => 'fr',
            'features' => ['tables' => true],
        ], $assets->globalVars());
        $this->assertSame(
            '<script>window.GlobalConfig = {"locale":"fr","features":{"tables":true}};</script>',
            (string) $assets->renderGlobalVars()
        );
    }

    private function freshAssets(?PackageManager $manager = null): Assets
    {
        return new Assets(
            $manager ?? new PackageManager(),
            new AssetRegistry(new AssetDependencySorter()),
            $this->app->make(AssetRenderer::class)
        );
    }

    private function assertJavascriptPlacement(Assets $assets): void
    {
        $head = $assets->renderScripts(false);
        $footer = $assets->renderScripts(true);

        $this->assertStringContainsString('data-context="admin&amp;table"', $head);
        $this->assertStringContainsString('type="module"', $head);
        $this->assertAppearsBefore('contract/base.js', 'contract/feature.js', $head);
        $this->assertStringNotContainsString('contract/footer.js', $head);
        $this->assertStringContainsString('contract/footer.js', $footer);
        $this->assertStringNotContainsString('contract/base.js', $footer);
    }

    private function assertAppearsBefore(string $first, string $second, string $content): void
    {
        $this->assertStringContainsString($first, $content);
        $this->assertStringContainsString($second, $content);
        $this->assertLessThan(strpos($content, $second), strpos($content, $first));
    }
}
