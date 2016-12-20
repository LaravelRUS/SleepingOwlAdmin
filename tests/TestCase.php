<?php

namespace SleepingOwl\Tests;

use SleepingOwl\Admin\Providers\SleepingOwlServiceProvider;

/**
 * Class TestCase.
 */
class TestCase extends \Orchestra\Testbench\TestCase
{
    /**
     * {@inheritdoc}
     */
    protected function getPackageProviders($app)
    {
        return [
            SleepingOwlServiceProvider::class,
        ];
    }
}
