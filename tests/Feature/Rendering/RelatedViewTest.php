<?php

use Illuminate\Support\Collection;
use Illuminate\Support\ViewErrorBag;
use SleepingOwl\Admin\Facades\Template as TemplateFacade;
use SleepingOwl\Admin\Form\Related\Group;
use SleepingOwl\Tests\Helpers\InteractsWithJsonProps;

class RelatedViewTest extends TestCase
{
    use InteractsWithJsonProps;

    public function test_related_card_renders_theme_shell_and_referenced_island_props(): void
    {
        $this->bindTemplateFacade();
        $html = view(
            'sleeping_owl::default.form.element.related.elements',
            $this->viewData()
        )->render();
        $props = $this->extractReferencedJsonProps($html);

        $this->assertStringContainsString('card card-outline card-info', $html);
        $this->assertStringContainsString('project-related', $html);
        $this->assertStringContainsString('data-vue-component="related-elements"', $html);
        $this->assertStringNotContainsString('inline-template', $html);
        $this->assertStringNotContainsString('</script><script data-escape>', $html);
        $this->assertSame('items', $props['name']);
        $this->assertSame(3, $props['limit']);
        $this->assertTrue($props['draggable']);
        $this->assertSame('grouped-elements clearfix soa-related', $props['classes']['root']);
        $this->assertSame('related-elements__draggable soa-related-groups', $props['classes']['groups']);
        $this->assertSame('d-block clearfix soa-form-actions', $props['classes']['actions']);
        $this->assertSame(
            'grouped-elements__action float-end related-action_add btn btn-success btn-sm soa-button soa-button-sm soa-button-success',
            $props['classes']['add']
        );
        $this->assertSame('fas fa-plus', $props['classes']['addIcon']);
        $this->assertSame(['7'], $props['removed']);
        $this->assertSame('42', $props['groups'][0]['primary']);
        $this->assertStringContainsString('items[42][title]', $props['groups'][0]['html']);
        $this->assertStringContainsString('</script><script data-escape>', $props['stubHtml']);
    }

    public function test_related_plain_view_keeps_consumer_attributes_and_same_island_contract(): void
    {
        $this->bindTemplateFacade();
        $html = view(
            'sleeping_owl::default.form.element.related.elements_without_card',
            $this->viewData()
        )->render();
        $props = $this->extractReferencedJsonProps($html);

        $this->assertStringContainsString('class="project-related"', $html);
        $this->assertStringNotContainsString('card card-outline', $html);
        $this->assertStringContainsString('data-vue-props-id=', $html);
        $this->assertSame('items', $props['name']);
        $this->assertSame('42', $props['groups'][0]['primary']);
    }

    public function test_related_island_accepts_concrete_theme_classes(): void
    {
        $this->bindTemplateFacade();
        $data = $this->viewData();
        $data['relatedExtraProps'] = [
            'classes' => [
                'actions' => 'project-actions',
                'add' => 'project-add',
                'addIcon' => 'project-icon',
                'groups' => 'project-groups',
                'root' => 'project-root',
            ],
        ];
        $html = view(
            'sleeping_owl::default.form.element.related.inner_element',
            $data
        )->render();
        $props = $this->extractReferencedJsonProps($html);

        $this->assertSame($data['relatedExtraProps']['classes'], $props['classes']);
        $this->assertStringNotContainsString('class="project-root"', $html);
    }

    private function bindTemplateFacade(): void
    {
        $template = $this->getTemplateMock();
        $template->shouldReceive('getViewPath')->andReturnUsing(
            fn (string $path) => "sleeping_owl::default.{$path}"
        );
        TemplateFacade::swap($template);
    }

    private function viewData(): array
    {
        $group = (new Group(null, ['<input name="items[42][title]">']))
            ->setPrimary('42')
            ->setLabel('Saved item');

        return [
            'attributesArray' => ['class' => 'project-related'],
            'collapsed' => false,
            'deletable' => true,
            'draggable' => true,
            'errors' => new ViewErrorBag(),
            'groups' => new Collection([$group]),
            'helpText' => null,
            'label' => 'Items',
            'limit' => 3,
            'name' => 'items',
            'readonly' => false,
            'remove' => new Collection([7]),
            'stub' => new Collection(['<input name="image" value="</script><script data-escape>">']),
        ];
    }
}
