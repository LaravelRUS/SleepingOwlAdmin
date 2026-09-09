<?php

class ViewBoundaryTest extends TestCase
{
    private const OWNED_VIEWS = [
        'features.display.action_option',
        'shared.column.header',
        'features.tree.controls',
        'features.display.actions_form',
        'features.display.links',
        'shared.form.elements',
        'features.datatables.autoupdate',
        'features.ckeditor.upload_result',
    ];

    public function test_owned_view_paths_are_discoverable_without_default_bridges(): void
    {
        foreach (self::OWNED_VIEWS as $owned) {
            $this->assertTrue(view()->exists("sleeping_owl::{$owned}"), $owned);
        }
    }

    public function test_default_namespace_resolves_from_package_base(): void
    {
        $path = view()->getFinder()->find('sleeping_owl::default._layout.inner');
        $expected = realpath(__DIR__.'/../../../resources/views/default/_layout/inner.blade.php');

        $this->assertSame($expected, realpath($path));
    }

    public function test_every_base_view_keeps_its_default_logical_path(): void
    {
        $root = realpath(__DIR__.'/../../../resources/views/default');

        foreach ($this->bladeFiles('default') as $path) {
            $relative = substr($path, strlen($root) + 1);
            $logical = str_replace([DIRECTORY_SEPARATOR, '.blade.php'], ['.', ''], $relative);
            $resolved = view()->getFinder()->find("sleeping_owl::default.{$logical}");

            $this->assertSame(realpath($path), realpath($resolved), $logical);
        }
    }

    public function test_package_root_is_the_only_package_default_hint(): void
    {
        $hints = array_map('realpath', view()->getFinder()->getHints()['sleeping_owl']);
        $root = realpath(__DIR__.'/../../../resources/views');

        $this->assertContains($root, $hints);
        $this->assertNotContains(false, $hints);
        $this->assertSame($root, $hints[array_search($root, $hints, true)]);
    }

    public function test_shared_views_do_not_depend_on_themes_or_feature_runtimes(): void
    {
        $patterns = [
            '~AdminTemplate|config\s*\(|sleeping_owl::default~',
            '~<script|\$\(|jQuery|\bv-[a-z-]+~',
            '~\b(?:btn|card|form-control|nav-|table-|col-(?:sm|md|lg|xl))-~',
        ];

        $this->assertSame([], $this->findViolations('shared', $patterns));
    }

    public function test_feature_views_do_not_depend_on_default_theme_views(): void
    {
        $patterns = [
            '~sleeping_owl::default~',
            '~AdminTemplate(?:::|\s*\()~',
        ];

        $this->assertSame([], $this->findViolations('features', $patterns));
    }

    public function test_shared_header_renders_rich_titles(): void
    {
        $data = ['title' => '<strong>Orders</strong>'];

        $html = view('sleeping_owl::shared.column.header', $data)->render();

        $this->assertStringContainsString('<strong>Orders</strong>', $html);
    }

    private function findViolations(string $root, array $patterns): array
    {
        $violations = [];

        foreach ($this->bladeFiles($root) as $path) {
            $source = file_get_contents($path);

            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $source) === 1) {
                    $violations[] = $this->relativePath($path);
                    break;
                }
            }
        }

        return $violations;
    }

    private function bladeFiles(string $root): iterable
    {
        $path = realpath(__DIR__."/../../../resources/views/{$root}");
        $directory = new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS);

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if (str_ends_with($file->getFilename(), '.blade.php')) {
                yield $file->getPathname();
            }
        }
    }

    private function relativePath(string $path): string
    {
        return str_replace(realpath(__DIR__.'/../../..').DIRECTORY_SEPARATOR, '', $path);
    }
}
