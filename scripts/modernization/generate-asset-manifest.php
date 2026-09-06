<?php

use Composer\InstalledVersions;
use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Assets\AssetManifest;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$root = dirname(__DIR__, 2);
$profile = profileArgument($argv[1] ?? 'production');
$manifestPath = "{$root}/public/default/asset-manifest.json";
$packageVersion = packageVersion();

prepareProfileDirectory($root, $profile);
$entries = buildEntries(readJson("{$root}/build/frontend-entries.json"), $root, $profile);
$profiles = existingProfiles($manifestPath, $packageVersion);
$profiles[$profile] = ['entries' => $entries];
$manifest = manifest($packageVersion, orderedProfiles($profiles));

AssetManifest::fromArray($manifest);
writeManifest($manifestPath, $manifest);

function manifest(string $packageVersion, array $profiles): array
{
    $manifest = [
        'schema_version' => AssetManifest::SCHEMA_VERSION,
        'package_version' => $packageVersion,
        'profiles' => $profiles,
    ];

    $manifest['build_id'] = 'sha256:'.hash('sha256', encodeJson($manifest));

    return $manifest;
}

function buildEntries(array $matrix, string $root, string $profile): array
{
    $entries = [];
    foreach (['scripts', 'styles'] as $type) {
        foreach ($matrix['modern'][$type] ?? [] as $entry) {
            $logicalId = $entry['logicalId'];
            $entries[$logicalId] ??= ['scripts' => [], 'styles' => []];
            $entries[$logicalId][$type][] = assetRecord(
                $entry['output'],
                $root,
                $profile
            );
        }
    }

    ksort($entries);

    return $entries;
}

function assetRecord(string $output, string $root, string $profile): array
{
    $output = str_replace('\\', '/', $output);
    $source = "{$root}/public/default/{$output}";
    $file = "profiles/{$profile}/{$output}";
    $target = "{$root}/public/default/{$file}";

    copyCompiledAsset($source, $target, $profile);

    return [
        'file' => $file,
        'version' => hash_file('md5', $target),
        'checksum' => 'sha256:'.hash_file('sha256', $target),
    ];
}

function copyCompiledAsset(string $source, string $target, string $profile): void
{
    if (! is_file($source)) {
        throw new RuntimeException("Compiled asset [{$source}] is missing.");
    }

    $files = new Filesystem();
    $files->ensureDirectoryExists(dirname($target));
    copyFile($files, $source, $target);

    if ($profile === 'development' && is_file("{$source}.map")) {
        copyFile($files, "{$source}.map", "{$target}.map");
    }

    if ($profile === 'production') {
        $files->delete("{$source}.map");
    }

    copyReferencedLicense($files, $source, $target);
}

function copyReferencedLicense(Filesystem $files, string $source, string $target): void
{
    $licenseName = basename($source).'.LICENSE.txt';
    if (! str_contains($files->get($source), $licenseName)) {
        return;
    }

    $licenseSource = dirname($source).'/'.$licenseName;
    if (! is_file($licenseSource)) {
        throw new RuntimeException("Referenced license file [{$licenseSource}] is missing.");
    }

    copyFile($files, $licenseSource, dirname($target).'/'.$licenseName);
}

function copyFile(Filesystem $files, string $source, string $target): void
{
    if (! $files->copy($source, $target)) {
        throw new RuntimeException("Unable to copy compiled asset to [{$target}].");
    }
}

function prepareProfileDirectory(string $root, string $profile): void
{
    $directory = "{$root}/public/default/profiles/{$profile}";
    $files = new Filesystem();

    $files->deleteDirectory($directory);
    $files->ensureDirectoryExists($directory);
}

function existingProfiles(string $path, string $packageVersion): array
{
    if (! is_file($path)) {
        return [];
    }

    try {
        $data = readJson($path);
        $manifest = AssetManifest::fromArray($data);
    } catch (Throwable) {
        return [];
    }

    return $manifest->packageVersion() === $packageVersion
        ? $data['profiles']
        : [];
}

function orderedProfiles(array $profiles): array
{
    $ordered = [];
    foreach (['production', 'development'] as $profile) {
        if (isset($profiles[$profile])) {
            $ordered[$profile] = $profiles[$profile];
        }
    }

    return $ordered;
}

function profileArgument(string $profile): string
{
    if (! in_array($profile, ['production', 'development'], true)) {
        throw new InvalidArgumentException("Unsupported asset profile [{$profile}].");
    }

    return $profile;
}

function packageVersion(): string
{
    $package = InstalledVersions::getRootPackage();

    return (string) ($package['pretty_version'] ?? $package['version']);
}

function readJson(string $path): array
{
    $contents = file_get_contents($path);
    if ($contents === false) {
        throw new RuntimeException("Unable to read [{$path}].");
    }

    $data = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
    if (! is_array($data)) {
        throw new RuntimeException("JSON root in [{$path}] must be an object.");
    }

    return $data;
}

function writeManifest(string $path, array $manifest): void
{
    $json = json_encode(
        $manifest,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
    ).PHP_EOL;

    (new Filesystem())->replace($path, $json);
}

function encodeJson(array $value): string
{
    return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
}
