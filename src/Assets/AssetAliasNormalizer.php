<?php

namespace SleepingOwl\Admin\Assets;

use SleepingOwl\Admin\Facades\Assets;
use SleepingOwl\Admin\Facades\Meta;
use SleepingOwl\Admin\Facades\PackageManager;

final class AssetAliasNormalizer
{
    private const LEGACY_ALIASES = [
        'KodiCMS\Assets\Facades\Assets' => Assets::class,
        'KodiCMS\Assets\Facades\Meta' => Meta::class,
        'KodiCMS\Assets\Facades\PackageManager' => PackageManager::class,
    ];

    /**
     * @param  array<string, mixed>  $aliases
     * @return array<string, mixed>
     */
    public function normalize(array $aliases): array
    {
        foreach ($aliases as $name => $class) {
            if (is_string($class) && isset(self::LEGACY_ALIASES[$class])) {
                $aliases[$name] = self::LEGACY_ALIASES[$class];
            }
        }

        return $aliases;
    }
}
