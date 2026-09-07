<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Templates\TemplateDefault;

final class AdminLTETheme extends TemplateDefault implements ThemeInterface
{
    private const FEATURE_ADAPTERS = [
        'dropdown',
        'lightbox',
        'sidebar',
        'table',
        'tabs',
        'tooltip',
        'tree',
    ];

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

    private const DEFERRED_ASSETS = ['shared:modules'];

    private const LEGACY_HANDLES = [
        'shared:vue' => 'admin-vue-init',
        'feature:tree:theme:legacy-adminlte' => 'admin-default',
        'shared:modules' => 'admin-modules-load',
    ];

    public function initialize(): void
    {
        $this->app->make(LogicalAssetRegistrar::class)->register(
            $this->runtimeAssets(),
            self::LEGACY_HANDLES
        );
    }

    public function id(): string
    {
        return 'legacy-adminlte';
    }

    public function viewNamespace(): string
    {
        return $this->getViewNamespace();
    }

    public function assets(): array
    {
        return [
            'shared:icons',
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:'.$this->id(),
            ...array_map(
                fn (string $feature): string => "feature:{$feature}:theme:{$this->id()}",
                self::FEATURE_ADAPTERS
            ),
        ];
    }

    public function icons(): array
    {
        return [];
    }

    public function capabilities(): array
    {
        return array_map(
            fn (ThemeCapability $capability): string => $capability->value,
            ThemeCapability::cases()
        );
    }

    /**
     * @return list<string>
     */
    private function runtimeAssets(): array
    {
        $manifest = ThemeAssetManifest::fromTheme($this);
        $base = array_values(array_diff($manifest->entriesFor([]), self::DEFERRED_ASSETS));
        $entries = ['core', ...$base];

        foreach (self::FEATURES as $feature) {
            if ($feature === 'table' && ($adapter = $manifest->featureEntry($feature))) {
                $entries[] = $adapter;
            }

            $entries[] = "feature:{$feature}";

            if ($feature !== 'table' && ($adapter = $manifest->featureEntry($feature))) {
                $entries[] = $adapter;
            }
        }

        return [...$entries, ...self::DEFERRED_ASSETS];
    }
}
