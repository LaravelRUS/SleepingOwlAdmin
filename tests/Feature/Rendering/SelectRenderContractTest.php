<?php

use Illuminate\Support\ViewErrorBag;
use SleepingOwl\Admin\Facades\Template as TemplateFacade;

class SelectRenderContractTest extends TestCase
{
    public function test_single_select_renders_typed_props_and_unmodified_attributes(): void
    {
        $html = $this->renderSelect('select', $this->singleSelectData());
        $props = $this->extractIslandProps($html);

        $this->assertIslandHost($html);
        $this->assertFalse($props['multiple']);
        $this->assertSame(2, $props['value']);
        $this->assertNull($props['options'][0]['id']);
        $this->assertSame('2', $props['options'][2]['id']);
        $this->assertSame('form-control soa-select project-select', $props['attributes']['class']);
        $this->assertSame('Sales & "support"', $props['attributes']['data-contract']);
        $this->assertSame('text-danger pt-2 pb-3 soa-field-error', $props['classes']['required']);
    }

    public function test_multiselect_renders_limits_taggable_state_and_array_value(): void
    {
        $html = $this->renderSelect('multiselect', $this->multipleSelectData());
        $props = $this->extractIslandProps($html);

        $this->assertIslandHost($html);
        $this->assertTrue($props['multiple']);
        $this->assertTrue($props['required']);
        $this->assertTrue($props['readonly']);
        $this->assertTrue($props['taggable']);
        $this->assertSame(2, $props['limit']);
        $this->assertSame(4, $props['max']);
        $this->assertSame([1, '3'], $props['value']);
        $this->assertSame('categories[]', $props['attributes']['name']);
        $this->assertSame('disabled', $props['attributes']['disabled']);
    }

    public function test_ajax_select_renders_remote_configuration_as_inert_props(): void
    {
        $data = array_replace($this->baseData(), [
            'attributesArray' => [
                'class' => 'project-ajax-select',
                'id' => 'project',
                'name' => 'project',
            ],
            'limit' => 0,
            'max' => 0,
            'name' => 'project',
            'options' => [['id' => 7, 'text' => 'Current project']],
            'remoteSelect' => [
                'delay' => 250,
                'dependencies' => ['country'],
                'minSymbols' => 2,
                'url' => '/admin/project/search',
            ],
            'select2Options' => ['placeholder' => 'Find a project'],
            'taggable' => false,
            'value' => 7,
        ]);
        $html = $this->renderSelect('selectajax', $data);
        $props = $this->extractIslandProps($html);

        $this->assertIslandHost($html);
        $this->assertSame('/admin/project/search', $props['remote']['url']);
        $this->assertSame(['country'], $props['remote']['dependencies']);
        $this->assertSame(2, $props['remote']['minSymbols']);
        $this->assertSame('Find a project', $props['legacyOptions']['placeholder']);
        $this->assertStringNotContainsString('js-data-ajax', $html);
        $this->assertStringNotContainsString('search_url=', $html);
    }

    public function test_dependent_select_uses_the_same_island_and_preserves_attributes(): void
    {
        $data = array_replace($this->baseData(), [
            'attributesArray' => [
                'class' => 'project-dependent',
                'data-contract' => 'city',
                'id' => 'city',
                'name' => 'city',
            ],
            'dependentSelect' => [
                'dependencies' => ['country'],
                'initialize' => true,
                'url' => '/admin/dependent/cities',
            ],
            'limit' => 0,
            'name' => 'city',
            'options' => [['id' => 7, 'text' => 'Paris']],
            'select2Options' => [],
            'value' => 7,
        ]);
        $html = $this->renderSelect('dependentselect', $data);
        $props = $this->extractIslandProps($html);

        $this->assertIslandHost($html);
        $this->assertSame('/admin/dependent/cities', $props['dependent']['url']);
        $this->assertSame(['country'], $props['dependent']['dependencies']);
        $this->assertSame('form-control soa-select project-dependent', $props['attributes']['class']);
        $this->assertStringNotContainsString('<select', $html);
        $this->assertStringNotContainsString('input-select-dependent', $html);
    }

    public function test_select_island_accepts_concrete_theme_classes(): void
    {
        $html = view('sleeping_owl::default.form.element.partials.select_island', array_replace(
            $this->baseData(),
            [
                'limit' => 0,
                'options' => [],
                'selectAttributesArray' => ['id' => 'custom', 'name' => 'custom[]'],
                'selectExtraProps' => [
                    'classes' => ['required' => 'project-required project-spacing'],
                ],
                'selectMax' => 0,
                'selectMultiple' => true,
                'selectTaggable' => false,
                'value' => [],
            ]
        ))->render();
        $props = $this->extractIslandProps($html);

        $this->assertSame('project-required project-spacing', $props['classes']['required']);
        $this->assertStringNotContainsString('class="project-required project-spacing"', $html);
    }

    private function renderSelect(string $view, array $data): string
    {
        $template = new SelectRenderTemplateStub();
        $this->app->instance('sleeping_owl.template', $template);
        TemplateFacade::swap($template);

        return view("sleeping_owl::default.form.element.{$view}", $data)->render();
    }

    private function singleSelectData(): array
    {
        return array_replace($this->baseData(), [
            'attributesArray' => [
                'class' => 'project-select',
                'data-contract' => 'Sales & "support"',
                'id' => 'status',
                'name' => 'status',
            ],
            'limit' => 0,
            'name' => 'status',
            'options' => [
                ['id' => null, 'text' => 'None'],
                ['id' => 1, 'text' => 'One'],
                ['id' => '2', 'text' => '<script>Two</script>'],
            ],
            'value' => 2,
        ]);
    }

    private function multipleSelectData(): array
    {
        return array_replace($this->baseData(), [
            'attributesArray' => [
                'class' => 'project-multiselect',
                'disabled' => 'disabled',
                'id' => 'categories',
                'multiple' => 'multiple',
                'name' => 'categories[]',
            ],
            'id' => 'categories',
            'limit' => 2,
            'max' => 4,
            'name' => 'categories[]',
            'options' => [
                ['id' => 1, 'text' => 'One'],
                ['id' => 3, 'text' => 'Three'],
            ],
            'readonly' => true,
            'required' => true,
            'taggable' => true,
            'value' => [1, '3'],
        ]);
    }

    private function baseData(): array
    {
        return [
            'errors' => new ViewErrorBag(),
            'helpText' => null,
            'id' => 'status',
            'label' => 'Status',
            'readonly' => false,
            'required' => false,
            'visibled' => true,
        ];
    }

    private function extractIslandProps(string $html): array
    {
        $this->assertSame(1, preg_match('/data-vue-props="([^"]+)"/', $html, $match));
        $json = html_entity_decode($match[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
    }

    private function assertIslandHost(string $html): void
    {
        $this->assertStringContainsString('data-vue-app', $html);
        $this->assertStringContainsString('data-vue-component="element-select"', $html);
        $this->assertStringContainsString('v-pre', $html);
        $this->assertStringNotContainsString('inline-template', $html);
        $this->assertStringNotContainsString('<deselect', $html);
    }
}

class SelectRenderTemplateStub
{
    public function getViewPath(string $view): string
    {
        return "sleeping_owl::default.{$view}";
    }
}
