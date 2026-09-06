<?php

use SleepingOwl\Admin\Assets\AssetPackage;
use SleepingOwl\Admin\Assets\AssetPackageRegistry;

class AssetPackageRegistryTest extends TestCase
{
    public function test_it_resolves_package_dependencies_before_the_requested_package(): void
    {
        $registry = new AssetPackageRegistry();
        $registry->add('core')->js(null, 'core.js')->css(null, 'core.css');
        $feature = $registry->add('feature')
            ->with('core', 'optional')
            ->js(null, 'feature.js', 'core');

        $this->assertSame(
            ['core', 'feature'],
            array_map(
                static fn (AssetPackage $package): string => $package->getName(),
                $registry->resolve('feature')
            )
        );
        $this->assertSame(['core', 'optional'], $feature->getDependencies());
        $this->assertSame('feature', $feature->scripts()[0]->handle());
    }

    public function test_latest_registration_wins_and_unknown_packages_are_ignored(): void
    {
        $registry = new AssetPackageRegistry();
        $registry->add('replace');
        $replacement = AssetPackage::create('replace');
        $registry->add($replacement);

        $this->assertSame($replacement, $registry->load('replace'));
        $this->assertSame([], $registry->resolve('unknown'));
    }
}
