<?php

use Illuminate\Support\Facades\Route;
use SleepingOwl\Admin\Http\Controllers\AdminController;

class EnvEditorRemovalTest extends TestCase
{
    public function test_package_no_longer_exposes_an_env_editor(): void
    {
        $this->assertArrayNotHasKey('env', config('sleeping_owl'));
        $this->assertFalse(Route::has('admin.env.editor'));
        $this->assertFalse(Route::has('admin.env.editor.post'));

        $controller = new ReflectionClass(AdminController::class);
        $this->assertFalse($controller->hasMethod('getEnvEditor'));
        $this->assertFalse($controller->hasMethod('postEnvEditor'));
    }
}
