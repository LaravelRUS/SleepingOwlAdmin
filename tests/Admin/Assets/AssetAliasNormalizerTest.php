<?php

use SleepingOwl\Admin\Assets\AssetAliasNormalizer;
use SleepingOwl\Admin\Facades\Assets;
use SleepingOwl\Admin\Facades\Meta;
use SleepingOwl\Admin\Facades\PackageManager;

class AssetAliasNormalizerTest extends TestCase
{
    public function test_it_replaces_only_exact_legacy_asset_facades(): void
    {
        $aliases = (new AssetAliasNormalizer())->normalize([
            'Assets' => 'KodiCMS\Assets\Facades\Assets',
            'Meta' => 'KodiCMS\Assets\Facades\Meta',
            'PackageManager' => 'KodiCMS\Assets\Facades\PackageManager',
            'CustomAssets' => 'App\Facades\Assets',
            'Unrelated' => stdClass::class,
        ]);

        $this->assertSame(Assets::class, $aliases['Assets']);
        $this->assertSame(Meta::class, $aliases['Meta']);
        $this->assertSame(PackageManager::class, $aliases['PackageManager']);
        $this->assertSame('App\Facades\Assets', $aliases['CustomAssets']);
        $this->assertSame(stdClass::class, $aliases['Unrelated']);
    }

    public function test_first_party_aliases_are_idempotent(): void
    {
        $aliases = ['Assets' => Assets::class, 'Meta' => Meta::class];

        $this->assertSame($aliases, (new AssetAliasNormalizer())->normalize($aliases));
    }
}
