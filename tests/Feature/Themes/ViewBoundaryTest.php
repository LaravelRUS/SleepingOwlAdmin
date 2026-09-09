<?php

class ViewBoundaryTest extends TestCase
{
    private const BRIDGES = [
        'default.column.action' => 'features.display.action_option',
        'default.column.header' => 'shared.column.header',
        'default.column.tree_control' => 'features.tree.controls',
        'default.display.extensions.actions_form' => 'features.display.actions_form',
        'default.display.extensions.links' => 'features.display.links',
        'default.form.element.formelements' => 'shared.form.elements',
        'default.helper.autoupdate' => 'features.datatables.autoupdate',
        'default.helper.ckeditor.ckeditor_upload_file' => 'features.ckeditor.upload_result',
    ];

    public function test_owned_and_legacy_view_paths_are_discoverable(): void
    {
        foreach (self::BRIDGES as $legacy => $owned) {
            $this->assertTrue(view()->exists("sleeping_owl::{$legacy}"), $legacy);
            $this->assertTrue(view()->exists("sleeping_owl::{$owned}"), $owned);
        }
    }

    public function test_default_namespace_resolves_from_extracted_legacy_theme(): void
    {
        $path = view()->getFinder()->find('sleeping_owl::default._layout.inner');
        $expected = realpath(__DIR__.'/../../../resources/views/themes/adminlte/default/_layout/inner.blade.php');

        $this->assertSame($expected, realpath($path));
    }

    public function test_every_legacy_theme_view_keeps_its_default_logical_path(): void
    {
        $root = realpath(__DIR__.'/../../../resources/views/themes/adminlte/default');

        foreach ($this->bladeFiles('themes/adminlte/default') as $path) {
            $relative = substr($path, strlen($root) + 1);
            $logical = str_replace([DIRECTORY_SEPARATOR, '.blade.php'], ['.', ''], $relative);
            $resolved = view()->getFinder()->find("sleeping_owl::default.{$logical}");

            $this->assertSame(realpath($path), realpath($resolved), $logical);
        }
    }

    public function test_package_root_precedes_legacy_theme_in_namespace_hints(): void
    {
        $hints = array_map('realpath', view()->getFinder()->getHints()['sleeping_owl']);
        $root = realpath(__DIR__.'/../../../resources/views');
        $legacy = realpath(__DIR__.'/../../../resources/views/themes/adminlte');
        $rootIndex = array_search($root, $hints, true);
        $legacyIndex = array_search($legacy, $hints, true);

        $this->assertNotFalse($rootIndex);
        $this->assertNotFalse($legacyIndex);
        $this->assertLessThan($legacyIndex, $rootIndex);
    }

    public function test_legacy_paths_are_thin_compatibility_bridges(): void
    {
        foreach (self::BRIDGES as $legacy => $owned) {
            $source = trim(file_get_contents($this->viewPath($legacy)));

            $this->assertSame("@include('sleeping_owl::{$owned}')", $source, $legacy);
        }
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

    public function test_shared_header_keeps_the_legacy_render_path(): void
    {
        $data = ['title' => '<strong>Orders</strong>'];

        $legacy = view('sleeping_owl::default.column.header', $data)->render();
        $owned = view('sleeping_owl::shared.column.header', $data)->render();

        $this->assertSame($owned, $legacy);
        $this->assertStringContainsString('<strong>Orders</strong>', $legacy);
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

    private function viewPath(string $view): string
    {
        if (str_starts_with($view, 'default.')) {
            $view = 'themes.adminlte.'.$view;
        }

        $relative = str_replace('.', DIRECTORY_SEPARATOR, $view);

        return __DIR__."/../../../resources/views/{$relative}.blade.php";
    }

    private function relativePath(string $path): string
    {
        return str_replace(realpath(__DIR__.'/../../..').DIRECTORY_SEPARATOR, '', $path);
    }
}
