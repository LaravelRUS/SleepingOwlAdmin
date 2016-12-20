<?php

namespace SleepingOwl\Admin\Form\Element;

class DependentSelect extends Select
{
    /**
     * @var string
     */
    protected $dataUrl = '';

    /**
     * @var array
     */
    protected $dataDepends = [];

    /**
     * @return string
     */
    public function getDataUrl()
    {
        return $this->dataUrl;
    }

    /**
     * @return string
     */
    public function getDataDepends()
    {
        return json_encode($this->dataDepends);
    }

    /**
     * @param array $depends
     *
     * @return $this
     */
    public function setDataDepends($depends)
    {
        $this->dataDepends = $depends;

        return $this;
    }

    /**
     * @param string $dataUrl
     *
     * @return $this
     */
    public function setDataUrl($dataUrl)
    {
        $this->dataUrl = $dataUrl;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'class' => 'form-control input-select depdrop',
            'data-url' =>  $this->getDataUrl(),
            'data-depends' =>  $this->getDataDepends(),
        ];

        if ($this->isReadonly()) {
            $attributes['disabled'] = 'disabled';
        }

        $options = $this->getOptions();

        if ($this->isNullable()) {
            $attributes['data-nullable'] = 'true';
            $options = [null => trans('sleeping_owl::lang.select.nothing')] + $options;
        }

        $options = array_except($options, $this->exclude);

        return parent::toArray() + [
            'options' => $options,
            'nullable' => $this->isNullable(),
            'attributes' => $attributes,
        ];
    }

    /**
     * @var RepositoryInterface
     */
    protected function loadOptions()
    {
        $repository = app(RepositoryInterface::class, [$this->getModelForOptions()]);

        $key = $repository->getModel()->getKeyName();

        $options = $repository->getQuery();

        if ($this->isEmptyRelation()) {
            $options->where($this->getForeignKey(), 0)->orWhereNull($this->getForeignKey());
        }

        if (count($this->fetchColumns) > 0) {
            $columns = array_merge([$key], $this->fetchColumns);
            $options->select($columns);
        }

        // call the pre load options query preparer if has be set
        if (! is_null($preparer = $this->getLoadOptionsQueryPreparer())) {
            $options = $preparer($this, $options);
        }

        $options = $options->get();

        if (is_callable($this->getDisplay())) {
            // make dynamic display text
            if ($options instanceof Collection) {
                $options = $options->all();
            }

            // the maker
            $makeDisplay = $this->getDisplay();

            // iterate for all options and redefine it as
            // list of KEY and TEXT pair
            $options = array_map(function ($opt) use ($key, $makeDisplay) {
                // get the KEY and make the display text
                return [data_get($opt, $key), $makeDisplay($opt)];
            }, $options);

            // take options as array with KEY => VALUE pair
            $options = Arr::pluck($options, 1, 0);
        } elseif ($options instanceof Collection) {
            // take options as array with KEY => VALUE pair
            $options = Arr::pluck($options->all(), $this->getDisplay(), $key);
        } else {
            // take options as array with KEY => VALUE pair
            $options = Arr::pluck($options, $this->getDisplay(), $key);
        }

        $this->setOptions($options);
    }

    /**
     * @param mixed $value
     *
     * @return mixed
     */
    protected function prepareValue($value)
    {
        if ($this->isNullable() and $value == '') {
            return;
        }

        return parent::prepareValue($value);
    }
}
