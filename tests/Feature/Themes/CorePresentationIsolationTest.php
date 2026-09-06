<?php

class CorePresentationIsolationTest extends TestCase
{
    private const FORBIDDEN_CLASS_TOKENS = [
        'active',
        'badge',
        'badge-primary',
        'btn',
        'btn-danger',
        'btn-default',
        'btn-info',
        'btn-primary',
        'btn-sm',
        'btn-success',
        'btn-warning',
        'btn-xs',
        'card',
        'card-body',
        'card-default',
        'card-footer',
        'card-header',
        'form-control',
        'nav-item',
        'nav-link',
        'pr-5',
        'row',
        'table',
        'table-default',
        'table-hover',
        'table-striped',
    ];

    public function test_php_core_does_not_define_legacy_theme_class_defaults(): void
    {
        $violations = [];

        foreach ($this->phpSourceFiles() as $path) {
            $source = file_get_contents($path);

            foreach ($this->classLiterals($source) as $literal) {
                $forbidden = array_intersect($this->classTokens($literal), self::FORBIDDEN_CLASS_TOKENS);

                if ($forbidden !== []) {
                    $key = $this->relativePath($path);
                    $violations[$key] = array_values(array_unique([
                        ...($violations[$key] ?? []),
                        ...$forbidden,
                    ]));
                }
            }

            if ($this->containsThemeGridDefault($source)) {
                $violations[$this->relativePath($path)][] = 'col-*-';
            }
        }

        $this->assertSame([], $violations);
    }

    public function test_default_theme_blade_sources_compile_to_valid_php(): void
    {
        $compiler = $this->app->make('blade.compiler');
        $errors = [];

        foreach ($this->defaultThemeViews() as $path) {
            try {
                token_get_all($compiler->compileString(file_get_contents($path)), TOKEN_PARSE);
            } catch (ParseError $error) {
                $errors[$this->relativePath($path)] = $error->getMessage();
            }
        }

        $this->assertSame([], $errors);
    }

    public function test_default_theme_renders_html_attributes_from_arrays(): void
    {
        $patterns = [
            '~\{!!\s*\$(?:attributes|htmlStringAttributes)\s*!!\}~',
            '~->(?:attributes|htmlAttributesToString)\(\)~',
        ];
        $violations = [];

        foreach ($this->defaultThemeViews() as $path) {
            $source = preg_replace('~\{\{--.*?--\}\}~s', '', file_get_contents($path));

            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $source) === 1) {
                    $violations[] = $this->relativePath($path);
                    break;
                }
            }
        }

        $this->assertSame([], $violations);
    }

    private function phpSourceFiles(): iterable
    {
        $root = realpath(__DIR__.'/../../../src');
        $directory = new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS);

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if ($file->getExtension() === 'php') {
                yield $file->getPathname();
            }
        }
    }

    private function classLiterals(string $source): array
    {
        $patterns = [
            '~setHtmlAttribute\(\s*[\'\"]class[\'\"]\s*,\s*[\'\"]([^\'\"]*)[\'\"]\s*\)~',
            '~[\'\"]class[\'\"]\s*=>\s*[\'\"]([^\'\"]*)[\'\"]~',
            '~(?:private|protected|public)\s+\$class\s*=\s*[\'\"]([^\'\"]*)[\'\"]~',
        ];
        $literals = [];

        foreach ($patterns as $pattern) {
            preg_match_all($pattern, $source, $matches);
            array_push($literals, ...$matches[1]);
        }

        return $literals;
    }

    private function defaultThemeViews(): iterable
    {
        $root = realpath(__DIR__.'/../../../resources/views/default');
        $directory = new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS);

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if (str_ends_with($file->getFilename(), '.blade.php')) {
                yield $file->getPathname();
            }
        }
    }

    private function classTokens(string $literal): array
    {
        return preg_split('/\s+/', trim($literal), -1, PREG_SPLIT_NO_EMPTY) ?: [];
    }

    private function containsThemeGridDefault(string $source): bool
    {
        return preg_match('~[\'\"]col-(?:xs|sm|md|lg|xl)-[\'\"]~', $source) === 1;
    }

    private function relativePath(string $path): string
    {
        return str_replace(realpath(__DIR__.'/../../..').DIRECTORY_SEPARATOR, '', $path);
    }
}
