<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use SleepingOwl\Admin\Traits\SelectOptionsFromModel;

class Select extends NamedFormElement
{
    use SelectOptionsFromModel;

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
     * @var string
     */
    protected $view_select2 = 'form.element.select2';

    /**
     * @var bool
     */
    protected $select2_mode = false;

    /**
     * Select constructor.
     *
     * @param $path
     * @param  null  $label
     * @param  array  $options
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\Element\SelectException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
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

        $options = Arr::except($this->options, $this->exclude);
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
     * @return $this
     */
    public function setOptions(array $options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @param  array  $values
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
     * @param  bool  $sortable
     * @param  null  $sortable_flags
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
     * @return bool
     */
    public function getSelect2()
    {
        return $this->select2_mode;
    }

    /**
     * @param  bool  $mode
     * @param  array  $select2_options  See: https://select2.org/configuration/options-api
     * @return $this
     */
    public function setSelect2($mode, array $select2_options = [])
    {
        $this->select2_mode = $mode;

        $class = 'input-select';
        $class_escaped = strtr($class, ['-' => '\-']);

        if ($this->select2_mode) {
            $this->setView($this->view_select2);
            $this->setHtmlAttribute('class', $class);
            $this->setSelect2Options($select2_options);
        } else {
            $attrs = $this->getHtmlAttribute('class');
            $pattern = "~(?:^{$class_escaped}$|^{$class_escaped}\s|s\{$class_escaped}$|\s{$class_escaped}\s)~s";
            $replace = trim(preg_replace($pattern, ' ', $attrs));

            $this->setView($this->view);
            $this->removeHtmlAttribute('class');
            $this->setHtmlAttribute('class', $replace);
        }

        return $this;
    }

    /**
     * @param  string|array  $key
     * @param  string|bool|int|null  $value
     * @return Select
     */
    public function setSelect2Options($key, $value = null)
    {
        if (is_array($key)) {
            foreach ($key as $k => $v) {
                $this->setSelect2Options($k, $v);
            }
        } else {
            $key = 'data-'.preg_replace_callback('~[A-Z]~su', function ($matches) {
                return '-'.mb_strtolower($matches[0]);
            }, $key);
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            } elseif ($value === null) {
                $value = 'null';
            }
            $this->setHtmlAttribute($key, $value);
        }

        return $this;
    }

    /**
     * @return $this
     */
    public function disableSelect2EscapeMarkup()
    {
        $this->setHtmlAttribute('data-select2-allow-html', 'true');

        return $this;
    }

    /**
     * @return array
     */
    public function getExclude()
    {
        return $this->exclude;
    }

    /**
     * @param  array  $keys
     * @return $this
     */
    public function setExclude($keys)
    {
        return $this->exclude($keys);
    }

    /**
     * @param  array  $keys
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
        $this->setHtmlAttribute('id', ($this->getHtmlAttribute('id') ?: $this->getId()));
        $this->setHtmlAttributes([
            'size' => 2,
            'data-select-type' => 'single',
        ]);

        $this->setHtmlAttribute('class', 'form-control');

        if ($this->isReadonly()) {
            $this->setHtmlAttribute('disabled', 'disabled');
        }

        $options = $this->mutateOptions();

        if ($this->isNullable()) {
            $this->setHtmlAttribute('data-nullable', 'true');
            $options = collect($options)->prepend(['id' => null, 'text' => trans('sleeping_owl::lang.select.nothing')]);
        }

        return [
            'attributes' => $this->htmlAttributesToString(),
            'attributes_array' => $this->getHtmlAttributes(),
        ] + parent::toArray() + [
            'options' => $options,
            'limit' => $this->getLimit(),
            'nullable' => $this->isNullable(),
        ];
    }

    /**
     * @param  mixed  $value
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
