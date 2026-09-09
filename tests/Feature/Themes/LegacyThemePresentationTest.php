<?php

use Mockery as m;
use PHPUnit\Framework\Attributes\DataProvider;
use SleepingOwl\Admin\Contracts\Form\FormButtonsInterface;
use SleepingOwl\Admin\Form\Card\Body;
use SleepingOwl\Admin\Form\Card\Footer;
use SleepingOwl\Admin\Form\Card\Header;
use SleepingOwl\Admin\Form\Buttons\FormButton;
use SleepingOwl\Admin\Form\Buttons\SaveAndClose;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\FormCard;

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
            '<button class="btn btn-success soa-button soa-button-success user-action"',
            'data-contract="save"',
            'value="save_and_close"',
        ]);
    }

    public function test_grouped_form_button_keeps_the_public_dropdown_marker(): void
    {
        $groupButton = m::mock(FormButton::class);
        $groupButton->shouldReceive('getShow')->once()->andReturnTrue();
        $groupButton->shouldReceive('render')->once()->andReturn(
            '<button data-contract="group-action">Run</button>'
        );

        $html = view('sleeping_owl::default.form.button', [
            'attributesArray' => [],
            'groupElements' => [$groupButton],
            'iconClass' => null,
            'name' => 'save_and_close',
            'text' => 'Save',
            'url' => null,
        ])->render();

        $this->assertContainsAll($html, [
            'class="btn-group soa-button-group"',
            'data-toggle="dropdown"',
            'class="dropdown-menu btn-actions soa-dropdown-menu"',
            'aria-haspopup="true"',
            'aria-expanded="false"',
            '<button data-contract="group-action">Run</button>',
        ]);
        $this->assertStringNotContainsString('data-dropdown', $html);
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
            '<div class="soa-form-column col-sm-6 user-column"',
            'data-contract="grid"',
        ]);
    }

    #[DataProvider('buttonVariants')]
    public function test_form_button_variants_keep_legacy_classes_with_semantic_aliases(string $name, string $variant): void
    {
        $html = view('sleeping_owl::default.form.button', [
            'attributesArray' => ['class' => 'user-action'],
            'groupElements' => null,
            'iconClass' => null,
            'name' => $name,
            'text' => 'Action',
            'url' => null,
        ])->render();

        $this->assertStringContainsString("class=\"btn {$variant} soa-button", $html);
        $this->assertStringContainsString('user-action', $html);
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
            '<small class="badge soa-badge bg-danger user-badge"',
            'data-contract="badge"',
            '  7',
        ]);
        $this->assertStringNotContainsString('badge-primary', $html);
    }

    public function test_control_wrapper_adds_action_variant_in_legacy_theme(): void
    {
        $html = view('sleeping_owl::default.column.control_link', [
            'attributesArray' => [
                'class' => 'btn-primary soa-button-primary user-control',
                'data-contract' => 'edit',
            ],
            'hideText' => false,
            'icon' => null,
            'image' => null,
            'text' => 'Edit',
            'url' => '/edit/1',
        ])->render();

        $this->assertContainsAll($html, [
            '<a href="/edit/1" class="btn btn-sm soa-button soa-button-sm btn-primary soa-button-primary user-control"',
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
            'class="nav-item nav-link soa-tab-trigger active user-tab"',
            'data-tab',
            'data-contract="tab"',
            'href="#nav-orders"',
        ]);
    }

    public function test_card_buttons_render_without_an_extra_blade_wrapper(): void
    {
        $buttons = view('sleeping_owl::default.form.buttons', [
            'attributesArray' => [
                'class' => 'form-buttons user-buttons',
                'data-contract' => 'buttons',
            ],
            'buttons' => [],
            'placements' => null,
            'themeClasses' => ['card-footer'],
        ]);

        $html = $buttons->render();

        $this->assertContainsAll($html, [
            '<div class="card-footer form-buttons user-buttons"',
            'data-contract="buttons"',
        ]);
        $this->assertSame(1, substr_count($html, 'card-footer'));
    }

    public function test_card_form_renders_buttons_without_exposing_a_renderable_as_view_data(): void
    {
        $buttons = m::mock(FormButtonsInterface::class);
        $buttons->shouldReceive('toArray')->once()->andReturn([
            'attributesArray' => ['class' => 'form-buttons'],
            'buttons' => [],
            'placements' => null,
        ]);
        $buttons->shouldReceive('getView')->once()->andReturn('form.buttons');

        $html = (new FormCard())
            ->setButtons($buttons)
            ->render()
            ->render();

        $this->assertStringContainsString('<div class="card-footer form-buttons"', $html);
        $this->assertSame(1, substr_count($html, 'card-footer'));
    }

    #[DataProvider('cardPartVariants')]
    public function test_card_parts_share_one_view_and_supply_their_variant_classes(
        string $class,
        string $expectedClass
    ): void {
        $part = new $class([]);
        $html = $part->render()->render();

        $this->assertSame('form.card.element', $part->getView());
        $this->assertStringContainsString($expectedClass, $html);
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

    public static function cardPartVariants(): iterable
    {
        yield 'header' => [Header::class, 'class="card-header soa-card-header"'];
        yield 'body' => [Body::class, 'class="card-body soa-card-body"'];
        yield 'footer' => [Footer::class, 'class="card-footer soa-card-footer"'];
    }
}
