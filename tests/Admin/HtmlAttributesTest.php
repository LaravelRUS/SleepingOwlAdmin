<?php

use SleepingOwl\Admin\Support\HtmlAttributeBag;
use SleepingOwl\Admin\Support\HtmlAttributes;

class HtmlAttributesTest extends TestCase
{
    public function test_attributes_remain_unescaped_until_rendered_as_html(): void
    {
        $attributes = new HtmlAttributesContractStub();
        $attributes->setHtmlAttributes([
            'class' => ['project-card', 'theme-dark'],
            'data-label' => 'Sales & "support"',
            'aria-describedby' => 'sales-help',
            'style' => '--project-accent: #123456',
            'disabled',
        ]);
        $attributes->setHtmlAttribute('class', 'is-wide');

        $this->assertSame([
            'class' => 'project-card theme-dark is-wide',
            'data-label' => 'Sales & "support"',
            'aria-describedby' => 'sales-help',
            'style' => '--project-accent: #123456',
            'disabled' => 'disabled',
        ], $attributes->getHtmlAttributes());

        $this->assertSame(
            ' class="project-card theme-dark is-wide"'
            .' data-label="Sales &amp; &quot;support&quot;"'
            .' aria-describedby="sales-help"'
            .' style="--project-accent: #123456"'
            .' disabled="disabled"',
            $attributes->htmlAttributesToString()
        );
    }

    public function test_attribute_bag_merges_defaults_and_escapes_only_on_output(): void
    {
        $bag = (new HtmlAttributeBag([
            'class' => 'project-card',
            'data-label' => 'Sales & "support"',
            'disabled' => true,
        ]))->class(['theme-card']);

        $this->assertSame([
            'class' => 'theme-card project-card',
            'data-label' => 'Sales & "support"',
            'disabled' => true,
        ], $bag->getAttributes());

        $html = (string) $bag;

        $this->assertStringContainsString('class="theme-card project-card"', $html);
        $this->assertStringContainsString('data-label="Sales &amp; &quot;support&quot;"', $html);
        $this->assertStringContainsString('disabled="disabled"', $html);
    }
}

class HtmlAttributesContractStub
{
    use HtmlAttributes;
}
