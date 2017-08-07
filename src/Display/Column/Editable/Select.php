<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Traits\SelectOptionsFromModel;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class Select extends EditableColumn implements ColumnEditableInterface
{
    use SelectOptionsFromModel;

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
        } elseif (($options instanceof Model) || is_string($options)) {
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
     * @param $key
     * @return mixed|null
     */
    public function getOptionName($value)
    {
        if (isset($value)) {
            if (isset($this->optionList[$value])) {
                return $this->optionList[$value];
            }

            return $value;
        }
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
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
                'options'        => $this->mutateOptions(),
                'optionName'     => $this->getOptionName($this->getModelValue()),
            ];
    }

    /**
     * @param Request $request
     *
     * @return void
     */
    public function save(Request $request)
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
