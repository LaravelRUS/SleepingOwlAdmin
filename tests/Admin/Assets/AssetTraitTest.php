<?php

use SleepingOwl\Admin\Assets\AssetPackage;
use SleepingOwl\Admin\Traits\Assets;

class AssetTraitTest extends TestCase
{
    public function test_style_attributes_and_package_inclusion_use_first_party_services(): void
    {
        $owner = new class
        {
            use Assets;

            public function initializeAssets(): void
            {
                $this->initializePackage();
            }

            public function includeAssets(): void
            {
                $this->includePackage();
            }

            public function assetPackage(): AssetPackage
            {
                return $this->package;
            }
        };

        $owner->initializeAssets();
        $owner->addStyle('custom-style', 'custom.css', ['media' => 'print']);
        $owner->includeAssets();

        $style = $owner->assetPackage()->styles()[0];
        $this->assertSame([], $style->dependencies());
        $this->assertSame(['media' => 'print'], $style->attributes());
        $this->assertContains(
            $owner->assetPackage()->getName(),
            $this->app->make('assets')->loadedPackages()
        );
    }
}
