<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ViewErrorBag;
use Mockery as m;
use SleepingOwl\Admin\Facades\Admin as AdminFacade;
use SleepingOwl\Admin\Facades\Template as TemplateFacade;
use SleepingOwl\Tests\Helpers\InteractsWithJsonProps;

class ImagesViewTest extends TestCase
{
    use InteractsWithJsonProps;

    public function test_images_island_receives_escaped_typed_props(): void
    {
        $this->registerUploadRoute();
        $model = $this->model();
        $this->bindViewFacades($model);
        $html = view('sleeping_owl::default.form.element.images', $this->viewData($model))->render();
        $props = $this->extractJsonProps($html);

        $this->assertSame(['images/"first".svg<script>', 'images/second.svg'], $props['values']);
        $this->assertSame('https://cdn.example/"images/', $props['assetPrefix']);
        $this->assertSame(12, $props['maxFileSize']);
        $this->assertFalse($props['draggable']);
        $this->assertTrue($props['onlyLink']);
        $this->assertFalse($props['readonly']);
        $this->assertSame('/admin/products/image/gallery/7', $props['url']);
        $this->assertStringContainsString('style="max-width: 50rem"', $html);
        $this->assertStringNotContainsString('<script>', $html);
    }

    private function bindViewFacades(Model $model): void
    {
        $template = $this->getTemplateMock();
        $template->shouldReceive('getViewPath')->twice()->andReturnUsing(
            fn (string $path) => "sleeping_owl::default.{$path}"
        );
        TemplateFacade::swap($template);
        $section = m::mock();
        $section->shouldReceive('getAlias')->once()->andReturn('products');
        $admin = $this->getSleepingOwlMock();
        $admin->shouldReceive('getModel')->with($model)->andReturn($section);
        AdminFacade::swap($admin);
    }

    private function model(): Model
    {
        $model = m::mock(Model::class);
        $model->shouldReceive('getKey')->once()->andReturn(7);

        return $model;
    }

    private function registerUploadRoute(): void
    {
        Route::post('/{adminModel}/image/{field?}/{id?}', fn () => null)
            ->name('admin.form.element.image');
        $this->app['router']->getRoutes()->refreshNameLookups();
    }

    private function viewData(Model $model): array
    {
        return [
            'asset_prefix' => 'https://cdn.example/"images/',
            'class' => 'gallery-field',
            'draggable' => false,
            'errors' => new ViewErrorBag(),
            'helpText' => null,
            'label' => 'Gallery',
            'max_file_size' => 12.0,
            'model' => $model,
            'name' => 'gallery',
            'paste_only_link' => true,
            'path' => 'gallery',
            'readonly' => false,
            'required' => false,
            'style' => 'max-width: 50rem',
            'value' => ['images/"first".svg<script>', 'images/second.svg'],
            'visibled' => true,
        ];
    }
}
