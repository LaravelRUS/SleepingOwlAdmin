<?php
namespace SleepingOwl\Tests;

use SleepingOwl\Admin\Providers\SleepingOwlServiceProvider;

/**
 * Class TestCase
 *
 * @package SleepingOwl
 * @subpackage Tests
 */
class TestCase extends \Orchestra\Testbench\TestCase
{
    /**
     * @inheritDoc
     */
    protected function getPackageProviders($app)
    {
        return [
            SleepingOwlServiceProvider::class,
        ];
    }
}