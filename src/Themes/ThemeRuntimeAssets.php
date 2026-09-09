<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Assets\AssetManifestRegistry;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Assets\ResolvedAssetBundle;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeRuntimeAssets
{
    private const DEFERRED_ASSETS = ['shared:modules'];

    private const FEATURE_RUNTIME = 'shared:features';

    public function __construct(
        private LogicalAssetRegistrar $registrar,
        private AssetManifestRegistry $manifests
    ) {
    }

    /**
     * @param  array<string, string>  $aliases
     */
    public function register(string $themeName, ThemeInterface $theme, array $aliases = []): ResolvedAssetBundle
    {
        $this->manifests->select($themeName);

        return $this->registrar->register($this->logicalEntries($themeName, $theme), $aliases);
    }

    /**
     * @return list<string>
     */
    public function logicalEntries(string $themeName, ThemeInterface $theme): array
    {
        $manifest = ThemeAssetManifest::fromTheme($themeName, $theme);
        $base = array_values(array_diff(
            $manifest->entriesFor([]),
            [...self::DEFERRED_ASSETS, self::FEATURE_RUNTIME]
        ));

        return [
            'core',
            ...$base,
            ...$this->preloadedAdapters($manifest),
            self::FEATURE_RUNTIME,
            ...$this->deferredAdapters($manifest),
            ...$this->deferredEntries($manifest),
        ];
    }

    /**
     * @return list<string>
     */
    private function preloadedAdapters(ThemeAssetManifest $manifest): array
    {
        return array_values(array_filter(
            $this->themeAdapters($manifest),
            static fn (string $entry): bool => str_starts_with($entry, 'feature:table:')
        ));
    }

    /**
     * @return list<string>
     */
    private function deferredAdapters(ThemeAssetManifest $manifest): array
    {
        return array_values(array_filter(
            $this->themeAdapters($manifest),
            static fn (string $entry): bool => ! str_starts_with($entry, 'feature:table:')
        ));
    }

    /**
     * @return list<string>
     */
    private function themeAdapters(ThemeAssetManifest $manifest): array
    {
        return array_values(array_filter(
            $manifest->entries(),
            static fn (string $entry): bool => str_starts_with($entry, 'feature:')
        ));
    }

    /**
     * @return list<string>
     */
    private function deferredEntries(ThemeAssetManifest $manifest): array
    {
        return array_values(array_intersect(self::DEFERRED_ASSETS, $manifest->entriesFor([])));
    }
}
