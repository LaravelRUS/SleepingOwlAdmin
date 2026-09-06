<?php

namespace SleepingOwl\Admin\Assets;

use Illuminate\Contracts\Routing\UrlGenerator;
use InvalidArgumentException;
use SleepingOwl\Admin\Exceptions\AssetManifestException;

final class AssetManifestResolver
{
    public function __construct(
        private AssetManifest $manifest,
        private UrlGenerator $url,
        private string $publicRoot,
        private string $profile = 'production'
    ) {
        $this->publicRoot = $this->normalizePublicRoot($publicRoot);
    }

    public function resolve(string $logicalId): ResolvedAssetBundle
    {
        return $this->resolveMany([$logicalId]);
    }

    /**
     * @param  list<string>  $logicalIds
     */
    public function resolveMany(array $logicalIds): ResolvedAssetBundle
    {
        $scripts = [];
        $styles = [];

        foreach ($this->uniqueLogicalIds($logicalIds) as $logicalId) {
            $bundle = $this->bundle($logicalId);
            $scripts = $this->append($scripts, $bundle->scripts());
            $styles = $this->append($styles, $bundle->styles());
        }

        return new ResolvedAssetBundle($scripts, $styles);
    }

    private function bundle(string $logicalId): AssetBundle
    {
        try {
            return $this->manifest->profile($this->profile)->bundle($logicalId);
        } catch (InvalidArgumentException $exception) {
            throw new AssetManifestException(
                $exception->getMessage().' Run `php artisan sleepingowl:update` '
                .'to publish a compatible asset manifest.',
                0,
                $exception
            );
        }
    }

    /**
     * @param  list<string>  $urls
     * @param  list<ManifestAsset>  $assets
     * @return list<string>
     */
    private function append(array $urls, array $assets): array
    {
        foreach ($assets as $asset) {
            $urls[] = $this->assetUrl($asset);
        }

        return array_values(array_unique($urls));
    }

    private function assetUrl(ManifestAsset $asset): string
    {
        $path = $this->publicRoot.'/'.$asset->file();

        return $this->url->asset($path).'?id='.$asset->version();
    }

    /**
     * @param  list<string>  $logicalIds
     * @return list<string>
     */
    private function uniqueLogicalIds(array $logicalIds): array
    {
        $unique = [];
        foreach ($logicalIds as $logicalId) {
            if (! is_string($logicalId)) {
                throw new AssetManifestException('Asset manifest logical ids must be strings.');
            }

            $unique[$logicalId] = $logicalId;
        }

        return array_values($unique);
    }

    private function normalizePublicRoot(string $publicRoot): string
    {
        $publicRoot = trim($publicRoot, '/');
        if ($publicRoot === '' || str_contains($publicRoot, '..') || str_contains($publicRoot, '\\')) {
            throw new InvalidArgumentException('Asset public root must be a relative URL path.');
        }

        return $publicRoot;
    }
}
