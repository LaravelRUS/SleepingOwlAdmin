<?php

namespace SleepingOwl\Admin;

use Orchestra\Testbench\TestCase;
use SleepingOwl\Admin\Providers\SleepingOwlServiceProvider;

class FirstTest extends TestCase
{
    public function setUp()
    {
        parent::setUp();
        $this->artisan('sleepingowl:install');
        $this->refreshApplication();
    }

    protected function getPackageProviders($app)
    {
        return [SleepingOwlServiceProvider::class];
    }

    /**
     * Define environment setup.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return void
     */
    protected function getEnvironmentSetUp($app)
    {
        $app['config']->set('sleeping_owl.bootstrapDirectory', __DIR__ . '/Admin');
    }

    public function test_application_should_started()
    {
        $this->visit('/admin')
            ->see($this->app->make('config')->get('sleeping_owl.title'))
            ->see('Dashboard')
            ->see('Define your dashboard here.');
    }
}