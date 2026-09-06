<?php

use Illuminate\Support\Collection;
use Illuminate\Support\ViewErrorBag;
use Mockery as m;
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
        $this->assertStringContainsString('data-soa-vue-component="related-elements"', $html);
        $this->assertStringNotContainsString('inline-template', $html);
        $this->assertStringNotContainsString('</script><script data-escape>', $html);
        $this->assertSame('items', $props['name']);
        $this->assertSame(3, $props['limit']);
        $this->assertTrue($props['draggable']);
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
        $this->assertStringContainsString('data-soa-vue-props-id=', $html);
        $this->assertSame('items', $props['name']);
        $this->assertSame('42', $props['groups'][0]['primary']);
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
