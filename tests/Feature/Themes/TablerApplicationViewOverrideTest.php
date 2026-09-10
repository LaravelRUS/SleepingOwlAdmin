<?php

class TablerApplicationViewOverrideTest extends TestCase
{
    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('view.paths', [
            __DIR__.'/../../Fixtures/application-views',
        ]);
        $app['config']->set('sleeping_owl.template.default', 'tabler');
    }

    public function test_application_override_precedes_sparse_theme_and_base_fallback(): void
    {
        $finder = view()->getFinder();
        $fixtureRoot = realpath(__DIR__.'/../../Fixtures/application-views');
        $themeRoot = realpath(__DIR__.'/../../../resources/views/themes/tabler');
        $baseRoot = realpath(__DIR__.'/../../../resources/views');

        $this->assertSame(
            $fixtureRoot.DIRECTORY_SEPARATOR.'vendor'.DIRECTORY_SEPARATOR.
                'sleeping_owl_tabler'.DIRECTORY_SEPARATOR.'default'.DIRECTORY_SEPARATOR.
                '_layout'.DIRECTORY_SEPARATOR.'inner.blade.php',
            realpath($finder->find('sleeping_owl_tabler::default._layout.inner'))
        );
        $this->assertSame(
            $baseRoot.DIRECTORY_SEPARATOR.'default'.DIRECTORY_SEPARATOR.
                '_partials'.DIRECTORY_SEPARATOR.'asset_health.blade.php',
            realpath($finder->find('sleeping_owl_tabler::default._partials.asset_health'))
        );
        $this->assertSame([
            $fixtureRoot.DIRECTORY_SEPARATOR.'vendor'.DIRECTORY_SEPARATOR.'sleeping_owl_tabler',
            $themeRoot,
            $baseRoot,
        ], array_map('realpath', $finder->getHints()['sleeping_owl_tabler']));
    }

    public function test_relative_and_fully_namespaced_views_keep_their_contracts(): void
    {
        $template = app('sleeping_owl.template');

        $this->assertSame(
            'sleeping_owl_tabler::default.display.table',
            $template->getViewPath('display.table')
        );
        $this->assertTrue(view()->exists($template->getViewPath('display.table')));
        $this->assertTrue(view()->exists('sleeping_owl::features.datatables.autoupdate'));
    }
}
