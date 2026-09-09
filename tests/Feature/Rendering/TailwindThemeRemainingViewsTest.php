<?php

use Illuminate\Support\MessageBag;
use Illuminate\Support\ViewErrorBag;
use SleepingOwl\Admin\Themes\TailwindTheme;

class TailwindThemeRemainingViewsTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', TailwindTheme::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        config()->set([
            'sleeping_owl.ui.favicon' => null,
            'sleeping_owl.ui.scroll_to_bottom' => false,
            'sleeping_owl.ui.scroll_to_top' => false,
        ]);
    }

    public function test_tailwind_resolves_every_base_logical_view(): void
    {
        $baseRoot = realpath(__DIR__.'/../../../resources/views/default');
        $tailwindRoot = realpath(__DIR__.'/../../../resources/views/themes/shadcn/default');
        $directory = new RecursiveDirectoryIterator($baseRoot, FilesystemIterator::SKIP_DOTS);
        $views = [];
        $inherited = 0;
        $overridden = 0;

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if (! str_ends_with($file->getFilename(), '.blade.php')) {
                continue;
            }

            $relative = substr($file->getPathname(), strlen($baseRoot) + 1);
            $logical = str_replace([DIRECTORY_SEPARATOR, '.blade.php'], ['.', ''], $relative);
            $resolved = view()->getFinder()->find(
                app('sleeping_owl.template')->getViewPath($logical)
            );
            $override = $tailwindRoot.DIRECTORY_SEPARATOR.$relative;
            $expected = is_file($override) ? $override : $file->getPathname();
            is_file($override) ? $overridden++ : $inherited++;

            $this->assertSame(
                realpath($expected),
                realpath($resolved),
                $logical
            );
            $views[] = $logical;
        }

        $this->assertContains('dashboard', $views);
        $this->assertContains('pages.login', $views);
        $this->assertCount(103, $views);
        $this->assertSame(count($views), $inherited + $overridden);
        $this->assertGreaterThan(0, $inherited);
        $this->assertGreaterThan(0, $overridden);
    }

    public function test_tailwind_overrides_contain_no_base_duplicates(): void
    {
        $baseRoot = realpath(__DIR__.'/../../../resources/views/default');
        $tailwindRoot = realpath(__DIR__.'/../../../resources/views/themes/shadcn/default');
        $directory = new RecursiveDirectoryIterator($tailwindRoot, FilesystemIterator::SKIP_DOTS);
        $overrides = [];

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if (! str_ends_with($file->getFilename(), '.blade.php')) {
                continue;
            }

            $relative = substr($file->getPathname(), strlen($tailwindRoot) + 1);
            $base = $baseRoot.DIRECTORY_SEPARATOR.$relative;

            $this->assertFileExists($base, $relative);
            $this->assertNotSame(
                $this->normalizeBlade(file_get_contents($base)),
                $this->normalizeBlade(file_get_contents($file->getPathname())),
                $relative
            );
            $overrides[] = $relative;
        }

        $this->assertNotEmpty($overrides);
    }

    public function test_nested_logical_paths_keep_the_tailwind_fallback_chain(): void
    {
        $template = app('sleeping_owl.template');
        $finder = view()->getFinder();
        $base = realpath(__DIR__.'/../../../resources/views/default');

        $inherited = $finder->find($template->getViewPath('column.editable.checklist'));
        $nestedFallback = $finder->find(
            $template->getViewPath('column.editable.partials.editor_template')
        );

        $this->assertSame(
            realpath($base.DIRECTORY_SEPARATOR.'column/editable/checklist.blade.php'),
            realpath($inherited)
        );
        $this->assertSame(
            realpath(
                $base.DIRECTORY_SEPARATOR.
                    'column/editable/partials/editor_template.blade.php'
            ),
            realpath($nestedFallback)
        );
    }

    public function test_archived_shadcn_components_are_not_runtime_views(): void
    {
        $root = realpath(
            __DIR__.'/../../../resources/archive/unused-sources/resources/views/themes/shadcn/components'
        );
        $directory = new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS);
        $components = [];

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if (! str_ends_with($file->getFilename(), '.blade.php')) {
                continue;
            }

            $relative = substr($file->getPathname(), strlen($root) + 1);
            $logical = str_replace([DIRECTORY_SEPARATOR, '.blade.php'], ['.', ''], $relative);

            $this->assertFalse(view()->exists("sleeping_owl_shadcn::components.{$logical}"));
            $this->assertFalse(view()->exists("sleeping_owl::components.{$logical}"));
            $components[] = $logical;
        }

        $this->assertNotEmpty($components);
    }

    public function test_archived_default_views_are_not_runtime_views(): void
    {
        $root = realpath(
            __DIR__.'/../../../resources/archive/unused-sources/resources/views/default'
        );
        $directory = new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS);
        $archived = [];

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if (! str_ends_with($file->getFilename(), '.blade.php')) {
                continue;
            }

            $relative = substr($file->getPathname(), strlen($root) + 1);
            $logical = str_replace([DIRECTORY_SEPARATOR, '.blade.php'], ['.', ''], $relative);

            $this->assertFalse(view()->exists("sleeping_owl::default.{$logical}"));
            $this->assertFalse(view()->exists("sleeping_owl_shadcn::default.{$logical}"));
            $archived[] = $logical;
        }

        $this->assertCount(35, $archived);
    }

    public function test_login_receives_theme_classes_without_changing_contracts(): void
    {
        $errors = (new ViewErrorBag())->put('default', new MessageBag([
            'username' => ['Unknown user'],
        ]));
        $login = app('sleeping_owl.template')->view('pages.login', [
            'errors' => $errors,
            'loginPostUrl' => '/admin/login',
            'title' => 'Sign in',
        ])->render();

        $this->assertContainsAll($login, [
            'class="login-page bg-body-secondary soa-login-page"',
            'class="card card-outline card-primary soa-card soa-login-card"',
            'action="/admin/login"',
            'name="_token"',
            'name="username"',
            'autocomplete="username"',
            'aria-invalid="true"',
            'name="password"',
            'autocomplete="current-password"',
            'soa-login-submit',
        ]);
    }

    private function assertContainsAll(string $html, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $html);
        }
    }

    private function normalizeBlade(string $source): string
    {
        $lines = preg_split('/\R/u', $source);
        $lines = array_map('rtrim', $lines ?: []);
        $lines = array_filter($lines, static fn (string $line): bool => trim($line) !== '');

        return trim(implode("\n", $lines));
    }
}
