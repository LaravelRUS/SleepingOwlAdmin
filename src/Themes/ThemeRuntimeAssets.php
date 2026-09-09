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

    private const REQUIRED_SHARED_ASSETS = ['shared:icons'];

    private const SHARED_UI = 'shared:ui';

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

        return $this->registrar->registerOrdered(
            $this->styleEntries($themeName, $theme),
            $this->scriptEntries($themeName, $theme),
            $aliases
        );
    }

    /**
     * @return list<string>
     */
    public function logicalEntries(string $themeName, ThemeInterface $theme): array
    {
        return array_values(array_unique([
            ...$this->styleEntries($themeName, $theme),
            ...$this->scriptEntries($themeName, $theme),
        ]));
    }

    /**
     * @return list<string>
     */
    public function styleEntries(string $themeName, ThemeInterface $theme): array
    {
        $manifest = ThemeAssetManifest::fromTheme($themeName, $theme);

        return $this->unique([
            'core',
            ...self::REQUIRED_SHARED_ASSETS,
            ...$this->sharedRuntimeEntries($manifest),
            self::SHARED_UI,
            self::FEATURE_RUNTIME,
            $manifest->themeEntry(),
            ...$manifest->featureEntries(),
            $manifest->overrideEntry(),
            ...$this->deferredEntries($manifest),
        ]);
    }

    /**
     * @return list<string>
     */
    public function scriptEntries(string $themeName, ThemeInterface $theme): array
    {
        $manifest = ThemeAssetManifest::fromTheme($themeName, $theme);

        return $this->unique([
            'core',
            ...self::REQUIRED_SHARED_ASSETS,
            ...$this->sharedRuntimeEntries($manifest),
            $manifest->themeEntry(),
            self::FEATURE_RUNTIME,
            ...$manifest->featureEntries(),
            $manifest->overrideEntry(),
            ...$this->deferredEntries($manifest),
        ]);
    }

    /**
     * @return list<string>
     */
    private function sharedRuntimeEntries(ThemeAssetManifest $manifest): array
    {
        return array_values(array_diff(
            $manifest->sharedEntries(),
            [...self::DEFERRED_ASSETS, self::FEATURE_RUNTIME, self::SHARED_UI]
        ));
    }

    /**
     * @return list<string>
     */
    private function deferredEntries(ThemeAssetManifest $manifest): array
    {
        return array_values(array_intersect(self::DEFERRED_ASSETS, $manifest->entriesFor([])));
    }

    /**
     * @param  list<?string>  $entries
     * @return list<string>
     */
    private function unique(array $entries): array
    {
        return array_values(array_unique(array_filter(
            $entries,
            static fn (?string $entry): bool => $entry !== null
        )));
    }
}
