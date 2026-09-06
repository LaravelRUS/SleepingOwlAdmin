<?php

use SleepingOwl\Admin\Form\Element\MultiSelect;
use SleepingOwl\Admin\Form\Element\MultiSelectAjax;
use SleepingOwl\Admin\Form\Element\DependentSelect;
use SleepingOwl\Admin\Form\Element\MultiDependentSelect;
use SleepingOwl\Admin\Form\Element\Select;
use SleepingOwl\Admin\Form\Element\SelectAjax;

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

    public function test_select2_is_a_compatibility_alias_for_the_vue_select_view(): void
    {
        $element = new Select('status', 'Status');
        $element->setHtmlAttribute('class', 'project-select');
        $element->setSelect2(true, [
            'placeholder' => 'Choose status',
            'theme' => 'bootstrap4',
        ]);

        $this->assertTrue($element->getSelect2());
        $this->assertSame('form.element.select', $element->getView());
        $this->assertSame('project-select', $element->getHtmlAttribute('class'));
        $this->assertSame([
            'placeholder' => 'Choose status',
            'theme' => 'bootstrap4',
        ], $element->getSelect2Options());
    }

    public function test_ajax_selects_publish_the_same_remote_driver_contract(): void
    {
        $single = (new SelectAjax('city'))->setSearchUrl('/search/cities');
        $single->setMinSymbols(2)->setDataDepends(['country.id']);
        $multiple = (new MultiSelectAjax('tags'))->setSearchUrl('/search/tags');

        $this->assertSame([
            'delay' => 250,
            'dependencies' => ['country__id'],
            'minSymbols' => 2,
            'url' => '/search/cities',
        ], $single->getRemoteSelectConfiguration());
        $this->assertSame([
            'delay' => 250,
            'dependencies' => [],
            'minSymbols' => 3,
            'url' => '/search/tags',
        ], $multiple->getRemoteSelectConfiguration());
    }

    public function test_dependent_selects_publish_the_vue_dependency_contract(): void
    {
        $single = new DependentSelect('city', 'City', ['country', 'region']);
        $single->setDataUrl('/dependent/cities');
        $single->setOptions([7 => 'Paris']);
        $single->setSortable(false);
        $single->setExactValue(7);
        $single->setHtmlAttribute('class', 'project-dependent');

        $data = $single->toArray();

        $this->assertSame([
            'dependencies' => ['country', 'region'],
            'initialize' => true,
            'url' => '/dependent/cities',
        ], $data['dependentSelect']);
        $this->assertSame([['id' => 7, 'text' => 'Paris']], $data['options']);
        $this->assertSame('project-dependent', $data['attributesArray']['class']);
        $this->assertStringNotContainsString('input-select-dependent', $data['attributesArray']['class']);

        $multiple = new MultiDependentSelect('roles', 'Roles', ['city']);
        $multiple->setDataUrl('/dependent/roles');
        $multiple->setInitializable(false);
        $multiple->setExactValue([]);
        $multipleData = $multiple->toArray();

        $this->assertFalse($multipleData['dependentSelect']['initialize']);
        $this->assertSame('roles[]', $multipleData['attributesArray']['name']);
        $this->assertSame('multiple', $multipleData['attributesArray']['multiple']);
    }
}
