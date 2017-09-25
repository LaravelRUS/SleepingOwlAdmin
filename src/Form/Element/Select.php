<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Database\Eloquent\Model;

class Select extends NamedFormElement
{
    use \SleepingOwl\Admin\Traits\SelectOptionsFromModel;

    /**
     * @var array
     */
    protected $options = [];

    /**
     * @var bool
     */
    protected $nullable = false;

    /**
     * @var bool
     */
    protected $sortable = true;
    protected $sortable_flags = null;

    /**
     * @var array
     */
    protected $exclude = [];

    /**
     * @var int
     */
    protected $limit = 0;

    /**
     * @var string
     */
    protected $view = 'form.element.select';

    /**
     * @param string $path
     * @param string|null $label
     * @param array|Model $options
     */
    public function __construct($path, $label = null, $options = [])
    {
        parent::__construct($path, $label);

        if (is_array($options)) {
            $this->setOptions($options);
        } elseif (($options instanceof Model) || is_string($options)) {
            $this->setModelForOptions($options);
        }
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
            asort($options, $this->getSortableFlags());
        }

        return $options;
    }

    /**
     * @return array
     */
    public function mutateOptions()
    {
        $options = [];
        $temp = $this->getOptions();
        foreach ($temp as $key => $value) {
            $options[] = ['id' => $key, 'text' => $value];
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
     * @return bool
     */
    public function isNullable()
    {
        return $this->nullable;
    }

    /**
     * @return $this
     */
    public function nullable()
    {
        $this->nullable = true;

        $this->addValidationRule('nullable');

        return $this;
    }

    /**
     * @param bool $sortable
     *
     * @param null $sortable_flags
     * @return $this
     */
    public function setSortable($sortable, $sortable_flags = null)
    {
        $this->sortable = (bool) $sortable;
        $this->sortable_flags = $sortable_flags;

        return $this;
    }

    /**
     * @return null
     */
    protected function getSortableFlags()
    {
        return $this->sortable_flags;
    }

    /**
     * @return bool
     */
    public function isSortable()
    {
        return $this->sortable;
    }

    /**
     * @return int
     */
    protected function getLimit()
    {
        return $this->limit;
    }

    /**
     * @param $limit
     * @return $this
     */
    public function setLimit($limit)
    {
        $this->limit = $limit;

        return $this;
    }

    /**
     * @param array $keys
     *
     * @return $this
     */
    public function exclude($keys)
    {
        if (! is_array($keys)) {
            $keys = func_get_args();
        }

        $this->exclude = array_filter($keys);

        return $this;
    }

    /**
     * @return null|string
     */
    public function getForeignKey()
    {
        if (is_null($this->foreignKey)) {
            return $this->foreignKey = $this->getModel()->getForeignKey();
        }

        return $this->foreignKey;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->setHtmlAttributes([
            'id'               => $this->getName(),
            'size'             => 2,
            'data-select-type' => 'single',
            'class'            => 'form-control',
        ]);

        if ($this->isReadonly()) {
            $this->setHtmlAttribute('disabled', 'disabled');
        }

        $options = $this->mutateOptions();

        if ($this->isNullable()) {
            $this->setHtmlAttribute('data-nullable', 'true');
            $options = collect($options)->prepend(['id' => null, 'text' => trans('sleeping_owl::lang.select.nothing')]);
        }

        return ['attributes' => $this->htmlAttributesToString()] + parent::toArray() + [
                'options'  => $options,
                'limit'    => $this->getLimit(),
                'nullable' => $this->isNullable(),
            ];
    }

    /**
     * @param mixed $value
     *
     * @return mixed
     */
    public function prepareValue($value)
    {
        if ($this->isNullable() && $value == '') {
            return;
        }

        return parent::prepareValue($value);
    }
}
