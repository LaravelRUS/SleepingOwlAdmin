<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Display\Column\NamedColumn;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class Text extends NamedColumn implements ColumnEditableInterface
{
    /**
     * @var string
     */
    protected $view = 'column.editable.text';

    /**
     * @var string
     */
    protected $url = null;

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
     * @return string
     */
    public function getUrl()
    {
        if (! $this->url) {
            return request()->url();
        }

        return $this->url;
    }

    /**
     * @param $url
     * @return string
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
                'id'             => $this->getModel()->getKey(),
                'value'          => $this->getModelValue(),
                'isEditable'     => $this->getModelConfiguration()->isEditable($this->getModel()),
                'url'            => $this->getUrl(),
            ];
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request)
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
