<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Form\FormDefault;

class Textarea extends EditableColumn implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.textarea';

    /**
     * Text constructor.
     *
     * @param  $name
     * @param  $label
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label, $small);
    }

    /**
     * @param  Request  $request
     * @return void
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     */
    public function save(Request $request)
    {
        $form = new FormDefault([
            new \SleepingOwl\Admin\Form\Element\Textarea(
                $this->getName()
            ),
        ]);

        $model = $this->getModel();

        $array = [];
        Arr::set($array, $this->getName(), $request->input('value', null));

        $request->merge($array);
        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());

        $form->saveForm($request);
    }
}
