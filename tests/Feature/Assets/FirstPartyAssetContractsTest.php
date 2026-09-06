<?php

use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Contracts\Template\AssetsInterface;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;

class FirstPartyAssetContractsTest extends TestCase
{
    public function test_asset_contract_has_no_vendor_parent_and_stays_narrow(): void
    {
        $this->assertNoKodiCmsParent(AssetsInterface::class);
        $this->assertSame([
            'addCss',
            'addJs',
            'clear',
            'loadPackage',
            'putGlobalVar',
            'render',
            'renderScripts',
            'renderStyles',
        ], $this->methodNames(AssetsInterface::class));
    }

    public function test_meta_contract_has_no_vendor_parent_and_stays_narrow(): void
    {
        $this->assertNoKodiCmsParent(MetaInterface::class);
        $this->assertSame([
            'addCss',
            'addJs',
            'addMeta',
            'assets',
            'loadPackage',
            'putGlobalVar',
            'render',
            'renderScripts',
            'setFavicon',
            'setMetaDescription',
            'setMetaKeywords',
            'setMetaRobots',
            'setTitle',
        ], $this->methodNames(MetaInterface::class));
    }

    public function test_container_exposes_first_party_contracts(): void
    {
        $this->assertTrue($this->app->bound(AssetManifestResolver::class));
        $this->assertSame(
            $this->app->make('assets'),
            $this->app->make(AssetsInterface::class)
        );
        $this->assertSame(
            $this->app->make('sleeping_owl.meta'),
            $this->app->make(MetaInterface::class)
        );
    }

    public function test_meta_explicitly_delegates_the_public_asset_api(): void
    {
        $meta = $this->app->make(MetaInterface::class);
        $assets = $this->app->make(AssetsInterface::class);
        $assets->clear();

        $this->assertSame($meta, $meta->addJs('contract-js', 'contract/app.js'));
        $this->assertSame($meta, $meta->addCss('contract-css', 'contract/app.css'));
        $this->assertSame($meta, $meta->putGlobalVar('contract', true));

        $this->assertStringContainsString('contract/app.css', $meta->render());
        $this->assertStringContainsString('contract/app.js', $meta->renderScripts(true));
    }

    /**
     * @param  class-string  $contract
     */
    private function assertNoKodiCmsParent(string $contract): void
    {
        $reflection = new \ReflectionClass($contract);
        $vendorParents = array_filter(
            $reflection->getInterfaceNames(),
            static fn (string $parent): bool => str_starts_with($parent, 'KodiCMS\\Assets\\')
        );

        $this->assertSame([], array_values($vendorParents));
    }

    /**
     * @param  class-string  $contract
     * @return list<string>
     */
    private function methodNames(string $contract): array
    {
        $reflection = new \ReflectionClass($contract);
        $methods = array_map(
            static fn (\ReflectionMethod $method): string => $method->getName(),
            $reflection->getMethods()
        );
        sort($methods);

        return $methods;
    }
}
