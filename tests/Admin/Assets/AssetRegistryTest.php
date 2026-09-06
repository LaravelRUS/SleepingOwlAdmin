<?php

use SleepingOwl\Admin\Assets\Asset;
use SleepingOwl\Admin\Assets\AssetDependencySorter;
use SleepingOwl\Admin\Assets\AssetRegistry;

class AssetRegistryTest extends TestCase
{
    public function test_it_orders_dependencies_and_keeps_script_placements_separate(): void
    {
        $registry = $this->registry();
        $registry->register(Asset::script('feature', 'feature.js', 'core', false));
        $registry->register(Asset::script('footer', 'footer.js', null, true));
        $registry->register(Asset::script('core', 'core.js', null, false));

        $this->assertSame(['core', 'feature'], $this->handles($registry->scripts(false)));
        $this->assertSame(['footer'], $this->handles($registry->scripts(true)));
    }

    public function test_latest_handle_wins_without_dropping_unknown_or_circular_dependencies(): void
    {
        $registry = $this->registry();
        $registry->register(Asset::style('missing', 'missing.css', 'not-registered'));
        $registry->register(Asset::style('alpha', 'alpha.css', 'beta'));
        $registry->register(Asset::style('beta', 'beta.css', 'alpha'));
        $registry->register(Asset::style('missing', 'replacement.css'));

        $this->assertSame(
            ['replacement.css', 'alpha.css', 'beta.css'],
            array_map(static fn (Asset $asset): string => $asset->source(), $registry->styles())
        );
    }

    private function registry(): AssetRegistry
    {
        return new AssetRegistry(new AssetDependencySorter());
    }

    /**
     * @param  list<Asset>  $assets
     * @return list<string>
     */
    private function handles(array $assets): array
    {
        return array_map(static fn (Asset $asset): string => $asset->handle(), $assets);
    }
}
