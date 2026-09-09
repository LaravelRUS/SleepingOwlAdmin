<?php

class ThemeDependencyBoundaryTest extends TestCase
{
    private const CONCRETE_THEME_SEGMENTS = [
        'AdminLte',
        'Tailwind',
        'Legacy',
    ];

    public function test_php_core_does_not_reference_concrete_theme_namespaces(): void
    {
        $violations = [];

        foreach ($this->filesIn('src', 'php') as $path) {
            if ($this->isConcreteThemeFile($path)) {
                continue;
            }

            $references = $this->concreteThemeReferences(file_get_contents($path));

            if ($references !== []) {
                $violations[$this->relativePath($path)] = $references;
            }
        }

        $this->assertSame([], $violations);
    }

    public function test_frontend_core_does_not_import_features_or_themes(): void
    {
        $violations = [];

        foreach ($this->filesIn('resources/js/core', 'js') as $path) {
            foreach ($this->moduleSpecifiers(file_get_contents($path)) as $specifier) {
                if ($this->isConcreteFrontendImport($specifier)) {
                    $violations[$this->relativePath($path)][] = $specifier;
                }
            }
        }

        $this->assertSame([], $violations);
    }

    public function test_core_and_feature_views_do_not_reference_physical_theme_roots(): void
    {
        $violations = [];

        foreach (['resources/views/shared', 'resources/views/features'] as $root) {
            foreach ($this->filesIn($root, 'php') as $path) {
                if ($this->hasPhysicalThemeReference(file_get_contents($path))) {
                    $violations[] = $this->relativePath($path);
                }
            }
        }

        $this->assertSame([], $violations);
    }

    public function test_guard_patterns_recognize_forbidden_dependency_forms(): void
    {
        $php = 'use SleepingOwl\\Admin\\Themes\\AdminLte\\AdminLteTheme;';
        $javascript = <<<'JS'
import theme from '../themes/adminlte/index.js'
const table = import('../features/table/index.js')
JS;

        $this->assertSame(
            ['SleepingOwl\\Admin\\Themes\\AdminLte\\'],
            $this->concreteThemeReferences($php)
        );
        $this->assertSame(
            ['../themes/adminlte/index.js', '../features/table/index.js'],
            $this->moduleSpecifiers($javascript)
        );
        $this->assertTrue($this->isConcreteFrontendImport('../themes/adminlte/index.js'));
        $this->assertTrue($this->isConcreteFrontendImport('../features/table/index.js'));
        $this->assertTrue($this->hasPhysicalThemeReference('resources/views/themes/adminlte/layout.blade.php'));
    }

    private function concreteThemeReferences(string $source): array
    {
        $references = [];

        foreach (self::CONCRETE_THEME_SEGMENTS as $segment) {
            $namespace = "SleepingOwl\\Admin\\Themes\\{$segment}\\";

            if (str_contains($source, $namespace)) {
                $references[] = $namespace;
            }
        }

        return $references;
    }

    private function moduleSpecifiers(string $source): array
    {
        $specifiers = [];
        $patterns = [
            '~\bimport\s+(?:[^;\r\n]*?\s+from\s+)?[\'\"]([^\'\"]+)[\'\"]~',
            '~\b(?:import|require)\s*\(\s*[\'\"]([^\'\"]+)[\'\"]~',
        ];

        foreach ($patterns as $pattern) {
            preg_match_all($pattern, $source, $matches);
            array_push($specifiers, ...$matches[1]);
        }

        return array_values(array_unique($specifiers));
    }

    private function isConcreteFrontendImport(string $specifier): bool
    {
        $specifier = strtolower(str_replace('\\', '/', $specifier));

        return preg_match('~(?:^|/)themes/|(?:^|/)features/~', $specifier) === 1;
    }

    private function hasPhysicalThemeReference(string $source): bool
    {
        return preg_match(
            '~resources[\\\\/]views[\\\\/]themes|themes[\\\\/.](?:legacy|adminlte|tailwind)~i',
            $source
        ) === 1;
    }

    private function isConcreteThemeFile(string $path): bool
    {
        $relative = str_replace('\\', '/', $this->relativePath($path));

        foreach (self::CONCRETE_THEME_SEGMENTS as $segment) {
            if (str_starts_with($relative, "src/Themes/{$segment}/")) {
                return true;
            }
        }

        return false;
    }

    private function filesIn(string $root, string $extension): iterable
    {
        $path = realpath(__DIR__."/../../../{$root}");

        if ($path === false) {
            return;
        }

        $directory = new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS);

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if ($file->getExtension() === $extension) {
                yield $file->getPathname();
            }
        }
    }

    private function relativePath(string $path): string
    {
        return str_replace(realpath(__DIR__.'/../../..').DIRECTORY_SEPARATOR, '', $path);
    }
}
