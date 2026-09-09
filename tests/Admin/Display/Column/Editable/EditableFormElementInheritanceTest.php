<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use PHPUnit\Framework\Attributes\DataProvider;
use SleepingOwl\Admin\Display\Column\Editable\Boolean as EditableBoolean;
use SleepingOwl\Admin\Display\Column\Editable\Checkbox as EditableCheckbox;
use SleepingOwl\Admin\Display\Column\Editable\Checklist as EditableChecklist;
use SleepingOwl\Admin\Display\Column\Editable\Date as EditableDate;
use SleepingOwl\Admin\Display\Column\Editable\DateTime as EditableDateTime;
use SleepingOwl\Admin\Display\Column\Editable\Number as EditableNumber;
use SleepingOwl\Admin\Display\Column\Editable\Range as EditableRange;
use SleepingOwl\Admin\Display\Column\Editable\Select as EditableSelect;
use SleepingOwl\Admin\Display\Column\Editable\Text as EditableText;
use SleepingOwl\Admin\Display\Column\Editable\Textarea as EditableTextarea;
use SleepingOwl\Admin\Form\Element\Checkbox as FormCheckbox;
use SleepingOwl\Admin\Form\Element\Date as FormDate;
use SleepingOwl\Admin\Form\Element\DateTime as FormDateTime;
use SleepingOwl\Admin\Form\Element\Number as FormNumber;
use SleepingOwl\Admin\Form\Element\Select as FormSelect;
use SleepingOwl\Admin\Form\Element\Text as FormText;
use SleepingOwl\Admin\Form\Element\Textarea as FormTextarea;

class EditableFormElementInheritanceTest extends TestCase
{
    #[DataProvider('editableFormElements')]
    public function test_editable_columns_inherit_their_form_elements(
        string $editableClass,
        string $formElementClass
    ): void {
        $column = new $editableClass('field');

        $this->assertInstanceOf($formElementClass, $column);
        $this->assertSame(
            $editableClass === EditableChecklist::class
                ? 'column.editable.checklist'
                : 'column.editable.partials.editor',
            $column->getView()
        );
    }

    public function test_select_and_checklist_accept_callable_options_and_select_configuration(): void
    {
        foreach ([EditableSelect::class, EditableChecklist::class] as $editableClass) {
            $column = new $editableClass('status', 'Status', fn () => [2 => 'Two', 1 => 'One']);
            $queryPreparer = static fn ($element, $query) => $query;
            $column->setSortable(false)->setLimit(3)->nullable();
            $column->setLoadOptionsQueryPreparer($queryPreparer);

            $this->assertSame([2 => 'Two', 1 => 'One'], $column->getOptions());
            $this->assertTrue($column->isNullable());
            $this->assertSame($queryPreparer, $column->getLoadOptionsQueryPreparer());
        }
    }

    public function test_checklist_with_model_options_saves_a_plain_attribute_without_calling_a_relation(): void
    {
        $model = new EditableInheritanceModel;
        $column = new EditableChecklist('checklist_col', 'Checklist');
        $column->setModelForOptions(new EditableInheritanceOptionModel);
        $column->setModel($model);

        $column->save(Request::create('/', 'POST', [
            'value' => ['first', 'second'],
        ]));

        $this->assertSame('first,second', $model->getAttribute('checklist_col'));
        $this->assertTrue($model->saved);
    }

    public function test_checklist_maps_json_ids_to_display_labels(): void
    {
        $model = new EditableInheritanceModel;
        $model->setAttribute('checklist_col', '["8","3"]');
        $column = new class('checklist_col', 'Checklist', [8 => 'Eight', 3 => 'Three']) extends EditableChecklist
        {
            public function displayValues(): array
            {
                $this->mutateOptions();

                return $this->getSelectedOptionNames();
            }
        };
        $column->setSortable(false)->setMaxLists(1)->setModel($model);

        $this->assertSame('8,3', $column->getModelValue());
        $this->assertSame(['Eight', 'Three'], $column->displayValues());
        $this->assertSame(1, $column->getMaxLists());
    }

    public static function editableFormElements(): array
    {
        return [
            [EditableBoolean::class, FormCheckbox::class],
            [EditableCheckbox::class, FormCheckbox::class],
            [EditableChecklist::class, FormSelect::class],
            [EditableDate::class, FormDate::class],
            [EditableDateTime::class, FormDateTime::class],
            [EditableNumber::class, FormNumber::class],
            [EditableRange::class, FormNumber::class],
            [EditableSelect::class, FormSelect::class],
            [EditableText::class, FormText::class],
            [EditableTextarea::class, FormTextarea::class],
        ];
    }
}

class EditableInheritanceModel extends Model
{
    public bool $saved = false;

    protected $guarded = [];

    public function save(array $options = [])
    {
        $this->saved = true;

        return true;
    }
}

class EditableInheritanceOptionModel extends Model
{
}
