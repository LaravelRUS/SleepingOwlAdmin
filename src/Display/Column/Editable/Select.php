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
     * @var null
     */
    protected $relationKey = null;
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
     * @var null
     */
    protected $defaultValue = null;

    /**
     * Select constructor.
     * @param $name
     * @param null $label
     * @param array $options
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
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
     * @param $relationKey
     * @return $this
     */
    public function setRelationKey($relationKey)
    {
        $this->relationKey = $relationKey;

        return $this;
    }

    /**
     * @return null
     */
    public function getRelationKey()
    {
        return $this->relationKey;
    }

    /**
     * @param $defaultValue
     * @return $this
     */
    public function setDefaultValue($defaultValue)
    {
        $this->defaultValue = $defaultValue;

        return $this;
    }

    /**
     * @return null
     */
    public function getDefaultValue()
    {
        return $this->defaultValue;
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
                'options'    => $this->mutateOptions(),
                'optionName' => $this->getOptionName($this->getModelValue()),
            ];
    }

    /**
     * @param Request $request
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     */
    public function save(Request $request)
    {
        $model = $this->getModel();

        if (strpos($this->getName(), '.') !== false) {
            if ($this->getRelationKey()) {
                $this->setName($this->getRelationKey());
            } else {
                //@TODO Make Relation Resolver
                $relationName = explode('.', $this->getName());
            }
        }

        $form = new FormDefault([
            new \SleepingOwl\Admin\Form\Element\Select(
                $this->getName()
            ),
        ]);

        $request->offsetSet($this->getName(), $request->input('value', $this->getDefaultValue()));

        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());

        $form->saveForm($request);
    }
}
