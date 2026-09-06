<?php

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;

class EnvEditorViewTest extends TestCase
{
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
        $props = $this->extractProps($html);

        $this->assertSame('QUOTED"KEY', array_key_first($props['data']));
        $this->assertSame('<script>alert("unsafe")</script>', $props['data']['QUOTED"KEY']['value']);
        $this->assertStringNotContainsString('<script>alert("unsafe")</script>', $html);
    }

    private function extractProps(string $html): array
    {
        preg_match('/data-soa-vue-props="([^"]*)"/', $html, $matches);
        $this->assertArrayHasKey(1, $matches);

        $json = html_entity_decode($matches[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
    }
}
