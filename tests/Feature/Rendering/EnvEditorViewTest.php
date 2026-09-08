<?php

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use SleepingOwl\Tests\Helpers\InteractsWithJsonProps;

class EnvEditorViewTest extends TestCase
{
    use InteractsWithJsonProps;

    public function test_env_data_is_passed_as_escaped_json_props(): void
    {
        $this->registerPostRoute();
        $data = $this->envData();

        $html = view('sleeping_owl::default.env_editor', compact('data'))->render();
        $props = $this->extractJsonProps($html);

        $this->assertSame('QUOTED"KEY', array_key_first($props['data']));
        $this->assertSame('<script>alert("unsafe")</script>', $props['data']['QUOTED"KEY']['value']);
        $this->assertSame('card', $props['classes']['card']);
        $this->assertSame('row-link align-middle', $props['classes']['removeCell']);
        $this->assertSame('fas fa-check', $props['classes']['saveIcon']);
        $this->assertStringNotContainsString('<script>alert("unsafe")</script>', $html);
    }

    public function test_env_editor_accepts_concrete_theme_classes(): void
    {
        $this->registerPostRoute();
        $data = $this->envData();
        $envEditorExtraProps = [
            'classes' => [
                'addButton' => 'project-add',
                'card' => 'project-card',
                'keyInput' => 'project-key',
                'removeButton' => 'project-remove',
                'row' => 'project-row',
                'saveButton' => 'project-save',
                'table' => 'project-table',
                'valueInput' => 'project-value',
            ],
        ];
        $html = view(
            'sleeping_owl::default.env_editor',
            compact('data', 'envEditorExtraProps')
        )->render();
        $props = $this->extractJsonProps($html);

        $this->assertSame($envEditorExtraProps['classes'], $props['classes']);
        $this->assertStringNotContainsString('class="project-card"', $html);
    }

    private function registerPostRoute(): void
    {
        Route::post('/env-editor-contract', fn () => null)->name('admin.env.editor.post');
        $this->app['router']->getRoutes()->refreshNameLookups();
    }

    private function envData(): Collection
    {
        return new Collection([
            'QUOTED"KEY' => (object) [
                'value' => '<script>alert("unsafe")</script>',
                'editable' => true,
                'deletable' => false,
            ],
        ]);
    }
}
