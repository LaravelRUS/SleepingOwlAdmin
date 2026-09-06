<?php

use SleepingOwl\Admin\Display\Extension\ActionsForm;
use SleepingOwl\Admin\Display\Extension\Links;

class ExtensionAttributesTest extends TestCase
{
    public function test_actions_form_exposes_legacy_and_array_attributes(): void
    {
        $extension = new ActionsForm();
        $extension->setHtmlAttributes([
            'class' => ['project-actions', 'text-end'],
            'data-module' => 'catalog',
        ]);

        $data = $extension->toArray();

        $this->assertSame([
            'class' => 'project-actions text-end',
            'data-module' => 'catalog',
        ], $data['attributesArray']);
        $this->assertSame(
            ' class="project-actions text-end" data-module="catalog"',
            $data['attributes']
        );
    }

    public function test_links_exposes_default_and_user_attributes(): void
    {
        $extension = new Links();
        $extension->setHtmlAttributes([
            'class' => 'project-links',
            'aria-label' => 'Related links',
        ]);

        $data = $extension->toArray();

        $this->assertSame([
            'class' => 'links-row project-links',
            'aria-label' => 'Related links',
        ], $data['attributesArray']);
        $this->assertSame(
            ' class="links-row project-links" aria-label="Related links"',
            $data['attributes']
        );
    }
}
