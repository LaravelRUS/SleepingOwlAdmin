<?php

use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\ExternalThemeAssets;

class ExternalThemeAssetsTest extends TestCase
{
    public function test_external_fragment_cannot_replace_core_entries(): void
    {
        $manifest = $this->manifest([
            'core' => $this->bundle('core'),
            'theme:external-contract' => $this->bundle('theme'),
        ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('must match theme [external-contract] assets');

        app(ExternalThemeAssets::class)->validate(
            'external-contract',
            new ExternalAssetContractTheme(),
            $manifest
        );
    }

    public function test_external_fragment_requires_both_ready_profiles(): void
    {
        $manifest = $this->manifest([
            'theme:external-contract' => $this->bundle('theme'),
        ], false);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('[development] profile');

        app(ExternalThemeAssets::class)->validate(
            'external-contract',
            new ExternalAssetContractTheme(),
            $manifest
        );
    }

    private function manifest(array $entries, bool $development = true): AssetManifest
    {
        $profiles = ['production' => ['entries' => $entries]];
        if ($development) {
            $profiles['development'] = ['entries' => $entries];
        }

        return AssetManifest::fromFragment([
            'schema_version' => 1,
            'package_version' => '1.0.0',
            'build_id' => 'sha256:'.str_repeat('a', 64),
            'profiles' => $profiles,
        ]);
    }

    private function bundle(string $name): array
    {
        return [
            'scripts' => [],
            'styles' => [[
                'file' => "css/{$name}.css",
                'version' => str_repeat('b', 32),
                'checksum' => 'sha256:'.str_repeat('c', 64),
            ]],
        ];
    }
}

final class ExternalAssetContractTheme implements ThemeInterface
{
    public function viewNamespace(): string
    {
        return 'external-contract::default';
    }

    public function assets(): array
    {
        return [];
    }

    public function icons(): array
    {
        return [];
    }

    public function capabilities(): array
    {
        return [];
    }
}
