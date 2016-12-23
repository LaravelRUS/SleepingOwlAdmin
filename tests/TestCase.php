<?php

use Mockery as m;
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
    public function geRouterMock()
    {
        return $this->app['url'] = m::mock(\Illuminate\Contracts\Routing\UrlGenerator::class);
    }
}
