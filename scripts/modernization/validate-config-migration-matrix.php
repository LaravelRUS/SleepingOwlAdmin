<?php

declare(strict_types=1);

const ALLOWED_STATUSES = [
    'unchanged',
    'same key/new implementation',
    'theme-owned',
    'deprecated',
    'removed',
];

function projectRoot(): string
{
    return dirname(__DIR__, 2);
}

function readJson(string $relativePath): array
{
    $path = projectRoot().'/'.$relativePath;

    return json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
}

function inventoryKeys(array $inventory): array
{
    return array_column($inventory['keys'], 'key');
}

function selectedKeys(array $rule, array $inventory): array
{
    $keys = $rule['selector']['keys'] ?? prefixKeys($rule, $inventory);
    $excluded = array_fill_keys($rule['selector']['exclude'] ?? [], true);

    return array_values(array_filter($keys, fn (string $key) => ! isset($excluded[$key])));
}

function prefixKeys(array $rule, array $inventory): array
{
    $prefix = $rule['selector']['prefix'] ?? null;
    if ($prefix === null) {
        return [];
    }

    return array_values(array_filter(
        $inventory,
        fn (string $key) => $key === $prefix || str_starts_with($key, $prefix.'.'),
    ));
}

function validateStatus(array $rule, int $index, array &$errors): void
{
    if (! in_array($rule['status'] ?? null, ALLOWED_STATUSES, true)) {
        $errors[] = "Rule {$index} has an invalid status.";
    }
}

function assignRule(array $rule, int $index, array $inventory, array &$assignments, array &$errors): void
{
    validateStatus($rule, $index, $errors);
    $selected = selectedKeys($rule, $inventory);

    if ($selected === []) {
        $errors[] = "Rule {$index} does not select inventory keys.";
    }

    foreach ($selected as $key) {
        $assignments[$key][] = $index;
    }
}

function validateCoverage(array $inventory, array $rules): array
{
    $assignments = [];
    $errors = [];

    foreach ($rules as $index => $rule) {
        assignRule($rule, $index, $inventory, $assignments, $errors);
    }

    foreach ($inventory as $key) {
        $count = count($assignments[$key] ?? []);
        if ($count !== 1) {
            $errors[] = "Config key {$key} is assigned {$count} times.";
        }
    }

    return $errors;
}

function validateSupplementalRows(array $matrix): array
{
    $errors = [];

    foreach (['legacyKeys', 'plannedKeys'] as $group) {
        foreach ($matrix[$group] ?? [] as $index => $row) {
            validateStatus($row, $index, $errors);
            validateMigrationDetails($row, $group, $index, $errors);
        }
    }

    return $errors;
}

function validateMigrationDetails(array $row, string $group, int $index, array &$errors): void
{
    if (! in_array($row['status'] ?? null, ['deprecated', 'removed'], true)) {
        return;
    }

    foreach (['reason', 'replacement', 'fallback', 'timeline'] as $field) {
        if (! is_string($row[$field] ?? null) || trim($row[$field]) === '') {
            $errors[] = "{$group} row {$index} with status {$row['status']} requires {$field}.";
        }
    }
}

function statusSummary(array $inventory, array $rules): array
{
    $summary = array_fill_keys(ALLOWED_STATUSES, 0);

    foreach ($rules as $rule) {
        $summary[$rule['status']] += count(selectedKeys($rule, $inventory));
    }

    return array_filter($summary);
}

function validateMatrix(): void
{
    $inventory = inventoryKeys(readJson('docs/modernization/baseline/config-inventory.json'));
    $matrix = readJson('docs/modernization/config-migration-matrix.json');
    $errors = [
        ...validateCoverage($inventory, $matrix['rules'] ?? []),
        ...validateSupplementalRows($matrix),
    ];

    if ($errors !== []) {
        fwrite(STDERR, implode(PHP_EOL, $errors).PHP_EOL);
        exit(1);
    }

    $summary = json_encode(statusSummary($inventory, $matrix['rules']), JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    fwrite(STDOUT, 'Config migration matrix valid: '.count($inventory)." keys {$summary}".PHP_EOL);
}

validateMatrix();
