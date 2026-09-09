<?php

use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Illuminate\Support\MessageBag;
use Illuminate\Support\ViewErrorBag;
use Mockery as m;
use PHPUnit\Framework\Attributes\DataProvider;
use SleepingOwl\Admin\Facades\Template as TemplateFacade;
use SleepingOwl\Admin\Widgets\Messages\ErrorMessages;
use SleepingOwl\Admin\Widgets\Messages\InfoMessages;
use SleepingOwl\Admin\Widgets\Messages\SuccessMessages;
use SleepingOwl\Admin\Widgets\Messages\WarningMessages;

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
            '<body class="soa-body contract-body">',
            '<div class="app-wrapper soa-app" id="vueApp">',
            '<nav class="app-header navbar navbar-expand bg-body soa-header">',
            '<aside class="app-sidebar main-sidebar shadow soa-sidebar" data-bs-theme="dark">',
            '<li data-contract="navigation">Navigation</li>',
            '<main class="app-main soa-main">',
            '<ol data-contract="breadcrumbs">Breadcrumbs</ol>',
            '<strong>Layout success</strong>',
            '<section data-contract="content">Body</section>',
            '<footer class="app-footer main-footer small soa-footer">',
            '<div class="soa-sidebar-overlay" id="sidebar-overlay"></div>',
            '<template data-tooltip-template>',
            '<div class="soa-tooltip" data-tooltip-popup role="tooltip">',
            '<span data-tooltip-content></span>',
            '<span data-contract="scripts"></span>',
        ]);
    }

    public function test_layout_uses_project_tooltip_template_override(): void
    {
        view()->prependNamespace(
            'sleeping_owl',
            __DIR__.'/../../Fixtures/views/tooltip-overrides'
        );
        $this->configureLayout();
        $this->bindLayoutMessages();
        $template = $this->bindLayoutTemplate();

        $html = view('sleeping_owl::default._layout.inner', [
            'breadcrumbKey' => 'tooltip-override',
            'content' => '<section>Body</section>',
            'template' => $template,
            'title' => 'Tooltip override',
        ])->render();

        $this->assertContainsAll($html, [
            '<aside class="project-tooltip-shell" data-tooltip-popup role="tooltip">',
            '<span class="project-tooltip-nesting">',
            '<strong data-tooltip-content></strong>',
        ]);
        $this->assertStringNotContainsString('<div data-tooltip-popup', $html);
    }

    public function test_scroll_controls_share_semantic_links_and_page_end_anchor(): void
    {
        config()->set([
            'sleeping_owl.ui.scroll_to_bottom' => true,
            'sleeping_owl.ui.scroll_to_top' => true,
        ]);

        $html = view('sleeping_owl::default.helper.scrolltotop')->render();

        $this->assertContainsAll($html, [
            'class="soa-scroll-control soa-scroll-control-top"',
            'id="scrolltotop" href="#vueApp" aria-label="Scroll to top"',
            'class="soa-scroll-control soa-scroll-control-bottom"',
            'id="scrolltobottom" href="#page-end" aria-label="Scroll to bottom"',
            '<span id="page-end" tabindex="-1"></span>',
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
            '<li class="nav-item soa-nav-item menu-open">',
            'class="nav-link soa-nav-link active has-child user-parent"',
            'data-contract="parent"',
            'aria-label="Catalog"',
            'aria-expanded="true"',
            'aria-haspopup="true"',
            'title="Catalog management screen"',
            '<span class="badge">7</span>',
            '<ul class="nav nav-treeview soa-nav-children">',
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
            '<li class="nav-item soa-nav-item">',
            'href="/admin/orders"',
            'class="nav-link soa-nav-link active user-attribute"',
            'data-contract="leaf"',
            '<p class="soa-nav-link-content">',
            'Orders',
        ]);
    }

    public function test_actions_form_view_keeps_wrapper_attributes(): void
    {
        $action = $this->renderable('<button data-contract="action">Run</button>');

        $html = view('sleeping_owl::features.display.actions_form', [
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

        $html = view('sleeping_owl::features.display.links', [
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
        $html = view('sleeping_owl::default.column.value', [
            'append' => null,
            'attributesArray' => [
                'class' => 'project-column',
                'data-label' => 'Sales & "support"',
                'aria-describedby' => 'sales-help',
                'style' => '--project-accent: #123456',
                'hidden' => 'hidden',
            ],
            'small' => null,
            'value' => '<strong>Sales</strong>',
            'visibled' => true,
            'escapeValue' => false,
        ])->render();

        $this->assertContainsAll($html, [
            'class="project-column"',
            'data-label="Sales &amp; &quot;support&quot;"',
            'aria-describedby="sales-help"',
            'style="--project-accent: #123456"',
            'hidden="hidden"',
            '<strong>Sales</strong>',
        ]);

        $escaped = view('sleeping_owl::default.column.value', [
            'append' => null,
            'attributesArray' => [],
            'small' => null,
            'value' => '<strong>Sales</strong>',
            'visibled' => true,
            'escapeValue' => true,
        ])->render();

        $this->assertStringContainsString('&lt;strong&gt;Sales&lt;/strong&gt;', $escaped);
    }

    public function test_native_filter_select_keeps_groups_and_a_zero_selection_in_both_themes(): void
    {
        $data = [
            'attributesArray' => ['data-filter' => 'active'],
            'default' => 0,
            'helpText' => null,
            'options' => ['Status' => [0 => 'No', 1 => 'Yes']],
            'visibled' => true,
            'width' => '',
        ];

        foreach (['sleeping_owl::default.column.filter.select', 'sleeping_owl_shadcn::default.column.filter.select'] as $view) {
            $html = view($view, $data)->render();

            $this->assertStringContainsString('<optgroup label="Status">', $html);
            $this->assertStringContainsString('value="0" selected>No</option>', $html);
            $this->assertStringContainsString('data-filter="active"', $html);
        }
    }

    public function test_email_column_renders_a_native_mailto_link_in_both_themes(): void
    {
        $data = [
            'append' => null,
            'attributesArray' => ['class' => 'project-email'],
            'small' => null,
            'value' => 'dev+alerts@example.test',
            'visibled' => true,
        ];

        foreach (['sleeping_owl::default.column.email', 'sleeping_owl_shadcn::default.column.email'] as $view) {
            $html = view($view, $data)->render();

            $this->assertStringContainsString(
                '<a href="mailto:dev+alerts@example.test">dev+alerts@example.test</a>',
                $html
            );
        }
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
            '<table class="table soa-table user-table" data-contract="display">',
            '<col width="120px"/>',
            '<th class="user-heading" data-sort="id">',
            '<span>ID</span>',
            '<td v-pre>',
            '<a data-contract="cell">1001</a>',
            '<div class="card-footer soa-card-footer">',
            '<nav data-contract="pagination">Next</nav>',
        ]);
    }

    #[DataProvider('messageContracts')]
    public function test_message_views_keep_type_icon_and_raw_content(
        string $class,
        string $sessionKey,
        string $alertClass,
        string $iconClass
    ): void {
        $session = $this->bindArraySession($sessionKey);
        $widget = new $class();
        $html = $widget->toHtml();

        $this->assertSame('_partials.message', $widget->getMessageView());
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
        yield 'success' => [SuccessMessages::class, 'success_message', 'alert-success', 'fa-check-circle'];
        yield 'warning' => [WarningMessages::class, 'warning_message', 'alert-warning', 'fa-exclamation-triangle'];
        yield 'info' => [InfoMessages::class, 'info_message', 'alert-info', 'fa-info'];
        yield 'error' => [ErrorMessages::class, 'error_message', 'alert-error alert-danger', 'fa-times'];
    }

    private function configureLayout(): void
    {
        config()->set([
            'sleeping_owl.ui.body_default_class' => 'contract-body',
            'sleeping_owl.datatables_settings.autoupdate' => [],
            'sleeping_owl.ui.favicon' => null,
            'sleeping_owl.ui.footer_text' => 'Contract footer',
            'sleeping_owl.ui.scroll_to_bottom' => false,
            'sleeping_owl.ui.scroll_to_top' => false,
            'sleeping_owl.ui.show_footer' => true,
            'sleeping_owl.ui.show_color_mode_toggle' => false,
            'sleeping_owl.ui.show_version' => true,
            'sleeping_owl.datatables_settings.state_datatables' => false,
            'sleeping_owl.datatables_settings.state_filters' => false,
            'sleeping_owl.datatables_settings.state_tabs' => false,
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
            'form-group soa-field form-element-text mb-3 has-error',
            'class="form-label control-label soa-label required"',
            '<span class="form-element-required soa-required">*</span>',
            'name="name"',
            'id="profile_name"',
            'class="form-control soa-input user-class"',
            'data-contract="kept"',
            'value="Alice &amp; Bob"',
            'readonly',
            'data-generate-length="16"',
            '<datalist id="profile_nameDatalist">',
            '<small class="form-element-helptext soa-help-text"><em>Public help</em></small>',
            '<ul class="form-element-errors soa-field-errors">',
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
        $column->shouldReceive('getHtmlAttribute')->once()->with('class')->andReturn(null);
        $column->shouldReceive('setModel')->once()->with($model);
        $column->shouldReceive('render')->once()->andReturn('<a data-contract="cell">1001</a>');

        return $column;
    }

    private function bindArraySession(string $sessionKey): Store
    {
        $session = new Store('render-contract', new ArraySessionHandler(120));
        $session->put($sessionKey, '<strong>Contract message</strong>');
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
