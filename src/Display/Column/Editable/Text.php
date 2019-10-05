<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class Text extends EditableColumn implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.text';

    /**
     * @var bool
     */
    protected $isSearchable = true;

    /**
     * Text constructor.
     *
     * @param             $name
     * @param             $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
    }

    /**
     * @param Request $request
     *
     * @return void
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     */
    public function save(Request $request)
    {
        $form = new FormDefault([
            new \SleepingOwl\Admin\Form\Element\Text(
                $this->getName()
            ),
        ]);

        $model = $this->getModel();

        $request->offsetSet($this->getName(), $request->input('value', null));

        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());

        $form->saveForm($request);
    }
}
