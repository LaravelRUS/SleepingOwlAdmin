<?php

use SleepingOwl\Admin\Themes\TailwindTheme;

class ShadcnApplicationViewOverrideTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('view.paths', [
            __DIR__.'/../../Fixtures/application-views',
        ]);
        $app['config']->set('sleeping_owl.template', TailwindTheme::class);
    }

    public function test_finder_prefers_application_then_theme_then_base(): void
    {
        $finder = view()->getFinder();
        $fixtureRoot = realpath(__DIR__.'/../../Fixtures/application-views');
        $themeRoot = realpath(__DIR__.'/../../../resources/views/themes/shadcn');
        $baseRoot = realpath(__DIR__.'/../../../resources/views');

        $this->assertSame(
            $fixtureRoot.DIRECTORY_SEPARATOR.'vendor'.DIRECTORY_SEPARATOR.
                'sleeping_owl_shadcn'.DIRECTORY_SEPARATOR.'default'.DIRECTORY_SEPARATOR.
                '_layout'.DIRECTORY_SEPARATOR.'inner.blade.php',
            realpath($finder->find('sleeping_owl_shadcn::default._layout.inner'))
        );
        $this->assertSame(
            $themeRoot.DIRECTORY_SEPARATOR.'default'.DIRECTORY_SEPARATOR.
                '_layout'.DIRECTORY_SEPARATOR.'base.blade.php',
            realpath($finder->find('sleeping_owl_shadcn::default._layout.base'))
        );
        $this->assertSame(
            $baseRoot.DIRECTORY_SEPARATOR.'default'.DIRECTORY_SEPARATOR.
                '_partials'.DIRECTORY_SEPARATOR.'asset_health.blade.php',
            realpath($finder->find('sleeping_owl_shadcn::default._partials.asset_health'))
        );
        $this->assertSame(
            [
                $fixtureRoot.DIRECTORY_SEPARATOR.'vendor'.DIRECTORY_SEPARATOR.'sleeping_owl_shadcn',
                $themeRoot,
                $baseRoot,
            ],
            array_map('realpath', $finder->getHints()['sleeping_owl_shadcn'])
        );
    }

    public function test_template_resolves_the_application_override_through_the_existing_namespace(): void
    {
        $logical = app('sleeping_owl.template')->getViewPath('_layout.inner');
        $path = view()->getFinder()->find($logical);

        $this->assertSame('sleeping_owl_shadcn::default._layout.inner', $logical);
        $this->assertStringContainsString(
            'application-shadcn-override',
            file_get_contents($path)
        );
    }
}
