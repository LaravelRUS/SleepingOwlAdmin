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
        private string $profile = 'production',
        private ?AssetManifestRegistry $registry = null
    ) {
        $this->publicRoot = (new AssetManifestSource($manifest, $publicRoot))->publicRoot();
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
            [$bundle, $source] = $this->bundle($logicalId);
            $scripts = $this->append($scripts, $bundle->scripts(), $source);
            $styles = $this->append($styles, $bundle->styles(), $source);
        }

        return new ResolvedAssetBundle($scripts, $styles);
    }

    /**
     * @return array{AssetBundle, AssetManifestSource}
     */
    private function bundle(string $logicalId): array
    {
        try {
            $source = $this->source($logicalId);

            return [$source->manifest()->profile($this->profile)->bundle($logicalId), $source];
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
    private function append(array $urls, array $assets, AssetManifestSource $source): array
    {
        foreach ($assets as $asset) {
            $urls[] = $this->assetUrl($asset, $source);
        }

        return array_values(array_unique($urls));
    }

    private function assetUrl(ManifestAsset $asset, AssetManifestSource $source): string
    {
        $path = $source->publicRoot().'/'.$asset->file();

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

    private function source(string $logicalId): AssetManifestSource
    {
        return $this->registry?->find($this->profile, $logicalId)
            ?? new AssetManifestSource($this->manifest, $this->publicRoot);
    }
}
