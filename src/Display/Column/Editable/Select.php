<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Display\Column\NamedColumn;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class Select extends NamedColumn implements ColumnEditableInterface
{
    use \SleepingOwl\Admin\Traits\SelectOptionsFromModel;

    /**
     * @var string
     */
    protected $view = 'column.editable.select';

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var array
     */
    protected $optionList = [];

    /**
     * @var array
     */
    protected $exclude = [];

    /**
     * @var bool
     */
    protected $sortable = true;

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
    public function __construct($name, $label = null, $options = [])
    {
        parent::__construct($name, $label);

        if (is_array($options)) {
            $this->setOptions($options);
        } elseif (($options instanceof Model) or is_string($options)) {
            $this->setModelForOptions($options);
        }
    }

    /**
     * @param bool $sortable
     *
     * @return $this
     */
    public function setSortable($sortable)
    {
        $this->sortable = (bool) $sortable;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSortable()
    {
        return $this->sortable;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        if (! is_null($this->getModelForOptions()) && ! is_null($this->getDisplay())) {
            $this->setOptions(
                $this->loadOptions()
            );
        }

        $options = array_except($this->options, $this->exclude);
        if ($this->isSortable()) {
            asort($options);
        }

        return $options;
    }

    /**
     * @return array
     */
    public function mutateOptions()
    {
        $options = [];

        $this->optionList = $this->getOptions();

        foreach ($this->optionList as $key => $value) {
            $options[] = ['value' => $key, 'text' => $value];
        }

        return $options;
    }

    /**
     * @param array
     *
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @param array $values
     *
     * @return $this
     */
    public function setEnum(array $values)
    {
        return $this->setOptions(array_combine($values, $values));
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
                'options'        => $this->mutateOptions(),
                'key'            => $this->getModelValue(),
                'value'          => $this->optionList[$this->getModelValue()],
                'isEditable'     => $this->getModelConfiguration()->isEditable($this->getModel()),
                'url'            => $this->getUrl(),
                'headerTitle'    => $this->header->getTitle(),
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
            new \SleepingOwl\Admin\Form\Element\Select(
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
