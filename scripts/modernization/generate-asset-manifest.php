<?php

use Composer\InstalledVersions;
use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Assets\AssetManifest;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$root = dirname(__DIR__, 2);
$profile = $argv[1] ?? 'production';
$entries = buildEntries(readJson("{$root}/build/frontend-entries.json"), $root);
$manifest = manifest($profile, $entries);

AssetManifest::fromArray($manifest);
writeManifest("{$root}/public/default/asset-manifest.json", $manifest);

function manifest(string $profile, array $entries): array
{
    $manifest = [
        'schema_version' => AssetManifest::SCHEMA_VERSION,
        'package_version' => packageVersion(),
        'profiles' => [
            $profile => ['entries' => $entries],
        ],
    ];

    $manifest['build_id'] = 'sha256:'.hash('sha256', encodeJson($manifest));

    return $manifest;
}

function buildEntries(array $matrix, string $root): array
{
    $entries = [];
    foreach (['scripts', 'styles'] as $type) {
        foreach ($matrix['modern'][$type] ?? [] as $entry) {
            $logicalId = $entry['logicalId'];
            $entries[$logicalId] ??= ['scripts' => [], 'styles' => []];
            $entries[$logicalId][$type][] = assetRecord($entry['output'], $root);
        }
    }

    ksort($entries);

    return $entries;
}

function assetRecord(string $output, string $root): array
{
    $file = str_replace('\\', '/', $output);
    $path = "{$root}/public/default/{$file}";

    if (! is_file($path)) {
        throw new RuntimeException("Compiled asset [{$file}] is missing.");
    }

    return [
        'file' => $file,
        'version' => hash_file('md5', $path),
        'checksum' => 'sha256:'.hash_file('sha256', $path),
    ];
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
