<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ViewErrorBag;
use Mockery as m;
use SleepingOwl\Admin\Facades\Admin as AdminFacade;
use SleepingOwl\Admin\Facades\Template as TemplateFacade;
use SleepingOwl\Tests\Helpers\InteractsWithJsonProps;

class FileViewTest extends TestCase
{
    use InteractsWithJsonProps;

    public function test_file_island_receives_escaped_typed_props(): void
    {
        $this->registerUploadRoute();
        $model = $this->model();
        $this->bindViewFacades($model);
        $html = view('sleeping_owl::default.form.element.file', $this->viewData($model))->render();
        $props = $this->extractJsonProps($html);

        $this->assertSame('documents/"report".pdf<script>', $props['value']);
        $this->assertSame(12, $props['maxFileSize']);
        $this->assertFalse($props['readonly']);
        $this->assertSame('/admin/products/file/document/7', $props['url']);
        $this->assertSame('alert alert-warning', $props['classes']['alert']);
        $this->assertSame('fas fa-file-upload', $props['classes']['uploadIcon']);
        $this->assertSame('fas fa-spinner fa-spin', $props['classes']['uploadingIcon']);
        $this->assertStringNotContainsString('<script>', $html);
    }

    public function test_file_island_accepts_concrete_theme_classes(): void
    {
        $this->registerUploadRoute();
        $model = $this->model();
        $this->bindViewFacades($model);
        $fileExtraProps = [
            'classes' => [
                'alert' => 'project-alert',
                'current' => 'project-current',
                'downloadButton' => 'project-download',
                'removeButton' => 'project-remove',
                'uploadButton' => 'project-upload',
                'uploadIcon' => 'project-upload-icon',
                'uploadingIcon' => 'project-uploading-icon',
            ],
        ];
        $html = view(
            'sleeping_owl::default.form.element.file',
            $this->viewData($model) + compact('fileExtraProps')
        )->render();
        $props = $this->extractJsonProps($html);

        $this->assertSame($fileExtraProps['classes'], $props['classes']);
        $this->assertStringNotContainsString('class="project-alert"', $html);
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
        Route::post('/{adminModel}/file/{field?}/{id?}', fn () => null)
            ->name('admin.form.element.file');
        $this->app['router']->getRoutes()->refreshNameLookups();
    }

    private function viewData(Model $model): array
    {
        return [
            'class' => null,
            'errors' => new ViewErrorBag(),
            'helpText' => null,
            'label' => 'Document',
            'max_file_size' => 12.0,
            'model' => $model,
            'name' => 'document',
            'path' => 'document',
            'readonly' => false,
            'required' => false,
            'style' => null,
            'value' => 'documents/"report".pdf<script>',
            'visibled' => true,
        ];
    }
}
