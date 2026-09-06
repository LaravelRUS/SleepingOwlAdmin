<?php

declare(strict_types=1);

function projectRoot(): string
{
    return dirname(__DIR__, 2);
}

function loadFixture(string $name): array
{
    $value = require projectRoot().'/tests/Fixtures/config/'.$name.'.php';

    if (! is_array($value)) {
        throw new RuntimeException("Config fixture {$name} must return an array.");
    }

    return $value;
}

function assertFixture(bool $condition, string $message): void
{
    if (! $condition) {
        throw new RuntimeException($message);
    }
}

function validateLegacy(array $config): void
{
    assertFixture(isset($config['show_editor']), 'Legacy fixture must contain show_editor.');
    assertFixture(! isset($config['enable_editor']), 'Legacy fixture must omit enable_editor.');
    assertFixture(! isset($config['dev_assets']), 'Legacy fixture must omit dev_assets.');
    assertFixture(! isset($config['sidebar_background_color']), 'Legacy fixture must omit the planned sidebar color.');

    foreach (['Assets', 'Meta', 'PackageManager'] as $alias) {
        $target = $config['aliases'][$alias] ?? '';
        assertFixture(str_starts_with($target, 'KodiCMS\\Assets\\'), "Legacy alias {$alias} must target KodiCMS.");
    }
}

function validateMinimal(array $config): void
{
    assertFixture($config === ['title' => 'Minimal Admin'], 'Minimal fixture must rely on package defaults.');
}

function validateFixtures(): void
{
    $legacy = loadFixture('sleeping_owl_legacy_full');
    $minimal = loadFixture('sleeping_owl_minimal');

    validateLegacy($legacy);
    validateMinimal($minimal);

    fwrite(STDOUT, sprintf(
        'Config fixtures valid: legacy=%d top-level keys, minimal=%d top-level key'.PHP_EOL,
        count($legacy),
        count($minimal),
    ));
}

validateFixtures();
