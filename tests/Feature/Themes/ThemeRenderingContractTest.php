<?php

use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Display\Display;
use SleepingOwl\Admin\Display\ExtensionCollection;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Templates\TemplateDefault;
use SleepingOwl\Admin\Themes\LegacyTemplateThemeAdapter;

class ThemeRenderingContractTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->registerThemeViews('contract-alpha', 'alpha');
        $this->registerThemeViews('contract-beta', 'beta');
    }

    public function test_same_display_renders_through_different_themes_without_mutation(): void
    {
        $display = (new ThemeContractDisplay())
            ->setTitle('Shared <display>')
            ->setHtmlAttributes($this->displayAttributes());

        $attributes = $display->getHtmlAttributes();
        $instanceId = spl_object_id($display);
        $alpha = $this->renderWithTheme($display, AlphaContractTemplate::class, 'contract-alpha');
        $beta = $this->renderWithTheme($display, BetaContractTemplate::class, 'contract-beta');

        $this->assertThemeIdentity($alpha, 'alpha', $instanceId);
        $this->assertThemeIdentity($beta, 'beta', $instanceId);
        $this->assertSharedDisplayContract($alpha, 'alpha-display');
        $this->assertSharedDisplayContract($beta, 'beta-display');
        $this->assertSame($attributes, $display->getHtmlAttributes());
        $this->assertNotSame($alpha, $beta);
    }

    public function test_same_form_renders_through_different_themes_without_mutation(): void
    {
        $form = (new ThemeContractForm('Shared & "form"'))
            ->setHtmlAttributes($this->formAttributes());

        $attributes = $form->getHtmlAttributes();
        $instanceId = spl_object_id($form);
        $alpha = $this->renderWithTheme($form, AlphaContractTemplate::class, 'contract-alpha');
        $beta = $this->renderWithTheme($form, BetaContractTemplate::class, 'contract-beta');

        $this->assertThemeIdentity($alpha, 'alpha', $instanceId);
        $this->assertThemeIdentity($beta, 'beta', $instanceId);
        $this->assertSharedFormContract($alpha, 'alpha-form');
        $this->assertSharedFormContract($beta, 'beta-form');
        $this->assertSame($attributes, $form->getHtmlAttributes());
        $this->assertNotSame($alpha, $beta);
    }

    private function registerThemeViews(string $namespace, string $directory): void
    {
        view()->addNamespace(
            $namespace,
            __DIR__."/../../Fixtures/views/themes/{$directory}"
        );
    }

    /**
     * @param  class-string<TemplateInterface>  $templateClass
     */
    private function renderWithTheme(object $renderable, string $templateClass, string $themeId): string
    {
        $template = $this->app->make($templateClass);
        $theme = new LegacyTemplateThemeAdapter($template, $themeId);

        $this->app->instance('sleeping_owl.template', $template);
        $this->app->instance('sleeping_owl.theme', $theme);

        $this->assertSame($theme, $this->app->make(ThemeInterface::class));
        $this->assertSame($template->getViewNamespace(), $theme->viewNamespace());

        return $renderable->render()->render();
    }

    private function displayAttributes(): array
    {
        return [
            'class' => 'project-display',
            'data-contract' => 'display',
            'aria-label' => 'Orders & "sales"',
            'style' => '--project-accent: #123456',
            'hidden' => true,
        ];
    }

    private function formAttributes(): array
    {
        return [
            'class' => 'project-form',
            'data-contract' => 'form',
            'aria-label' => 'Editor & "review"',
            'style' => '--project-gap: 1rem',
            'novalidate' => true,
        ];
    }

    private function assertThemeIdentity(string $html, string $theme, int $instanceId): void
    {
        $this->assertStringContainsString("data-theme=\"{$theme}\"", $html);
        $this->assertStringContainsString("data-instance=\"{$instanceId}\"", $html);
    }

    private function assertSharedDisplayContract(string $html, string $themeClass): void
    {
        $this->assertStringContainsString("class=\"{$themeClass} project-display\"", $html);
        $this->assertStringContainsString('data-contract="display"', $html);
        $this->assertStringContainsString('aria-label="Orders &amp; &quot;sales&quot;"', $html);
        $this->assertStringContainsString('style="--project-accent: #123456;"', $html);
        $this->assertStringContainsString('hidden="hidden"', $html);
        $this->assertStringContainsString('Shared &lt;display&gt;', $html);
    }

    private function assertSharedFormContract(string $html, string $themeClass): void
    {
        $this->assertStringContainsString("class=\"{$themeClass} project-form\"", $html);
        $this->assertStringContainsString('data-contract="form"', $html);
        $this->assertStringContainsString('aria-label="Editor &amp; &quot;review&quot;"', $html);
        $this->assertStringContainsString('style="--project-gap: 1rem;"', $html);
        $this->assertStringContainsString('novalidate="novalidate"', $html);
        $this->assertStringContainsString('Shared &amp; &quot;form&quot;', $html);
    }
}

final class ThemeContractDisplay extends Display
{
    public function __construct()
    {
        parent::__construct();

        $this->extensions = new ExtensionCollection();
    }

    public function getView(): string
    {
        return 'display';
    }

    public function toArray(): array
    {
        return parent::toArray() + [
            'contractInstanceId' => spl_object_id($this),
        ];
    }
}

final class ThemeContractForm extends FormDefault
{
    public function __construct(private string $contractValue)
    {
        parent::__construct();

        $this->setView('form');
    }

    public function toArray(): array
    {
        return [
            'value' => $this->contractValue,
            'attributes' => $this->htmlAttributesToString(),
            'attributesArray' => $this->getHtmlAttributes(),
            'contractInstanceId' => spl_object_id($this),
        ];
    }
}

final class AlphaContractTemplate extends TemplateDefault
{
    public function getViewNamespace(): string
    {
        return 'contract-alpha::contract';
    }
}

final class BetaContractTemplate extends TemplateDefault
{
    public function getViewNamespace(): string
    {
        return 'contract-beta::contract';
    }
}
