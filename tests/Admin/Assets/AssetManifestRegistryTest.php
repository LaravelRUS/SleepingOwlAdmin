<?php

use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Assets\AssetManifestRegistry;

class AssetManifestRegistryTest extends TestCase
{
    public function test_external_sources_are_scoped_to_the_selected_theme_and_replaceable(): void
    {
        $registry = new AssetManifestRegistry();
        $registry->register('alpha', $this->manifest('shared:vendor'), 'vendor/alpha/first');
        $registry->register('beta', $this->manifest('shared:vendor'), 'vendor/beta');
        $registry->register('alpha', $this->manifest('shared:vendor'), 'vendor/alpha/final');

        $this->assertNull($registry->find('production', 'shared:vendor'));

        $registry->select('alpha');
        $this->assertSame(
            'vendor/alpha/final',
            $registry->find('production', 'shared:vendor')?->publicRoot()
        );

        $registry->select('beta');
        $this->assertSame(
            'vendor/beta',
            $registry->find('production', 'shared:vendor')?->publicRoot()
        );
    }

    private function manifest(string $logicalId): AssetManifest
    {
        return AssetManifest::fromFragment([
            'schema_version' => 1,
            'package_version' => '1.0.0',
            'build_id' => 'sha256:'.str_repeat('a', 64),
            'profiles' => [
                'production' => [
                    'entries' => [
                        $logicalId => [
                            'scripts' => [],
                            'styles' => [[
                                'file' => 'css/vendor.css',
                                'version' => str_repeat('b', 32),
                                'checksum' => 'sha256:'.str_repeat('c', 64),
                            ]],
                        ],
                    ],
                ],
            ],
        ]);
    }
}
