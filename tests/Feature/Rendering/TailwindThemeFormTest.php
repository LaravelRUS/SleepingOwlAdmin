<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ViewErrorBag;
use Mockery as m;
use SleepingOwl\Admin\Facades\Admin as AdminFacade;
use SleepingOwl\Admin\Form\Related\Group;
use SleepingOwl\Admin\Themes\TailwindTheme;
use SleepingOwl\Tests\Helpers\InteractsWithJsonProps;

class TailwindThemeFormTest extends TestCase
{
    use InteractsWithJsonProps;

    protected function resolveApplicationConfiguration($app)
    {
        parent::resolveApplicationConfiguration($app);

        $app['config']->set('sleeping_owl.template', TailwindTheme::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        Route::post('/{adminModel}/file/{field?}/{id?}', fn () => null)
            ->name('admin.form.element.file');
        Route::post('/{adminModel}/image/{field?}/{id?}', fn () => null)
            ->name('admin.form.element.image');
        $this->app['router']->getRoutes()->refreshNameLookups();

        $section = m::mock();
        $section->shouldReceive('getAlias')->andReturn('products');
        $admin = $this->getSleepingOwlMock();
        $admin->shouldReceive('getModel')->andReturn($section);
        AdminFacade::swap($admin);
    }

    public function test_every_form_view_is_resolvable_and_primitives_are_theme_owned(): void
    {
        $baseRoot = realpath(__DIR__.'/../../../resources/views/default');
        $tailwindRoot = realpath(__DIR__.'/../../../resources/views/themes/shadcn/default');
        $directory = new RecursiveDirectoryIterator(
            $baseRoot.DIRECTORY_SEPARATOR.'form',
            FilesystemIterator::SKIP_DOTS
        );
        $views = [];

        foreach (new RecursiveIteratorIterator($directory) as $file) {
            if (! str_ends_with($file->getFilename(), '.blade.php')) {
                continue;
            }

            $relative = substr($file->getPathname(), strlen($baseRoot) + 1);
            $logical = str_replace([DIRECTORY_SEPARATOR, '.blade.php'], ['.', ''], $relative);
            $resolved = view()->getFinder()->find(
                app('sleeping_owl.template')->getViewPath($logical)
            );
            $override = $tailwindRoot.DIRECTORY_SEPARATOR.$relative;
            $expected = is_file($override) ? $override : $file->getPathname();

            $this->assertSame(
                realpath($expected),
                realpath($resolved),
                $logical
            );
            $views[] = $logical;
        }

        $this->assertCount(46, $views);

        foreach ([
            'attachment',
            'card',
            'dialog',
            'field',
            'input-group',
            'label',
            'progress',
            'radio-group',
            'skeleton',
            'spinner',
            'switch',
            'textarea',
        ] as $primitive) {
            $this->assertTrue(
                view()->exists("sleeping_owl_shadcn::components.ui.{$primitive}"),
                $primitive
            );
        }
    }

    public function test_native_controls_keep_names_states_user_attributes_and_date_hooks(): void
    {
        $errors = new ViewErrorBag();
        $text = $this->render('form.element.text', [
            'attributesArray' => [
                'class' => 'project-input',
                'data-contract' => 'title',
                'id' => 'title',
                'name' => 'title',
                'required' => true,
            ],
            'canGenerate' => false,
            'datalistOptions' => null,
            'errors' => $errors,
            'generateChars' => null,
            'generateLength' => 12,
            'helpText' => 'Public title',
            'id' => 'title',
            'label' => 'Title',
            'name' => 'title',
            'readonly' => true,
            'required' => true,
            'value' => 'Quarterly report',
            'visibled' => true,
        ]);
        $checkbox = $this->render('form.element.checkbox', [
            'attributesArray' => [
                'class' => 'project-checkbox',
                'data-contract' => 'published',
                'id' => 'published',
                'name' => 'published',
            ],
            'class' => null,
            'errors' => $errors,
            'helpText' => null,
            'label' => 'Published',
            'name' => 'published',
            'readonly' => true,
            'required' => true,
            'style' => null,
            'value' => true,
            'visibled' => true,
        ]);
        $date = $this->render('form.element.date', [
            'attributesArray' => [
                'class' => 'project-date',
                'data-date-format' => 'Y-m-d',
                'data-date-picker' => 'date',
                'id' => 'published_at',
                'name' => 'published_at',
                'required' => true,
            ],
            'errors' => $errors,
            'helpText' => null,
            'label' => 'Published at',
            'name' => 'published_at',
            'readonly' => false,
            'required' => true,
            'value' => '2026-09-08',
            'visibled' => true,
        ]);
        $textarea = $this->render('form.element.textarea', [
            'attributesArray' => [
                'class' => 'project-textarea',
                'data-contract' => 'notes',
                'id' => 'notes',
                'name' => 'notes',
            ],
            'errors' => $errors,
            'helpText' => null,
            'label' => 'Notes',
            'name' => 'notes',
            'readonly' => false,
            'required' => false,
            'value' => 'Keep me',
            'visibled' => true,
        ]);
        $request = Request::create('/admin/products/7');
        $request->setLaravelSession(
            new Store('tailwind-form', new ArraySessionHandler(120))
        );
        $this->app->instance('request', $request);
        $wysiwyg = $this->render('form.element.wysiwyg_without_card', [
            'attributesArray' => [
                'class' => 'project-editor',
                'data-wysiwyg-init' => 'ckeditor5',
                'data-wysiwyg-type' => 'ckeditor5',
                'id' => 'body',
                'name' => 'body',
            ],
            'errors' => $errors,
            'helpText' => null,
            'label' => 'Body',
            'name' => 'body',
            'required' => false,
            'value' => '<p>Body</p>',
            'visibled' => true,
        ]);

        $this->assertContainsAll($text, [
            'class="form-control soa-input project-input"',
            'data-contract="title"',
            'id="title"',
            'name="title"',
            'required="required"',
            'readonly',
            'value="Quarterly report"',
        ]);
        $this->assertContainsAll($checkbox, [
            'form-check-input soa-choice-control project-checkbox',
            'data-contract="published"',
            'name="published"',
            'disabled="disabled"',
            'checked="checked"',
        ]);
        $this->assertContainsAll($date, [
            'form-control soa-input project-date',
            'data-date-format="Y-m-d"',
            'data-date-picker="date"',
            'name="published_at"',
            'value="2026-09-08"',
            'soa-input-addon',
        ]);
        $this->assertContainsAll($textarea, [
            'class="form-control soa-textarea project-textarea"',
            'data-contract="notes"',
            'name="notes"',
            '>Keep me</textarea>',
        ]);
        $this->assertContainsAll($wysiwyg, [
            'class="soa-textarea project-editor"',
            'data-wysiwyg-init="ckeditor5"',
            'data-wysiwyg-type="ckeditor5"',
            'name="body"',
            '&lt;p&gt;Body&lt;/p&gt;',
        ]);
    }

    public function test_select_and_upload_islands_receive_tailwind_classes_from_blade(): void
    {
        $select = $this->render('form.element.select', [
            'attributesArray' => [
                'class' => 'project-select',
                'id' => 'status',
                'name' => 'status',
                'required' => true,
            ],
            'errors' => new ViewErrorBag(),
            'helpText' => null,
            'id' => 'status',
            'label' => 'Status',
            'limit' => 0,
            'name' => 'status',
            'options' => [['id' => 1, 'text' => 'Ready']],
            'readonly' => false,
            'required' => true,
            'value' => 1,
            'visibled' => true,
        ]);
        $selectProps = $this->extractJsonProps($select);
        $model = $this->model();
        $fileProps = $this->extractJsonProps($this->render(
            'form.element.file',
            $this->fileData($model)
        ));
        $imageProps = $this->extractJsonProps($this->render(
            'form.element.image',
            $this->imageData($model)
        ));
        $imagesProps = $this->extractJsonProps($this->render(
            'form.element.images',
            $this->imagesData($model)
        ));

        $this->assertSame('form-control soa-select project-select', $selectProps['attributes']['class']);
        $this->assertSame('status', $selectProps['attributes']['name']);
        $this->assertTrue($selectProps['required']);
        $this->assertSame('soa-field-error', $selectProps['classes']['required']);
        $this->assertStringContainsString('soa-attachment-list', $fileProps['classes']['current']);
        $this->assertStringContainsString('soa-button-primary', $fileProps['classes']['uploadButton']);
        $this->assertStringContainsString('soa-attachment-preview', $imageProps['classes']['previewLink']);
        $this->assertStringContainsString('soa-images-dialog', $imagesProps['classes']['dialog']);
        $this->assertStringContainsString('soa-images__grid', $imagesProps['classes']['gallery']);
    }

    public function test_related_and_multiple_file_contracts_keep_hooks(): void
    {
        $group = (new Group(null, ['<input name="items[42][title]">']))
            ->setPrimary('42')
            ->setLabel('Saved item');
        $related = $this->render('form.element.related.inner_element', [
            'deletable' => true,
            'draggable' => true,
            'groups' => new Collection([$group]),
            'limit' => 3,
            'name' => 'items',
            'readonly' => false,
            'remove' => new Collection([7]),
            'stub' => new Collection(['<input name="image">']),
        ]);
        $relatedProps = $this->extractReferencedJsonProps($related);
        $files = $this->render('form.element.files', [
            'class' => null,
            'description_required' => false,
            'draggable' => true,
            'errors' => new ViewErrorBag(),
            'files_group_class' => 'project-files',
            'helpText' => null,
            'id' => 'attachments',
            'label' => 'Attachments',
            'model' => $this->model(),
            'name' => 'attachments',
            'path' => 'attachments',
            'readonly' => false,
            'required' => false,
            'show_description' => true,
            'show_original_name' => true,
            'show_title' => true,
            'style' => null,
            'title_required' => false,
            'value' => [],
            'visibled' => true,
        ]);

        $this->assertSame('grouped-elements clearfix soa-related', $relatedProps['classes']['root']);
        $this->assertSame('related-elements__draggable soa-related-groups', $relatedProps['classes']['groups']);
        $this->assertStringContainsString('soa-button-success', $relatedProps['classes']['add']);
        $this->assertContainsAll($files, [
            'fileUploadMultiple',
            'class="RenderFile"',
            'fileThumbnail soa-attachment',
            'fileRemove soa-button',
            'files-group dropzone soa-attachment-list project-files',
            'class="btn btn-primary fileBrowse',
            'class="fileValue"',
            'data-id="file"',
            'data-target=',
            'data-token=',
            'data-lightbox',
        ]);
    }

    public function test_form_shell_keeps_csrf_redirect_method_and_consumer_attributes(): void
    {
        $html = $this->render('form.card', [
            'attributesArray' => [
                'action' => '/admin/products/7',
                'class' => 'project-form',
                'data-contract' => 'edit',
                'method' => 'post',
            ],
            'backUrl' => '/admin/products',
            'buttons' => '<button type="submit">Save</button>',
            'cardClass' => 'project-card',
            'items' => [],
        ]);

        $this->assertContainsAll($html, [
            'class="card soa-card project-card project-form"',
            'action="/admin/products/7"',
            'data-contract="edit"',
            'name="_method" value="post"',
            'name="_redirectBack" value="/admin/products"',
            'name="_token"',
        ]);
    }

    private function render(string $logical, array $data): string
    {
        return view(app('sleeping_owl.template')->getViewPath($logical), $data)->render();
    }

    private function model(): Model
    {
        $model = new class extends Model {};
        $model->setAttribute($model->getKeyName(), 7);

        return $model;
    }

    private function fileData(Model $model): array
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
            'value' => 'documents/report.pdf',
            'visibled' => true,
        ];
    }

    private function imageData(Model $model): array
    {
        return [
            'asset_prefix' => '/storage/',
            'class' => null,
            'errors' => new ViewErrorBag(),
            'helpText' => null,
            'label' => 'Avatar',
            'max_file_size' => 12.0,
            'model' => $model,
            'name' => 'avatar',
            'paste_only_link' => false,
            'path' => 'avatar',
            'readonly' => false,
            'required' => false,
            'value' => 'images/avatar.jpg',
            'visibled' => true,
        ];
    }

    private function imagesData(Model $model): array
    {
        return [
            'asset_prefix' => '/storage/',
            'class' => null,
            'draggable' => true,
            'errors' => new ViewErrorBag(),
            'helpText' => null,
            'label' => 'Gallery',
            'max_file_size' => 12.0,
            'model' => $model,
            'name' => 'gallery',
            'paste_only_link' => false,
            'path' => 'gallery',
            'readonly' => false,
            'required' => false,
            'style' => null,
            'value' => ['images/first.jpg'],
            'visibled' => true,
        ];
    }

    private function assertContainsAll(string $html, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $html);
        }
    }
}
