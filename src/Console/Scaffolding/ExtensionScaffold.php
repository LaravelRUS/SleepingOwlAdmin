<?php

namespace SleepingOwl\Admin\Console\Scaffolding;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

final class ExtensionScaffold
{
    private const DEFINITIONS = [
        'form-element' => [
            ['form-element.php.stub', 'app', 'Admin/Form/Elements/DummyClass.php', 'Admin\\Form\\Elements'],
            ['form-element.blade.php.stub', 'resources', 'views/admin/form-elements/dummy-kebab.blade.php'],
        ],
        'widget' => [
            ['widget.php.stub', 'app', 'Admin/Widgets/DummyClass.php', 'Admin\\Widgets'],
            ['widget.blade.php.stub', 'resources', 'views/admin/widgets/dummy-kebab.blade.php'],
        ],
        'policy' => [
            ['policy.php.stub', 'app', 'Policies/DummyClass.php', 'Policies'],
        ],
        'module-provider' => [
            ['module-provider.php.stub', 'app', 'Providers/DummyClass.php', 'Providers'],
        ],
        'vue-island' => [
            ['vue-island.js.stub', 'resources', 'js/admin/islands/dummy-kebab.js'],
            ['vue-island.blade.php.stub', 'resources', 'views/admin/islands/dummy-kebab.blade.php'],
            ['vue-island-provider.php.stub', 'app', 'Providers/DummyVueProviderClass.php', 'Providers'],
        ],
        'theme' => [
            ['theme.php.stub', 'app', 'Admin/Themes/DummyClass.php', 'Admin\\Themes'],
            ['theme-provider.php.stub', 'app', 'Providers/DummyThemeProviderClass.php', 'Providers'],
            ['theme.scss.stub', 'resources', 'admin/themes/dummy-kebab/resources/css/themes/dummy-kebab/theme.scss'],
            ['theme.js.stub', 'resources', 'admin/themes/dummy-kebab/resources/js/themes/dummy-kebab/theme.js'],
            ['theme-view.blade.php.stub', 'resources', 'admin/themes/dummy-kebab/resources/views/themes/dummy-kebab/default/_layout/base.blade.php'],
            ['theme-ready.css.stub', 'resources', 'admin/themes/dummy-kebab/public/profiles/production/css/theme.css'],
            ['theme-ready.css.stub', 'resources', 'admin/themes/dummy-kebab/public/profiles/development/css/theme.css'],
            ['theme-ready.js.stub', 'resources', 'admin/themes/dummy-kebab/public/profiles/production/js/theme.js'],
            ['theme-ready.js.stub', 'resources', 'admin/themes/dummy-kebab/public/profiles/development/js/theme.js'],
            ['theme-manifest.json.stub', 'resources', 'admin/themes/dummy-kebab/asset-manifest.json'],
        ],
    ];

    public function __construct(private Filesystem $files)
    {
    }

    /**
     * @return list<string>
     */
    public function generate(
        string $type,
        string $name,
        string $rootNamespace,
        string $appPath,
        string $resourcePath,
        bool $force = false
    ): array {
        $artifacts = $this->artifacts($type, $name, $rootNamespace, $appPath, $resourcePath);
        $this->guardExistingFiles($artifacts, $force);

        foreach ($artifacts as $artifact) {
            $this->write($artifact['path'], $artifact['contents']);
        }

        return array_column($artifacts, 'path');
    }

    /**
     * @return list<string>
     */
    public function supportedTypes(): array
    {
        return array_keys(self::DEFINITIONS);
    }

    /**
     * @return list<array{path: string, contents: string}>
     */
    private function artifacts(
        string $type,
        string $name,
        string $rootNamespace,
        string $appPath,
        string $resourcePath
    ): array {
        $definition = self::DEFINITIONS[$type] ?? null;
        if ($definition === null) {
            throw new InvalidArgumentException("Unknown extension type [{$type}].");
        }

        $class = Str::studly($name);
        if ($class === '') {
            throw new InvalidArgumentException('Extension name cannot be empty.');
        }

        $artifacts = array_map(
            fn (array $artifact): array => $this->artifact(
                $artifact,
                $class,
                trim($rootNamespace, '\\'),
                $appPath,
                $resourcePath
            ),
            $definition
        );

        return $type === 'theme' ? $this->hydrateThemeManifest($artifacts) : $artifacts;
    }

    /**
     * @param  list<array{path: string, contents: string}>  $artifacts
     * @return list<array{path: string, contents: string}>
     */
    private function hydrateThemeManifest(array $artifacts): array
    {
        $css = $this->artifactContents($artifacts, 'profiles/production/css/theme.css');
        $javascript = $this->artifactContents($artifacts, 'profiles/production/js/theme.js');

        foreach ($artifacts as &$artifact) {
            if (! str_ends_with(str_replace('\\', '/', $artifact['path']), '/asset-manifest.json')) {
                continue;
            }

            $manifest = json_decode(strtr($artifact['contents'], [
                'DummyCssMd5' => hash('md5', $css),
                'DummyCssSha256' => hash('sha256', $css),
                'DummyJsMd5' => hash('md5', $javascript),
                'DummyJsSha256' => hash('sha256', $javascript),
            ]), true, 512, JSON_THROW_ON_ERROR);
            $buildData = $manifest;
            unset($buildData['build_id']);
            $manifest['build_id'] = 'sha256:'.hash(
                'sha256',
                json_encode($buildData, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)
            );
            $artifact['contents'] = json_encode(
                $manifest,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
            ).PHP_EOL;
        }
        unset($artifact);

        return $artifacts;
    }

    /**
     * @param  list<array{path: string, contents: string}>  $artifacts
     */
    private function artifactContents(array $artifacts, string $suffix): string
    {
        foreach ($artifacts as $artifact) {
            if (str_ends_with(str_replace('\\', '/', $artifact['path']), $suffix)) {
                return $artifact['contents'];
            }
        }

        throw new RuntimeException("Theme scaffold artifact [{$suffix}] is missing.");
    }

    /**
     * @param  array{0: string, 1: string, 2: string, 3?: string}  $definition
     * @return array{path: string, contents: string}
     */
    private function artifact(
        array $definition,
        string $class,
        string $rootNamespace,
        string $appPath,
        string $resourcePath
    ): array {
        [$stub, $root, $relativePath] = $definition;
        $namespace = isset($definition[3]) ? $rootNamespace.'\\'.$definition[3] : $rootNamespace;
        $replacements = [
            'DummyNamespace' => $namespace,
            'DummyThemeNamespace' => $rootNamespace.'\\Admin\\Themes',
            'DummyVueProviderClass' => $class.'VueIslandServiceProvider',
            'DummyThemeProviderClass' => $class.'ThemeServiceProvider',
            'DummyClass' => $class,
            'dummy-kebab' => Str::kebab($class),
        ];

        return [
            'path' => $this->targetPath($root, $relativePath, $appPath, $resourcePath, $replacements),
            'contents' => strtr($this->files->get($this->stubPath($stub)), $replacements),
        ];
    }

    private function targetPath(
        string $root,
        string $relativePath,
        string $appPath,
        string $resourcePath,
        array $replacements
    ): string {
        $base = $root === 'app' ? $appPath : $resourcePath;

        return $base.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, strtr($relativePath, $replacements));
    }

    /**
     * @param  list<array{path: string, contents: string}>  $artifacts
     */
    private function guardExistingFiles(array $artifacts, bool $force): void
    {
        if ($force) {
            return;
        }

        foreach ($artifacts as $artifact) {
            if ($this->files->exists($artifact['path'])) {
                throw new RuntimeException("File [{$artifact['path']}] already exists. Use --force to overwrite it.");
            }
        }
    }

    private function write(string $path, string $contents): void
    {
        $this->files->ensureDirectoryExists(dirname($path));
        $this->files->put($path, $contents);
    }

    private function stubPath(string $stub): string
    {
        return dirname(__DIR__).DIRECTORY_SEPARATOR.'Commands'.DIRECTORY_SEPARATOR.'stubs'.DIRECTORY_SEPARATOR.'extensions'.DIRECTORY_SEPARATOR.$stub;
    }
}
