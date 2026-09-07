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
$matrix = readJson("{$root}/build/frontend-entries.json");
normalizeCompiledFontUrls($matrix, $root);
$entries = buildEntries($matrix, $root, $profile);
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
    rebaseStylesheetFontUrls($target, $file);

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

function normalizeCompiledFontUrls(array $matrix, string $root): void
{
    $changed = [];

    foreach ($matrix['modern']['styles'] ?? [] as $entry) {
        $output = str_replace('\\', '/', $entry['output']);
        $path = "{$root}/public/default/{$output}";
        if (rebaseStylesheetFontUrls($path, $output)) {
            $changed[] = $output;
        }
    }

    updateMixManifestVersions($root, $changed);
}

function rebaseStylesheetFontUrls(string $path, string $publicPath): bool
{
    if (pathinfo($path, PATHINFO_EXTENSION) !== 'css') {
        return false;
    }

    $files = new Filesystem();
    $contents = $files->get($path);
    $fontPath = str_repeat('../', substr_count(dirname($publicPath), '/') + 1).'fonts/';
    $updated = preg_replace_callback(
        '#url\\(([\'\"]?)(?:\.\./)+fonts/(.+?)\\1\\)#',
        static fn (array $matches): string =>
            "url({$matches[1]}{$fontPath}{$matches[2]}{$matches[1]})",
        $contents
    );

    if ($updated === null) {
        throw new RuntimeException("Unable to rewrite font URLs in [{$path}].");
    }

    if ($updated === $contents) {
        return false;
    }

    $files->replace($path, $updated);

    return true;
}

function updateMixManifestVersions(string $root, array $outputs): void
{
    if ($outputs === []) {
        return;
    }

    $path = "{$root}/public/default/mix-manifest.json";
    $manifest = readJson($path);

    foreach ($outputs as $output) {
        $key = '/'.$output;
        if (! isset($manifest[$key])) {
            continue;
        }

        $manifest[$key] = $key.'?id='.hash_file('md5', "{$root}/public/default/{$output}");
    }

    writeJson($path, $manifest);
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
    writeJson($path, $manifest);
}

function writeJson(string $path, array $data): void
{
    $json = json_encode(
        $data,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
    ).PHP_EOL;

    (new Filesystem())->replace($path, $json);
}

function encodeJson(array $value): string
{
    return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
}
