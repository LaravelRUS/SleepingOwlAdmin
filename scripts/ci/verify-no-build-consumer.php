<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\AdminLTETheme;
use SleepingOwl\Admin\Themes\ThemeRuntimeAssets;

function fail(string $message): never
{
    fwrite(STDERR, $message.PHP_EOL);

    exit(1);
}

function requirePath(string $path, string $description): void
{
    if (! file_exists($path)) {
        fail("Missing {$description}: {$path}");
    }
}

function loadManifest(string $assetRoot): array
{
    $path = $assetRoot.'/asset-manifest.json';
    requirePath($path, 'published asset manifest');

    $manifest = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
    if (! is_array($manifest)) {
        fail('Published asset manifest must contain a JSON object.');
    }

    return $manifest;
}

function verifyAsset(string $assetRoot, array $asset): void
{
    $relativePath = $asset['file'] ?? null;
    $version = $asset['version'] ?? null;
    $checksum = $asset['checksum'] ?? null;

    if (! is_string($relativePath) || ! is_string($version) || ! is_string($checksum)) {
        fail('Asset manifest contains an incomplete asset record.');
    }

    $path = $assetRoot.'/'.str_replace('/', DIRECTORY_SEPARATOR, $relativePath);
    requirePath($path, "published asset [{$relativePath}]");

    if (hash_file('md5', $path) !== $version) {
        fail("Published asset [{$relativePath}] has an invalid version hash.");
    }

    if ('sha256:'.hash_file('sha256', $path) !== $checksum) {
        fail("Published asset [{$relativePath}] has an invalid checksum.");
    }
}

function verifyProfiles(string $assetRoot, array $manifest): void
{
    $profiles = $manifest['profiles'] ?? null;
    if (! is_array($profiles)) {
        fail('Asset manifest does not contain profiles.');
    }

    foreach (['production', 'development'] as $profileId) {
        $entries = $profiles[$profileId]['entries'] ?? null;
        if (! is_array($entries)) {
            fail("Asset manifest does not contain [{$profileId}] entries.");
        }

        foreach ($entries as $entry) {
            foreach (['scripts', 'styles'] as $type) {
                foreach ($entry[$type] ?? [] as $asset) {
                    verifyAsset($assetRoot, $asset);
                }
            }
        }
    }
}

function frameworkFreeTheme(): ThemeInterface
{
    return new class implements ThemeInterface
    {
        public function id(): string
        {
            return 'framework-free-test';
        }

        public function viewNamespace(): string
        {
            return 'sleeping_owl::default';
        }

        public function assets(): array
        {
            return frameworkFreeAssets();
        }

        public function icons(): array
        {
            return [];
        }

        public function capabilities(): array
        {
            return frameworkFreeCapabilities();
        }
    };
}

function frameworkFreeAssets(): array
{
    return [
        'shared:compatibility',
        'shared:modules',
        'shared:vue',
        'theme:framework-free-test',
        'feature:dropdown:theme:framework-free-test',
        'feature:sidebar:theme:framework-free-test',
        'feature:table:theme:framework-free-test',
        'feature:tabs:theme:framework-free-test',
        'feature:tooltip:theme:framework-free-test',
    ];
}

function frameworkFreeCapabilities(): array
{
    return ['dropdown', 'notification', 'sidebar', 'table-presentation', 'tabs', 'tooltip'];
}

function verifyThemes(string $appRoot): void
{
    chdir($appRoot);
    require $appRoot.'/vendor/autoload.php';

    $app = require $appRoot.'/bootstrap/app.php';
    $app->make(Kernel::class)->bootstrap();

    if (! $app->make(ThemeInterface::class) instanceof AdminLTETheme) {
        fail('The clean application did not resolve AdminLTETheme by default.');
    }

    $registry = $app->make(AssetRegistry::class);
    $registry->clear();
    $app->make(ThemeRuntimeAssets::class)->register(frameworkFreeTheme());

    $assets = [...$registry->registeredScripts(), ...$registry->registeredStyles()];
    $sources = implode("\n", array_map(static fn ($asset): string => $asset->source(), $assets));

    if (! str_contains($sources, 'framework-free-test')) {
        fail('The framework-free test theme did not resolve its precompiled assets.');
    }

    if (str_contains($sources, 'legacy-adminlte')) {
        fail('The framework-free test theme resolved AdminLTE assets.');
    }
}

function main(array $arguments): void
{
    $appRoot = isset($arguments[1]) ? realpath($arguments[1]) : false;
    if ($appRoot === false || ! is_dir($appRoot)) {
        fail('Usage: php verify-no-build-consumer.php <laravel-application>');
    }

    $assetRoot = $appRoot.'/public/packages/sleepingowl/default';
    verifyProfiles($assetRoot, loadManifest($assetRoot));
    verifyThemes($appRoot);

    fwrite(STDOUT, 'Both asset profiles and theme runtimes verified.'.PHP_EOL);
}

main($argv);
