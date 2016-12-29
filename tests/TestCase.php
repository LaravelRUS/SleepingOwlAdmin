<?php

use Mockery as m;
use Illuminate\Contracts\View\Factory as ViewFactory;
use SleepingOwl\Admin\Providers\SleepingOwlServiceProvider;

class TestCase extends Orchestra\Testbench\TestCase
{
    protected function getPackageProviders($app)
    {
        return [
            SleepingOwlServiceProvider::class,
        ];
    }

    /**
     * Define environment setup.
     *
     * @param  \Illuminate\Foundation\Application $app
     *
     * @return void
     */
    protected function getEnvironmentSetUp($app)
    {
        /** @var \Illuminate\Http\Request $request */
        $request = $app['request'];
        $request->setSession($session = m::mock(Illuminate\Session\Store::class));
    }

    protected function getPackageAliases($app)
    {
        return [

        ];
    }

    /**
     * @param string $url
     *
     * @return \Illuminate\Http\Request
     */
    public function getRequest($url = 'http://www.foo.com/hello/world')
    {
        $request = Illuminate\Http\Request::create($url);
        $request->headers->set('referer', 'http://www.site.com/hello/world');

        return $request;
    }

    /**
     * @return m\MockInterface|\Illuminate\Translation\Translator
     */
    public function getTranslatorMock()
    {
        return $this->app['translator'] = m::mock(\Illuminate\Translation\Translator::class);
    }

    /**
     * @return m\MockInterface|\Illuminate\Contracts\Routing\UrlGenerator
     */
    public function getRouterMock()
    {
        return $this->app['url'] = m::mock(\Illuminate\Contracts\Routing\UrlGenerator::class);
    }

    /**
     * @return m\MockInterface|ViewFactory
     */
    public function getViewMock()
    {
        $this->app->instance(ViewFactory::class, $mock = m::mock(ViewFactory::class));

        return $mock;
    }

    /**
     * @return m\MockInterface|Illuminate\Contracts\Cache\Repository
     */
    public function getCacheMock()
    {
        return $this->app['cache'] = m::mock(\Illuminate\Cache\CacheManager::class);
    }

    /**
     * @return m\MockInterface|\Illuminate\Config\Repository
     */
    public function getConfigMock()
    {
        return $this->app['config'] = m::mock(\Illuminate\Config\Repository::class);
    }

    /**
     * @return m\MockInterface|\DaveJamesMiller\Breadcrumbs\Manager
     */
    public function getBreadcrumbsMock()
    {
        return $this->app['breadcrumbs'] = m::mock(DaveJamesMiller\Breadcrumbs\Manager::class);
    }

    /**
     * @return m\MockInterface|\SleepingOwl\Admin\Contracts\TemplateInterface
     */
    public function getTemplateMock()
    {
        return $this->app['sleeping_owl.template'] = m::mock(\SleepingOwl\Admin\Contracts\TemplateInterface::class);
    }

    /**
     * @return m\MockInterface|\SleepingOwl\Admin\Contracts\TemplateInterface
     */
    public function getSleepingOwlMock()
    {
        return $this->app['sleeping_owl'] = m::mock(\SleepingOwl\Admin\Admin::class);
    }
}
