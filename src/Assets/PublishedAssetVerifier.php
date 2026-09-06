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
        private ComposerPackageVersion $packageVersion
    ) {
    }

    public function verify(string $assetRoot): AssetPublicationReport
    {
        $assetRoot = rtrim($assetRoot, '/\\');
        $manifest = $this->loader->load($assetRoot.'/asset-manifest.json');
        $this->assertPackageVersion($manifest);

        $profileId = $this->profiles->selected();
        $profile = $this->profile($manifest, $profileId);
        $fileCount = $this->verifyProfile($assetRoot, $profile);

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
        $installed = $this->normalizeVersion($current);
        $published = $this->normalizeVersion($manifest->packageVersion());

        if (! $this->versionsMatch($installed, $published)) {
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

    private function normalizeVersion(string $version): string
    {
        return ltrim(trim($version), 'v');
    }

    private function versionsMatch(string $installed, string $published): bool
    {
        return $installed === $published
            || (str_starts_with($installed, 'dev-') && str_starts_with($published, 'dev-'));
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
