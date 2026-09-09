<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\AdminLTETheme;
use SleepingOwl\Admin\Themes\EmptyTheme;
use SleepingOwl\Admin\Themes\TailwindTheme;
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

function verifyThemes(string $appRoot, string $expectedTheme): void
{
    chdir($appRoot);
    require $appRoot.'/vendor/autoload.php';

    $app = require $appRoot.'/bootstrap/app.php';
    $app->make(Kernel::class)->bootstrap();

    $expectedClass = match ($expectedTheme) {
        'adminlte' => AdminLTETheme::class,
        'empty' => EmptyTheme::class,
        'shadcn' => TailwindTheme::class,
        default => fail("Unsupported expected theme [{$expectedTheme}]."),
    };

    if (! $app->make(ThemeInterface::class) instanceof $expectedClass) {
        fail("The clean application did not resolve expected theme [{$expectedTheme}].");
    }

    $registry = $app->make(AssetRegistry::class);
    $registry->clear();
    $app->make(ThemeRuntimeAssets::class)->register('shadcn', new TailwindTheme());
    $assets = [...$registry->registeredScripts(), ...$registry->registeredStyles()];
    $sources = implode("\n", array_map(static fn ($asset): string => $asset->source(), $assets));

    if (! str_contains($sources, 'css/themes/shadcn-utilities.css')) {
        fail('TailwindTheme did not resolve its precompiled utility layer.');
    }

    if (str_contains($sources, 'adminlte')) {
        fail('TailwindTheme resolved AdminLTE assets.');
    }
}

function main(array $arguments): void
{
    $appRoot = isset($arguments[1]) ? realpath($arguments[1]) : false;
    if ($appRoot === false || ! is_dir($appRoot)) {
        fail('Usage: php verify-no-build-consumer.php <laravel-application> [adminlte|empty|shadcn]');
    }
    $expectedTheme = $arguments[2] ?? 'adminlte';

    $assetRoot = $appRoot.'/public/packages/sleepingowl/default';
    verifyProfiles($assetRoot, loadManifest($assetRoot));
    verifyThemes($appRoot, $expectedTheme);

    fwrite(STDOUT, "Both asset profiles and [{$expectedTheme}] theme runtime verified.".PHP_EOL);
}

main($argv);
