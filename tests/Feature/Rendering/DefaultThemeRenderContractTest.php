<?php

use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Illuminate\Support\MessageBag;
use Illuminate\Support\ViewErrorBag;
use Mockery as m;
use PHPUnit\Framework\Attributes\DataProvider;
use SleepingOwl\Admin\Facades\Template as TemplateFacade;

class DefaultThemeRenderContractTest extends TestCase
{
    public function test_layout_keeps_default_theme_structure_and_navigation_slots(): void
    {
        $this->configureLayout();
        $this->bindLayoutMessages();
        $template = $this->bindLayoutTemplate();

        $html = view('sleeping_owl::default._layout.inner', [
            'breadcrumbKey' => 'render-contract',
            'content' => '<section data-contract="content">Body</section>',
            'template' => $template,
            'title' => 'Render contract',
        ])->render();

        $this->assertContainsAll($html, [
            '<meta data-contract="meta">',
            '<body class="contract-body">',
            '<div class="wrapper" id="vueApp">',
            '<nav class="main-header navbar navbar-expand border-bottom">',
            '<aside class="main-sidebar sidebar-dark-primary elevation-4">',
            '<li data-contract="navigation">Navigation</li>',
            '<div class="content-wrapper">',
            '<ol data-contract="breadcrumbs">Breadcrumbs</ol>',
            '<strong>Layout success</strong>',
            '<section data-contract="content">Body</section>',
            '<footer class="main-footer small">',
            '<span data-contract="scripts"></span>',
        ]);
    }

    public function test_navigation_parent_keeps_nested_active_state_and_attributes(): void
    {
        $badge = $this->renderable('<span class="badge">7</span>');
        $child = $this->renderable('<li data-contract="child">Child</li>');

        $html = $this->renderNavigationPage([
            'attributesArray' => [
                'class' => 'user-parent',
                'data-contract' => 'parent',
                'aria-label' => 'Catalog',
            ],
            'badges' => collect([$badge]),
            'hasChild' => true,
            'icon' => '<i class="contract-icon"></i>',
            'isActive' => true,
            'pages' => [$child],
            'title' => 'Catalog management screen',
            'url' => '/unused',
        ]);

        $this->assertContainsAll($html, [
            '<li class="nav-item has-treeview menu-open">',
            'class="nav-link active has-child user-parent"',
            'data-contract="parent"',
            'aria-label="Catalog"',
            'title="Catalog management screen"',
            '<span class="badge">7</span>',
            '<ul class="nav nav-treeview">',
            '<li data-contract="child">Child</li>',
        ]);
    }

    public function test_navigation_leaf_keeps_url_active_state_and_user_classes(): void
    {
        $html = $this->renderNavigationPage([
            'attributesArray' => [
                'class' => 'user-attribute',
                'data-contract' => 'leaf',
            ],
            'badges' => collect(),
            'hasChild' => false,
            'icon' => '',
            'isActive' => true,
            'pages' => [],
            'title' => 'Orders',
            'url' => '/admin/orders',
        ]);

        $this->assertContainsAll($html, [
            '<li class="nav-item">',
            'href="/admin/orders"',
            'class="nav-link active user-attribute"',
            'data-contract="leaf"',
            '<p class="">',
            'Orders',
        ]);
    }

    public function test_actions_form_view_keeps_wrapper_attributes(): void
    {
        $action = $this->renderable('<button data-contract="action">Run</button>');

        $html = view('sleeping_owl::default.display.extensions.actions_form', [
            'action_form' => collect([$action]),
            'attributesArray' => [
                'class' => 'project-actions',
                'data-placement' => 'heading',
                'aria-label' => 'Actions',
            ],
        ])->render();

        $this->assertContainsAll($html, [
            'class="project-actions"',
            'data-placement="heading"',
            'aria-label="Actions"',
            '<button data-contract="action">Run</button>',
        ]);
    }

    public function test_links_view_keeps_wrapper_and_link_attributes(): void
    {
        $link = \SleepingOwl\Admin\Display\Link::create('/catalog', 'Catalog');
        $link->setHtmlAttributes([
            'class' => 'project-link',
            'data-link-id' => 'catalog',
        ]);

        $html = view('sleeping_owl::default.display.extensions.links', [
            'attributesArray' => [
                'class' => 'project-links',
                'aria-label' => 'Catalog links',
            ],
            'links' => [$link],
        ])->render();

        $this->assertContainsAll($html, [
            'class="project-links"',
            'aria-label="Catalog links"',
            'class="project-link"',
            'data-link-id="catalog"',
            'href="/catalog"',
        ]);
    }

    public function test_simple_column_keeps_arbitrary_and_boolean_attributes(): void
    {
        $html = view('sleeping_owl::default.column.text', [
            'append' => null,
            'attributesArray' => [
                'class' => 'project-column',
                'data-label' => 'Sales & "support"',
                'aria-describedby' => 'sales-help',
                'style' => '--project-accent: #123456',
                'hidden' => 'hidden',
            ],
            'small' => null,
            'value' => 'Sales',
            'visibled' => true,
        ])->render();

        $this->assertContainsAll($html, [
            'class="project-column"',
            'data-label="Sales &amp; &quot;support&quot;"',
            'aria-describedby="sales-help"',
            'style="--project-accent: #123456"',
            'hidden="hidden"',
            'Sales',
        ]);
    }

    public function test_text_form_element_keeps_attributes_help_and_validation_markup(): void
    {
        $this->bindViewPathTemplate();
        $html = view(
            'sleeping_owl::default.form.element.text',
            $this->textElementData()
        )->render();

        $this->assertContainsAll($html, $this->textElementContract());
    }

    public function test_table_display_keeps_columns_rows_attributes_and_pagination(): void
    {
        $model = (object) ['id' => 1001];
        $column = $this->tableColumn($model);

        $html = view('sleeping_owl::default.display.extensions.columns', [
            'attributesArray' => [
                'class' => 'user-table',
                'data-contract' => 'display',
            ],
            'collection' => [$model],
            'columns' => [$column],
            'pagination' => '<nav data-contract="pagination">Next</nav>',
        ])->render();

        $this->assertContainsAll($html, [
            '<table class="table user-table" data-contract="display">',
            '<col width="120px"/>',
            '<th class="user-heading" data-sort="id">',
            '<span>ID</span>',
            '<td v-pre>',
            '<a data-contract="cell">1001</a>',
            '<div class="panel-footer">',
            '<nav data-contract="pagination">Next</nav>',
        ]);
    }

    #[DataProvider('messageContracts')]
    public function test_message_views_keep_type_icon_and_raw_content(
        string $type,
        string $sessionKey,
        string $alertClass,
        string $iconClass
    ): void {
        $session = $this->bindArraySession($sessionKey);
        $html = view("sleeping_owl::default._partials.messages.{$type}", [
            'messages' => '<strong>Contract message</strong>',
        ])->render();

        $this->assertContainsAll($html, [
            "alert {$alertClass} alert-message",
            $iconClass,
            '<strong>Contract message</strong>',
            'data-dismiss="alert"',
        ]);
        $this->assertFalse($session->has($sessionKey));
    }

    public static function messageContracts(): iterable
    {
        yield 'success' => ['success', 'success_message', 'alert-success', 'fa-check-circle'];
        yield 'warning' => ['warning', 'warning_message', 'alert-warning', 'fa-exclamation-triangle'];
        yield 'info' => ['info', 'info_message', 'alert-info', 'fa-info'];
        yield 'error' => ['error', 'error_message', 'alert-error alert-danger', 'fa-times'];
    }

    private function configureLayout(): void
    {
        config()->set([
            'sleeping_owl.body_default_class' => 'contract-body',
            'sleeping_owl.dt_autoupdate' => false,
            'sleeping_owl.favicon' => null,
            'sleeping_owl.footer_text' => 'Contract footer',
            'sleeping_owl.scroll_to_bottom' => false,
            'sleeping_owl.scroll_to_top' => false,
            'sleeping_owl.show_footer' => true,
            'sleeping_owl.show_mode' => false,
            'sleeping_owl.show_version' => true,
            'sleeping_owl.state_datatables' => false,
            'sleeping_owl.state_filters' => false,
            'sleeping_owl.state_tabs' => false,
            'sleeping_owl.url_prefix' => 'admin',
        ]);
    }

    private function bindLayoutTemplate(): DefaultThemeContractTemplateStub
    {
        return $this->bindViewPathTemplate();
    }

    private function bindViewPathTemplate(): DefaultThemeContractTemplateStub
    {
        $template = new DefaultThemeContractTemplateStub();
        $this->app->instance('sleeping_owl.template', $template);
        TemplateFacade::swap($template);

        return $template;
    }

    private function renderNavigationPage(array $data): string
    {
        return view('sleeping_owl::default._partials.navigation.page', $data)->render();
    }

    private function renderable(string $html)
    {
        $renderable = m::mock();
        $renderable->shouldReceive('render')->once()->andReturn($html);

        return $renderable;
    }

    private function validationErrors(string $key, string $message): ViewErrorBag
    {
        $errors = new ViewErrorBag();
        $errors->put('default', new MessageBag([$key => [$message]]));

        return $errors;
    }

    private function textElementData(): array
    {
        return [
            'attributesArray' => [
                'name' => 'name',
                'id' => 'profile_name',
                'class' => 'user-class',
                'data-contract' => 'kept',
            ],
            'canGenerate' => true,
            'datalistOptions' => ['Alice', 'Bob'],
            'errors' => $this->validationErrors('name', 'Name is required'),
            'generateChars' => true,
            'generateLength' => 16,
            'helpText' => '<em>Public help</em>',
            'id' => 'profile_name',
            'label' => '<strong>Name</strong>',
            'name' => 'name',
            'readonly' => true,
            'required' => true,
            'value' => 'Alice & Bob',
            'visibled' => true,
        ];
    }

    private function textElementContract(): array
    {
        return [
            'form-group form-element-text has-error',
            'class="control-label required"',
            '<span class="form-element-required">*</span>',
            'name="name"',
            'id="profile_name"',
            'class="form-control user-class"',
            'data-contract="kept"',
            'value="Alice &amp; Bob"',
            'readonly',
            'data-generate-length="16"',
            '<datalist id="profile_nameDatalist">',
            '<small class="form-element-helptext"><em>Public help</em></small>',
            '<ul class="form-element-errors">',
            '<li>Name is required</li>',
        ];
    }

    private function tableColumn(object $model)
    {
        $header = m::mock();
        $header->shouldReceive('getHtmlAttributes')->once()->andReturn([
            'class' => 'user-heading',
            'data-sort' => 'id',
        ]);
        $header->shouldReceive('render')->once()->andReturn('<span>ID</span>');

        $column = m::mock();
        $column->shouldReceive('getWidth')->once()->andReturn('120px');
        $column->shouldReceive('getHeader')->twice()->andReturn($header);
        $column->shouldReceive('setModel')->once()->with($model);
        $column->shouldReceive('render')->once()->andReturn('<a data-contract="cell">1001</a>');

        return $column;
    }

    private function bindArraySession(string $sessionKey): Store
    {
        $session = new Store('render-contract', new ArraySessionHandler(120));
        $session->put($sessionKey, 'Contract message');
        $this->app->instance('session', $session);

        return $session;
    }

    private function bindLayoutMessages(): void
    {
        $session = new Store('render-contract', new ArraySessionHandler(120));
        $session->put('error_message', '<strong>Layout error</strong>');
        $session->put('info_message', '<strong>Layout info</strong>');
        $session->put('success_message', '<strong>Layout success</strong>');
        $session->put('warning_message', '<strong>Layout warning</strong>');
        $this->app->instance('session', $session);
    }

    private function assertContainsAll(string $html, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $html);
        }
    }
}

class DefaultThemeContractTemplateStub
{
    public function getViewPath(string $view): string
    {
        return "sleeping_owl::default.{$view}";
    }

    public function view(string $view, array $data = [])
    {
        $data['template'] = $this;

        return view($this->getViewPath($view), $data);
    }

    public function renderMeta(string $title): string
    {
        return '<meta data-contract="meta">';
    }

    public function renderBreadcrumbs(string $key): string
    {
        return '<ol data-contract="breadcrumbs">Breadcrumbs</ol>';
    }

    public function renderNavigation(): string
    {
        return '<li data-contract="navigation">Navigation</li>';
    }

    public function getLogo(): string
    {
        return '<span>Logo</span>';
    }

    public function getLogoMini(): string
    {
        return 'SO';
    }

    public function getMenuTop(): string
    {
        return 'Menu';
    }

    public function getVersion(): string
    {
        return 'v-test';
    }

    public function meta(): DefaultThemeContractMetaStub
    {
        return new DefaultThemeContractMetaStub();
    }
}

class DefaultThemeContractMetaStub
{
    public function renderScripts(bool $footer): string
    {
        return '<span data-contract="scripts"></span>';
    }
}
