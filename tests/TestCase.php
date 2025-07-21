<?php

use Diglactic\Breadcrumbs\Manager as BreadcrumbsManager;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Translation\Translator;
use Mockery as m;
use SleepingOwl\Admin\Providers\SleepingOwlServiceProvider;

class TestCase extends Orchestra\Testbench\TestCase
{
    use \SleepingOwl\Tests\Helpers\FormHelpers;

    protected function getPackageProviders($app)
    {
        return [
            SleepingOwlServiceProvider::class,
        ];
    }

    /**
     * Define environment setup.
     *
     * @param  Application  $app
     * @return void
     */
    protected function getEnvironmentSetUp($app)
    {
        /** @var Request $request */
        $request = $app['request'];

        if (! version_compare($app->version(), '5.4', '>=')) {
            $request->setSession($session = m::mock(Illuminate\Session\Store::class));
        } else {
            $request->setLaravelSession($session = m::mock(Illuminate\Session\Store::class));
        }
    }

    protected function getPackageAliases($app)
    {
        return [

        ];
    }

    /**
     * @param  string  $url
     * @return Request
     */
    public function getRequest($url = 'http://www.foo.com/hello/world')
    {
        $request = Illuminate\Http\Request::create($url);
        $request->headers->set('referer', 'http://www.site.com/hello/world');

        return $request;
    }

    /**
     * @return m\MockInterface|Translator
     */
    public function getTranslatorMock()
    {
        /**
         * @nit Daan mock Facade Lang
         */
        if (version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=')) {
            return new Lang;
        }

        return $this->app['translator'] = m::mock(Translator::class);
    }

    /**
     * @return m\MockInterface|UrlGenerator
     */
    public function getRouterMock()
    {
        return $this->app['url'] = m::mock(UrlGenerator::class);
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
     * @return m\MockInterface|BreadcrumbsManager
     */
    public function getBreadcrumbsMock()
    {
        return $this->app['breadcrumbs'] = m::mock(BreadcrumbsManager::class);
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
