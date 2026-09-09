<?php

declare(strict_types=1);

use Illuminate\Config\Repository;
use Illuminate\Foundation\Application;

require dirname(__DIR__, 2).'/vendor/autoload.php';

const SCRIPT_CONFIG_EXPORTS = [
    'date_format' => 'dateFormat',
    'datetime_format' => 'datetimeFormat',
    'datatables_highlight' => 'datatables_highlight',
    'state_datatables' => 'state_datatables',
    'state_filters' => 'state_filters',
    'state_tabs' => 'state_tabs',
];

const SCRIPT_DERIVED_EXPORTS = [
    'lang' => 'translation: sleeping_owl::lang',
    'max_file_size' => 'runtime: upload_max_filesize',
];

function projectRoot(): string
{
    return dirname(__DIR__, 2);
}

function loadPackageConfig(): array
{
    prepareBaselineEnvironment();
    $app = new Application(projectRoot());
    $app->instance('config', new Repository(['app' => ['locale' => 'en']]));

    return require projectRoot().'/config/sleeping_owl.php';
}

function prepareBaselineEnvironment(): void
{
    putenv('ADMIN_DEV_ASSETS=false');
    $_ENV['ADMIN_DEV_ASSETS'] = 'false';
    $_SERVER['ADMIN_DEV_ASSETS'] = 'false';
}

function isList(array $value): bool
{
    return array_is_list($value);
}

function valueType(mixed $value): string
{
    if (! is_array($value)) {
        return get_debug_type($value);
    }

    return isList($value) ? 'list' : 'map';
}

function normalizedDefault(mixed $value): mixed
{
    if (is_string($value) && str_starts_with($value, projectRoot())) {
        return str_replace('\\', '/', str_replace(projectRoot(), '<project-root>', $value));
    }

    if (is_array($value)) {
        return array_map('normalizedDefault', $value);
    }

    return is_object($value) ? ['@type' => get_debug_type($value)] : $value;
}

function flattenConfig(array $values, string $parent = ''): array
{
    $items = [];

    foreach ($values as $key => $value) {
        if (! is_string($key)) {
            continue;
        }

        $path = ltrim($parent.'.'.$key, '.');
        $items[$path] = makeConfigItem($path, $value);
        $items += is_array($value) ? flattenConfig($value, $path) : [];
    }

    return $items;
}

function makeConfigItem(string $path, mixed $value): array
{
    $item = ['key' => $path, 'type' => valueType($value)];

    if (! is_array($value) || isList($value)) {
        $item['default'] = normalizedDefault($value);
    }

    return $item;
}

function sourceFiles(): array
{
    $roots = ['src', 'resources/views', 'resources/assets/js_owl', 'resources/frontend'];
    $files = [];

    foreach ($roots as $root) {
        $files = [...$files, ...filesUnder(projectRoot().'/'.$root)];
    }

    sort($files);

    return $files;
}

function filesUnder(string $root): array
{
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root));
    $files = [];

    foreach ($iterator as $file) {
        if ($file->isFile() && isSupportedSource($file->getPathname())) {
            $files[] = $file->getPathname();
        }
    }

    return $files;
}

function isSupportedSource(string $path): bool
{
    return str_ends_with($path, '.php') || str_ends_with($path, '.js');
}

function relativePath(string $path): string
{
    return str_replace('\\', '/', substr($path, strlen(projectRoot()) + 1));
}

function sourceKind(string $path): string
{
    if (str_ends_with($path, '.blade.php')) {
        return 'blade';
    }

    return str_ends_with($path, '.js') ? 'javascript' : 'php';
}

function literalPatterns(string $path): array
{
    $patterns = [
        ['~\bconfig\s*\(\s*([\'"])sleeping_owl(?:\.([^\'"]+))?\1~', 'config-helper'],
        ['~\bConfig::(get|has|set)\s*\(\s*([\'"])sleeping_owl(?:\.([^\'"]+))?\2~', 'config-facade'],
        ['~->get\s*\(\s*([\'"])sleeping_owl(?:\.([^\'"]+))?\1~', 'config-repository'],
    ];

    if (str_ends_with($path, 'ProvidesScriptVariables.php')) {
        $patterns[] = ['~\$this->config\[([\'"])([^\'"]+)\1\]~', 'config-array'];
    }

    if (str_ends_with($path, 'AdminServiceProvider.php')) {
        $patterns[] = ['~\$this->getConfig\s*\(\s*([\'"])([^\'"]+)\1~', 'provider-helper'];
    }

    return $patterns;
}

function matchKey(array $match, string $accessor): string
{
    if ($accessor === 'config-facade') {
        return $match[3] ?? '*';
    }

    return $match[2] ?? '*';
}

function lineConsumers(string $path, string $line, int $number): array
{
    $consumers = [];

    foreach (literalPatterns($path) as [$pattern, $accessor]) {
        preg_match_all($pattern, $line, $matches, PREG_SET_ORDER);
        foreach ($matches as $match) {
            $consumers[] = makeConsumer($path, $number, $accessor, matchKey($match, $accessor));
        }
    }

    if (str_ends_with(str_replace('\\', '/', $path), '/src/Themes/ThemeConfiguration.php')) {
        $consumers = array_values(array_filter(
            $consumers,
            static fn (array $consumer): bool => $consumer['key'] !== 'ui.{$key}',
        ));
    }

    return [...$consumers, ...scopedLineConsumers($path, $line, $number)];
}

function scopedLineConsumers(string $path, string $line, int $number): array
{
    $prefix = scopedConfigPrefix($path);
    if ($prefix === null) {
        return [];
    }

    preg_match_all('~\$this->config->get\s*\(\s*([\'"])([^\'"]+)\1~', $line, $matches, PREG_SET_ORDER);

    return array_map(
        fn (array $match) => makeConsumer($path, $number, 'scoped-config', $prefix.$match[2]),
        $matches,
    );
}

function scopedConfigPrefix(string $path): ?string
{
    $path = str_replace('\\', '/', $path);

    return match (true) {
        str_ends_with($path, '/src/Wysiwyg/Manager.php') => 'wysiwyg.',
        str_contains($path, '/src/Console/Installation/') => '',
        default => null,
    };
}

function makeConsumer(string $path, int $line, string $accessor, string $key): array
{
    return [
        'key' => $key,
        'file' => relativePath($path),
        'line' => $line,
        'source' => sourceKind($path),
        'accessor' => $accessor,
    ];
}

function phpConsumers(): array
{
    $consumers = [];

    foreach (sourceFiles() as $path) {
        foreach (file($path) as $index => $line) {
            $consumers = [...$consumers, ...lineConsumers($path, $line, $index + 1)];
        }
    }

    return $consumers;
}

function scriptConsumers(): array
{
    $consumers = [];

    foreach (['resources/assets/js_owl', 'resources/frontend'] as $root) {
        foreach (filesUnder(projectRoot().'/'.$root) as $path) {
            foreach (file($path) as $index => $line) {
                $consumers = [...$consumers, ...scriptLineConsumers($path, $line, $index + 1)];
            }
        }
    }

    return $consumers;
}

function scriptLineConsumers(string $path, string $line, int $number): array
{
    preg_match_all('~Admin\.Config\.(?:get|has)\s*\(\s*([\'"])([^\'"]+)\1~', $line, $matches, PREG_SET_ORDER);

    return array_map(
        fn (array $match) => makeScriptConsumer($path, $number, $match[2]),
        $matches,
    );
}

function makeScriptConsumer(string $path, int $line, string $export): array
{
    $key = SCRIPT_CONFIG_EXPORTS[$export]
        ?? (isset(SCRIPT_DERIVED_EXPORTS[$export]) ? '' : $export);

    $consumer = [
        ...makeConsumer($path, $line, 'admin-config', $key),
        'exportedAs' => $export,
    ];

    if (isset(SCRIPT_DERIVED_EXPORTS[$export])) {
        $consumer['derivedFrom'] = SCRIPT_DERIVED_EXPORTS[$export];
    }

    return $consumer;
}

function themeConfigurationConsumers(): array
{
    $config = new Repository(['sleeping_owl' => loadPackageConfig()]);
    $keys = (new \SleepingOwl\Admin\Themes\ThemeConfiguration($config))->keys();

    return array_map(
        fn (string $key): array => makeConsumer(
            projectRoot().'/src/Themes/ThemeConfiguration.php',
            39,
            'theme-configuration',
            'ui.'.$key,
        ),
        $keys,
    );
}

function consumerIndex(array $consumers): array
{
    $index = [];

    foreach ($consumers as $consumer) {
        if ($consumer['key'] !== '') {
            $index[$consumer['key']][] = $consumer;
        }
    }

    return $index;
}

function parentKeys(string $key): array
{
    $parts = explode('.', $key);
    $parents = [];

    while (count($parts) > 1) {
        array_pop($parts);
        $parents[] = implode('.', $parts);
    }

    return $parents;
}

function attachConsumers(array $items, array $consumers): array
{
    $index = consumerIndex($consumers);

    foreach ($items as $key => &$item) {
        $item['consumers'] = $index[$key] ?? [];
        $item['ancestorConsumers'] = ancestorConsumers($key, $index);
    }

    return array_values($items);
}

function ancestorConsumers(string $key, array $index): array
{
    $consumers = [];

    foreach (parentKeys($key) as $parent) {
        $consumers = [...$consumers, ...($index[$parent] ?? [])];
    }

    return $consumers;
}

function unmappedConsumers(array $consumers, array $items): array
{
    $keys = array_fill_keys(array_column($items, 'key'), true);

    return array_values(array_filter(
        $consumers,
        fn (array $consumer) => ! in_array($consumer['key'], ['', '*'], true) && ! isset($keys[$consumer['key']]),
    ));
}

function consumersWithKey(array $consumers, string $key): array
{
    return array_values(array_filter(
        $consumers,
        fn (array $consumer) => $consumer['key'] === $key,
    ));
}

function derivedConsumers(array $consumers): array
{
    return array_values(array_filter(
        $consumers,
        fn (array $consumer) => isset($consumer['derivedFrom']),
    ));
}

function summary(array $config, array $items, array $consumers): array
{
    return [
        'topLevelKeys' => count($config),
        'allNamedKeys' => count($items),
        'keysWithDirectConsumers' => count(array_filter($items, fn (array $item) => $item['consumers'] !== [])),
        'keysWithAncestorConsumers' => count(array_filter($items, fn (array $item) => $item['ancestorConsumers'] !== [])),
        'namespaceConsumers' => count(consumersWithKey($consumers, '*')),
        'derivedScriptConsumers' => count(derivedConsumers($consumers)),
        'unmappedConsumers' => count(unmappedConsumers($consumers, $items)),
    ];
}

function buildInventory(): array
{
    $config = loadPackageConfig();
    $items = flattenConfig($config);
    ksort($items);
    $consumers = [...phpConsumers(), ...themeConfigurationConsumers(), ...scriptConsumers()];
    $attached = attachConsumers($items, $consumers);

    return [
        'formatVersion' => 1,
        'source' => 'config/sleeping_owl.php',
        'summary' => summary($config, $attached, $consumers),
        'keys' => $attached,
        'namespaceConsumers' => consumersWithKey($consumers, '*'),
        'derivedScriptConsumers' => derivedConsumers($consumers),
        'unmappedConsumers' => unmappedConsumers($consumers, $items),
    ];
}

function writeInventory(array $inventory): void
{
    $path = projectRoot().'/docs/modernization/baseline/config-inventory.json';
    $json = json_encode($inventory, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

    if (! is_dir(dirname($path))) {
        mkdir(dirname($path), 0777, true);
    }

    file_put_contents($path, $json.PHP_EOL);
    fwrite(STDOUT, "Config inventory written to {$path}".PHP_EOL);
}

writeInventory(buildInventory());
