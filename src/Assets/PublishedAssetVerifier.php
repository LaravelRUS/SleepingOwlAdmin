<?php

namespace SleepingOwl\Admin\Assets;

use Illuminate\Filesystem\Filesystem;
use InvalidArgumentException;
use SleepingOwl\Admin\Exceptions\AssetManifestException;

final class PublishedAssetVerifier
{
    public function __construct(
        private Filesystem $files,
        private AssetManifestLoader $loader,
        private AssetProfileSelector $profiles,
        private ComposerPackageVersion $packageVersion,
        private AssetVersionMatcher $versions
    ) {
    }

    public function verify(string $assetRoot): AssetPublicationReport
    {
        $assetRoot = rtrim($assetRoot, '/\\');
        $manifest = $this->loadManifest($assetRoot);

        return $this->verifyManifestProfile($assetRoot, $manifest, $this->profiles->selected());
    }

    /**
     * @return list<AssetPublicationReport>
     */
    public function verifyAll(string $assetRoot): array
    {
        $assetRoot = rtrim($assetRoot, '/\\');
        $manifest = $this->loadManifest($assetRoot);

        return array_map(
            fn (string $profile): AssetPublicationReport => $this->verifyManifestProfile(
                $assetRoot,
                $manifest,
                $profile
            ),
            [AssetProfileSelector::PRODUCTION, AssetProfileSelector::DEVELOPMENT]
        );
    }

    private function loadManifest(string $assetRoot): AssetManifest
    {
        $manifest = $this->loader->load($assetRoot.'/asset-manifest.json');
        $this->assertPackageVersion($manifest);

        return $manifest;
    }

    private function verifyManifestProfile(
        string $assetRoot,
        AssetManifest $manifest,
        string $profileId
    ): AssetPublicationReport {
        $fileCount = $this->verifyProfile($assetRoot, $this->profile($manifest, $profileId));

        return new AssetPublicationReport(
            $profileId,
            $manifest->packageVersion(),
            $manifest->buildId(),
            $fileCount
        );
    }

    private function assertPackageVersion(AssetManifest $manifest): void
    {
        $current = $this->packageVersion->current();
        if (! $this->versions->matches($current, $manifest->packageVersion())) {
            throw $this->failure(
                "manifest version [{$manifest->packageVersion()}] does not match installed version "
                ."[{$current}]"
            );
        }
    }

    private function profile(AssetManifest $manifest, string $profileId): AssetProfile
    {
        try {
            return $manifest->profile($profileId);
        } catch (InvalidArgumentException $exception) {
            throw $this->failure($exception->getMessage(), $exception);
        }
    }

    private function verifyProfile(string $assetRoot, AssetProfile $profile): int
    {
        $count = 0;

        foreach ($profile->entryIds() as $logicalId) {
            $bundle = $profile->bundle($logicalId);
            foreach ([...$bundle->scripts(), ...$bundle->styles()] as $asset) {
                $this->verifyAsset($assetRoot, $asset);
                $count++;
            }
        }

        return $count;
    }

    private function verifyAsset(string $assetRoot, ManifestAsset $asset): void
    {
        $path = $assetRoot.'/'.str_replace('/', DIRECTORY_SEPARATOR, $asset->file());

        if (! $this->files->isFile($path)) {
            throw $this->failure("published asset [{$asset->file()}] is missing");
        }

        if (hash_file('md5', $path) !== $asset->version()) {
            throw $this->failure("published asset [{$asset->file()}] has an invalid version hash");
        }

        if ('sha256:'.hash_file('sha256', $path) !== $asset->checksum()) {
            throw $this->failure("published asset [{$asset->file()}] has an invalid checksum");
        }
    }

    private function failure(
        string $reason,
        ?\Throwable $previous = null
    ): AssetManifestException {
        return new AssetManifestException(
            "Invalid SleepingOwl asset publication: {$reason}. "
            .'Run `php artisan sleepingowl:update` to republish the complete precompiled asset set.',
            0,
            $previous
        );
    }
}
