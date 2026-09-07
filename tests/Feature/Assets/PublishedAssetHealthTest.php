<?php

use PHPUnit\Framework\Attributes\DataProvider;
use SleepingOwl\Admin\Assets\AssetHealthStatus;
use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Assets\AssetVersionMatcher;
use SleepingOwl\Admin\Assets\ComposerPackageVersion;
use SleepingOwl\Admin\Assets\PublishedAssetHealth;

class PublishedAssetHealthTest extends TestCase
{
    public function test_matching_publication_has_no_health_status(): void
    {
        $health = $this->health($this->installedVersion());

        $this->assertNull($health->status());
    }

    public function test_mismatch_exposes_versions_and_exact_update_command(): void
    {
        $installed = $this->installedVersion();
        $health = $this->health('0.0.0-mismatch');
        $status = $health->status();

        $this->assertInstanceOf(AssetHealthStatus::class, $status);
        $this->assertSame($installed, $status->installedVersion());
        $this->assertSame('0.0.0-mismatch', $status->publishedVersion());
        $this->assertSame('php artisan sleepingowl:update', $status->updateCommand());
        $this->assertSame($status, $health->status());
    }

    #[DataProvider('versionMatches')]
    public function test_version_matching_is_shared_with_publication_verification(
        string $installed,
        string $published,
        bool $matches
    ): void {
        $this->assertSame(
            $matches,
            $this->app->make(AssetVersionMatcher::class)->matches($installed, $published)
        );
    }

    public function test_health_service_is_scoped_to_one_request(): void
    {
        $first = $this->app->make(PublishedAssetHealth::class);

        $this->assertSame($first, $this->app->make(PublishedAssetHealth::class));

        $this->app->forgetScopedInstances();

        $this->assertNotSame($first, $this->app->make(PublishedAssetHealth::class));
    }

    public static function versionMatches(): iterable
    {
        yield 'same release' => ['12.1.0', '12.1.0', true];
        yield 'release tag prefix' => ['v12.1.0', '12.1.0', true];
        yield 'different development branches' => ['dev-main', 'dev-feature', true];
        yield 'different releases' => ['12.1.0', '12.0.0', false];
        yield 'development and release' => ['dev-main', '12.1.0', false];
    }

    private function health(string $publishedVersion): PublishedAssetHealth
    {
        return new PublishedAssetHealth(
            $this->manifest($publishedVersion),
            $this->app->make(ComposerPackageVersion::class),
            $this->app->make(AssetVersionMatcher::class)
        );
    }

    private function manifest(string $packageVersion): AssetManifest
    {
        $path = dirname(__DIR__, 3).'/public/default/asset-manifest.json';
        $manifest = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        $manifest['package_version'] = $packageVersion;

        return AssetManifest::fromArray($manifest);
    }

    private function installedVersion(): string
    {
        return $this->app->make(ComposerPackageVersion::class)->current();
    }
}
