<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;

final class AssetBundle
{
    /**
     * @param  list<ManifestAsset>  $scripts
     * @param  list<ManifestAsset>  $styles
     */
    private function __construct(
        private array $scripts,
        private array $styles
    ) {
    }

    public static function fromArray(mixed $bundle): self
    {
        if (! is_array($bundle)) {
            throw new InvalidArgumentException('Manifest bundle must be an object.');
        }

        $scripts = self::assets($bundle['scripts'] ?? null, 'js');
        $styles = self::assets($bundle['styles'] ?? null, 'css');

        if ($scripts === [] && $styles === []) {
            throw new InvalidArgumentException('Manifest bundle cannot be empty.');
        }

        return new self($scripts, $styles);
    }

    /**
     * @return list<ManifestAsset>
     */
    public function scripts(): array
    {
        return $this->scripts;
    }

    /**
     * @return list<ManifestAsset>
     */
    public function styles(): array
    {
        return $this->styles;
    }

    /**
     * @return list<ManifestAsset>
     */
    private static function assets(mixed $assets, string $extension): array
    {
        if (! is_array($assets) || ! array_is_list($assets)) {
            throw new InvalidArgumentException('Manifest asset collection must be a list.');
        }

        return array_map(
            static fn (mixed $asset): ManifestAsset => ManifestAsset::fromArray($asset, $extension),
            $assets
        );
    }
}
