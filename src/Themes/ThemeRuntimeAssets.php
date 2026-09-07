<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Assets\AssetManifestRegistry;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Assets\ResolvedAssetBundle;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeRuntimeAssets
{
    private const DEFERRED_ASSETS = ['shared:modules'];

    private const FEATURES = [
        'alert',
        'tooltip',
        'dropdown',
        'sidebar',
        'lightbox',
        'table',
        'tabs',
        'forms',
        'tree',
    ];

    private const PRELOADED_ADAPTERS = ['table'];

    public function __construct(
        private LogicalAssetRegistrar $registrar,
        private AssetManifestRegistry $manifests
    ) {
    }

    /**
     * @param  array<string, string>  $aliases
     */
    public function register(ThemeInterface $theme, array $aliases = []): ResolvedAssetBundle
    {
        $this->manifests->select($theme->id());

        return $this->registrar->register($this->logicalEntries($theme), $aliases);
    }

    /**
     * @return list<string>
     */
    public function logicalEntries(ThemeInterface $theme): array
    {
        $manifest = ThemeAssetManifest::fromTheme($theme);
        $base = array_values(array_diff($manifest->entriesFor([]), self::DEFERRED_ASSETS));
        $entries = ['core', ...$base];

        foreach (self::FEATURES as $feature) {
            $this->appendFeature($entries, $manifest, $feature);
        }

        return [...$entries, ...$this->deferredEntries($manifest)];
    }

    /**
     * @param  list<string>  $entries
     */
    private function appendFeature(array &$entries, ThemeAssetManifest $manifest, string $feature): void
    {
        $adapter = $manifest->featureEntry($feature);

        if ($adapter !== null && in_array($feature, self::PRELOADED_ADAPTERS, true)) {
            $entries[] = $adapter;
        }

        $entries[] = "feature:{$feature}";

        if ($adapter !== null && ! in_array($feature, self::PRELOADED_ADAPTERS, true)) {
            $entries[] = $adapter;
        }
    }

    /**
     * @return list<string>
     */
    private function deferredEntries(ThemeAssetManifest $manifest): array
    {
        return array_values(array_intersect(self::DEFERRED_ASSETS, $manifest->entriesFor([])));
    }
}
