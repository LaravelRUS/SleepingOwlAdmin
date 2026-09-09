<?php

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\MessageBag;
use Illuminate\Support\ViewErrorBag;
use SleepingOwl\Admin\Themes\TailwindTheme;
use SleepingOwl\Tests\Helpers\InteractsWithJsonProps;

class TailwindThemeRemainingViewsTest extends TestCase
{
    use InteractsWithJsonProps;

    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', TailwindTheme::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Route::get('/env-editor', fn () => null)->name('admin.env.editor');
        Route::post('/env-editor', fn () => null)->name('admin.env.editor.post');
        $this->app['router']->getRoutes()->refreshNameLookups();
        config()->set([
            'sleeping_owl.ui.favicon' => null,
            'sleeping_owl.ui.scroll_to_bottom' => false,
            'sleeping_owl.ui.scroll_to_top' => false,
        ]);
    }

    public function test_tailwind_owns_every_legacy_logical_view(): void
    {
        $legacyRoot = realpath(__DIR__.'/../../../resources/views/themes/legacy/default');
        $tailwindRoot = realpath(__DIR__.'/../../../resources/views/themes/tailwind/default');
        $directory = new RecursiveDirectoryIterator($legacyRoot, FilesystemIterator::SKIP_DOTS);
        $views = [];

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if (! str_ends_with($file->getFilename(), '.blade.php')) {
                continue;
            }

            $relative = substr($file->getPathname(), strlen($legacyRoot) + 1);
            $logical = str_replace([DIRECTORY_SEPARATOR, '.blade.php'], ['.', ''], $relative);
            $resolved = view()->getFinder()->find(
                app('sleeping_owl.template')->getViewPath($logical)
            );

            $this->assertSame(
                realpath($tailwindRoot.DIRECTORY_SEPARATOR.$relative),
                realpath($resolved),
                $logical
            );
            $views[] = $logical;
        }

        $this->assertContains('dashboard', $views);
        $this->assertContains('env_editor', $views);
        $this->assertContains('pages.login', $views);
    }

    public function test_env_editor_and_login_receive_theme_classes_without_changing_contracts(): void
    {
        $data = new Collection([
            'APP_NAME' => (object) [
                'value' => 'Sleeping Owl',
                'editable' => true,
                'deletable' => false,
            ],
        ]);
        $envHtml = view(
            app('sleeping_owl.template')->getViewPath('env_editor'),
            compact('data')
        )->render();
        $envProps = $this->extractJsonProps($envHtml);
        $errors = (new ViewErrorBag())->put('default', new MessageBag([
            'username' => ['Unknown user'],
        ]));
        $login = app('sleeping_owl.template')->view('pages.login', [
            'errors' => $errors,
            'loginPostUrl' => '/admin/login',
            'title' => 'Sign in',
        ])->render();

        $this->assertSame('card soa-card soa-env-card', $envProps['classes']['card']);
        $this->assertSame('form-control env-key soa-input', $envProps['classes']['keyInput']);
        $this->assertSame('table table-striped soa-table soa-env-table', $envProps['classes']['table']);
        $this->assertStringContainsString('data-vue-component="env_editor"', $envHtml);
        $this->assertContainsAll($login, [
            'class="login-page soa-login-page"',
            'class="login-box card soa-card soa-login-card"',
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
}
