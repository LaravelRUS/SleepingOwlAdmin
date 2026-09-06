<?php

use Mockery as m;
use PHPUnit\Framework\Attributes\DataProvider;
use SleepingOwl\Admin\Form\Buttons\SaveAndClose;
use SleepingOwl\Admin\Form\Columns\Column;

class LegacyThemePresentationTest extends TestCase
{
    public function test_form_button_merges_legacy_defaults_with_user_attributes(): void
    {
        $button = new SaveAndClose();
        $button->setHtmlAttributes([
            'class' => 'user-action',
            'data-contract' => 'save',
        ]);

        $html = view('sleeping_owl::default.form.button', $button->toArray())->render();

        $this->assertContainsAll($html, [
            '<button class="btn btn-success user-action"',
            'data-contract="save"',
            'value="save_and_close"',
        ]);
    }

    public function test_grid_column_renders_numeric_width_in_legacy_theme(): void
    {
        $column = new Column();
        $column->setWidth(6);
        $column->setSize('sm');
        $column->setHtmlAttributes([
            'class' => 'user-column',
            'data-contract' => 'grid',
        ]);

        $html = view('sleeping_owl::default.form.element.column', $column->toArray())->render();

        $this->assertContainsAll($html, [
            '<div class="col-sm-6 user-column"',
            'data-contract="grid"',
        ]);
    }

    #[DataProvider('buttonVariants')]
    public function test_form_button_variants_are_owned_by_legacy_theme(string $name, string $variant): void
    {
        $html = view('sleeping_owl::default.form.button', [
            'attributesArray' => ['class' => 'user-action'],
            'groupElements' => null,
            'iconClass' => null,
            'name' => $name,
            'text' => 'Action',
            'url' => null,
        ])->render();

        $this->assertStringContainsString("class=\"btn {$variant} user-action\"", $html);
    }

    public function test_badge_keeps_user_variant_without_adding_default_variant(): void
    {
        $html = view('sleeping_owl::default._partials.navigation.badge', [
            'attributesArray' => [
                'class' => 'bg-danger user-badge',
                'data-contract' => 'badge',
            ],
            'value' => 7,
        ])->render();

        $this->assertContainsAll($html, [
            '<small class="badge bg-danger user-badge"',
            'data-contract="badge"',
            '  7',
        ]);
        $this->assertStringNotContainsString('badge-primary', $html);
    }

    public function test_control_wrapper_adds_action_variant_in_legacy_theme(): void
    {
        $html = view('sleeping_owl::default.column.control_link.edit', [
            'attributesArray' => [
                'class' => 'user-control',
                'data-contract' => 'edit',
            ],
            'hideText' => false,
            'icon' => null,
            'image' => null,
            'text' => 'Edit',
            'url' => '/edit/1',
        ])->render();

        $this->assertContainsAll($html, [
            '<a href="/edit/1" class="btn btn-xs btn-primary user-control"',
            'data-contract="edit"',
            'Edit',
        ]);
    }

    public function test_display_tab_merges_theme_state_and_user_attributes(): void
    {
        $html = view('sleeping_owl::default.display.tab', [
            'active' => true,
            'attributesArray' => [
                'class' => 'user-tab',
                'data-contract' => 'tab',
            ],
            'badge' => null,
            'icon' => null,
            'label' => 'Orders',
            'name' => 'orders',
        ])->render();

        $this->assertContainsAll($html, [
            'class="nav-item nav-link active user-tab"',
            'data-toggle="tab"',
            'data-contract="tab"',
            'href="#nav-orders"',
        ]);
    }

    public function test_card_button_partial_keeps_a_single_themed_attribute_wrapper(): void
    {
        $buttons = m::mock();
        $buttons->shouldReceive('toArray')->once()->andReturn([
            'attributesArray' => [
                'class' => 'form-buttons user-buttons',
                'data-contract' => 'buttons',
            ],
            'buttons' => [],
            'placements' => null,
        ]);
        $buttons->shouldReceive('getView')->once()->andReturn('form.buttons');

        $html = view('sleeping_owl::default.form.card.buttons', compact('buttons'))->render();

        $this->assertContainsAll($html, [
            '<div class="card-footer form-buttons user-buttons"',
            'data-contract="buttons"',
        ]);
        $this->assertSame(1, substr_count($html, 'card-footer'));
    }

    private function assertContainsAll(string $html, array $fragments): void
    {
        foreach ($fragments as $fragment) {
            $this->assertStringContainsString($fragment, $html);
        }
    }

    public static function buttonVariants(): iterable
    {
        yield 'save and continue' => ['save_and_continue', 'btn-primary'];
        yield 'save and close' => ['save_and_close', 'btn-success'];
        yield 'save and create' => ['save_and_create', 'btn-info'];
        yield 'delete' => ['delete', 'btn-danger'];
        yield 'destroy' => ['destroy', 'btn-danger'];
        yield 'cancel' => ['cancel', 'btn-warning'];
        yield 'restore' => ['restore', 'btn-warning'];
    }
}
