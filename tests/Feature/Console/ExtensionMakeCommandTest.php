<?php

use Illuminate\Contracts\Console\Kernel;
use SleepingOwl\Admin\Console\Commands\ExtensionMake;

final class ExtensionMakeCommandTest extends TestCase
{
    public function testExtensionGeneratorIsRegistered(): void
    {
        $commands = $this->app->make(Kernel::class)->all();

        $this->assertArrayHasKey('sleepingowl:extension:make', $commands);
        $this->assertInstanceOf(ExtensionMake::class, $commands['sleepingowl:extension:make']);
    }
}
