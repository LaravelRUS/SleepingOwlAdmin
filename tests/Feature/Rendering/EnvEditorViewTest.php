<?php

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use SleepingOwl\Tests\Helpers\InteractsWithJsonProps;

class EnvEditorViewTest extends TestCase
{
    use InteractsWithJsonProps;

    public function test_env_data_is_passed_as_escaped_json_props(): void
    {
        Route::post('/env-editor-contract', fn () => null)->name('admin.env.editor.post');
        $this->app['router']->getRoutes()->refreshNameLookups();
        $data = new Collection([
            'QUOTED"KEY' => (object) [
                'value' => '<script>alert("unsafe")</script>',
                'editable' => true,
                'deletable' => false,
            ],
        ]);

        $html = view('sleeping_owl::default.env_editor', compact('data'))->render();
        $props = $this->extractJsonProps($html);

        $this->assertSame('QUOTED"KEY', array_key_first($props['data']));
        $this->assertSame('<script>alert("unsafe")</script>', $props['data']['QUOTED"KEY']['value']);
        $this->assertStringNotContainsString('<script>alert("unsafe")</script>', $html);
    }

}
