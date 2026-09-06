<?php

use SleepingOwl\Admin\Form\Element\MultiSelect;
use SleepingOwl\Admin\Form\Element\Select;

class FormElementSelectTest extends TestCase
{
    public function test_single_select_keeps_final_submit_attributes_and_typed_options(): void
    {
        $element = new Select('profile.status', 'Status', [1 => 'One', 'code' => 'Code']);
        $element->setSortable(false);
        $element->setExactValue('code');
        $element->setHtmlAttributes([
            'class' => 'project-select',
            'data-contract' => 'status',
        ]);

        $data = $element->toArray();

        $this->assertSame('profile[status]', $data['attributesArray']['name']);
        $this->assertSame('profile__status', $data['attributesArray']['id']);
        $this->assertSame('project-select', $data['attributesArray']['class']);
        $this->assertSame('status', $data['attributesArray']['data-contract']);
        $this->assertSame('code', $data['value']);
        $this->assertSame([
            ['id' => 1, 'text' => 'One'],
            ['id' => 'code', 'text' => 'Code'],
        ], $data['options']);
    }

    public function test_multiselect_keeps_relation_name_limits_and_taggable_attributes(): void
    {
        $element = new MultiSelect('categories', 'Categories', [1 => 'One', 3 => 'Three']);
        $element->setSortable(false);
        $element->setLimit(2);
        $element->setMax(4);
        $element->setExactValue([1, '3']);
        $element->setHtmlAttribute('class', 'project-multiselect');
        $element->taggable();
        $element->setReadonly(true);

        $data = $element->toArray();

        $this->assertSame('categories[]', $data['attributesArray']['name']);
        $this->assertSame('categories', $data['attributesArray']['id']);
        $this->assertSame('multiple', $data['attributesArray']['multiple']);
        $this->assertSame('disabled', $data['attributesArray']['disabled']);
        $this->assertSame(
            'project-multiselect input-taggable',
            $data['attributesArray']['class']
        );
        $this->assertSame(2, $data['limit']);
        $this->assertSame(4, $data['max']);
        $this->assertTrue($data['taggable']);
        $this->assertSame([1, '3'], $data['value']);
    }
}
