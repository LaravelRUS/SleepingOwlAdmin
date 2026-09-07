<?php

use Diglactic\Breadcrumbs\Manager as BreadcrumbsManager;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Mockery as m;
use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestRegistry;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\AssetProfileSelector;
use SleepingOwl\Admin\Providers\SleepingOwlServiceProvider;

class TestCase extends Orchestra\Testbench\TestCase
{
    use MockeryPHPUnitIntegration;
    use \SleepingOwl\Tests\Helpers\FormHelpers;

    /**
     * Services replaced by a test helper and restored before Testbench cleanup.
     *
     * @var array<string, mixed>
     */
    private array $replacedServices = [];

    protected function tearDown(): void
    {
        $this->restoreReplacedServices();

        parent::tearDown();
    }

    protected function getPackageProviders($app)
    {
        return [
            SleepingOwlServiceProvider::class,
            TestAssetManifestServiceProvider::class,
        ];
    }

    /**
     * Define environment setup.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return void
     */
    protected function getEnvironmentSetUp($app)
    {
        /** @var \Illuminate\Http\Request $request */
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
        /**
         * @nit Daan mock Facade Lang
         */
        if (version_compare(\Illuminate\Support\Facades\App::version(), '6.0', '>=')) {
            return new Lang;
        }

        return $this->app['translator'] = m::mock(\Illuminate\Translation\Translator::class);
    }

    /**
     * @return m\MockInterface|\Illuminate\Contracts\Routing\UrlGenerator
     */
    public function getRouterMock()
    {
        return $this->replaceService('url', m::mock(\Illuminate\Contracts\Routing\UrlGenerator::class));
    }

    /**
     * @return m\MockInterface|ViewFactory
     */
    public function getViewMock()
    {
        $mock = m::mock(ViewFactory::class);
        $this->replaceService(ViewFactory::class, $mock);

        return $mock;
    }

    /**
     * @return m\MockInterface|Illuminate\Contracts\Cache\Repository
     */
    public function getCacheMock()
    {
        return $this->replaceService('cache', m::mock(\Illuminate\Cache\CacheManager::class));
    }

    /**
     * @return m\MockInterface|\Illuminate\Config\Repository
     */
    public function getConfigMock()
    {
        return $this->replaceService('config', m::mock(\Illuminate\Config\Repository::class));
    }

    /**
     * @return m\MockInterface|BreadcrumbsManager
     */
    public function getBreadcrumbsMock()
    {
        return $this->replaceService('breadcrumbs', m::mock(BreadcrumbsManager::class));
    }

    /**
     * @return m\MockInterface|\SleepingOwl\Admin\Contracts\TemplateInterface
     */
    public function getTemplateMock()
    {
        return $this->replaceService(
            'sleeping_owl.template',
            m::mock(\SleepingOwl\Admin\Contracts\TemplateInterface::class)
        );
    }

    /**
     * @return m\MockInterface|\SleepingOwl\Admin\Contracts\TemplateInterface
     */
    public function getSleepingOwlMock()
    {
        return $this->replaceService('sleeping_owl', m::mock(\SleepingOwl\Admin\Admin::class));
    }

    /**
     * Replace one container service for a test without breaking Testbench cleanup.
     *
     * @template TMock of object
     *
     * @param  class-string|string  $abstract
     * @param  TMock  $mock
     * @return TMock
     */
    private function replaceService(string $abstract, object $mock): object
    {
        if (! array_key_exists($abstract, $this->replacedServices)) {
            $this->replacedServices[$abstract] = $this->app->make($abstract);
        }

        $this->app->instance($abstract, $mock);

        return $mock;
    }

    private function restoreReplacedServices(): void
    {
        foreach ($this->replacedServices as $abstract => $service) {
            $this->app->instance($abstract, $service);
        }

        $this->replacedServices = [];
    }
}

final class TestAssetManifestServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AssetManifest::class, function (Application $app) {
            return $app->make(AssetManifestLoader::class)->load(
                dirname(__DIR__).'/public/default/asset-manifest.json'
            );
        });

        $this->app->singleton(AssetManifestResolver::class, function (Application $app) {
            return new AssetManifestResolver(
                $app->make(AssetManifest::class),
                $app->make(UrlGenerator::class),
                'packages/sleepingowl/default',
                $app->make(AssetProfileSelector::class)->selected(),
                $app->make(AssetManifestRegistry::class)
            );
        });
    }
}
