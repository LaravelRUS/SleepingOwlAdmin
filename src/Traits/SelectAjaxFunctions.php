<?php

namespace SleepingOwl\Admin\Traits;

use Illuminate\Support\Arr;
use SleepingOwl\Admin\Exceptions\Form\Element\SelectException;

trait SelectAjaxFunctions
{
    protected $search_url = null;
    protected $search = null;
    protected $min_symbols = 3;
    protected $default_query_preparer;

    /**
     * @var array
     */
    protected $params;

    /**
     * @var array
     */
    protected $dataDepends = [];

    /**
     * @var \Closure|null|mixed
     */
    protected $modelForOptionsCallback = null;

    /**
     * @var string|\Closure|mixed
     */
    protected $custom_name = 'custom_name';

    /**
     * @param string|\Closure|mixed $custom_name
     * @return $this
     */
    public function setCustomName($custom_name)
    {
        $this->custom_name = $custom_name;

        return $this;
    }

    /**
     * @return string|\Closure|mixed
     */
    public function getCustomName()
    {
        return $this->custom_name;
    }

    /**
     * @return null|string
     */
    public function getSearch()
    {
        if ($this->search) {
            return $this->search;
        }

        return $this->getDisplay();
    }

    /**
     * @param $search
     * @return $this
     */
    public function setSearch($search)
    {
        $this->search = $search;

        return $this;
    }

    /**
     * Get min symbols to search.
     * @return int
     */
    public function getMinSymbols()
    {
        return $this->min_symbols;
    }

    /**
     * Set min symbols to search.
     * @param $symbols
     * @return $this
     */
    public function setMinSymbols($symbols)
    {
        $this->min_symbols = $symbols;

        return $this;
    }

    /**
     * @return array
     */
    public function mutateOptions()
    {
        return $this->getOptions();
    }

    /**
     * @param string $key
     *
     * @return bool
     */
    public function hasDependKey($key)
    {
        return Arr::has($this->params, $key);
    }

    /**
     * @param string $key
     *
     * @return mixed
     */
    public function getDependValue($key)
    {
        return Arr::get($this->params, $key, $this->getModel()->getAttribute($key));
    }

    /**
     * @return string Json
     */
    public function getDataDepends()
    {
        return json_encode($this->dataDepends);
    }

    /**
     * @param array|string $depends
     *
     * @return $this
     */
    public function setDataDepends($depends)
    {
        $this->dataDepends = is_array($depends) ? $depends : func_get_args();

        return $this;
    }

    /**
     * @param array $params
     *
     * @return $this
     */
    public function setAjaxParameters(array $params)
    {
        $this->params = $params;

        return $this;
    }

    /**
     * @return \Closure
     */
    public function getModelForOptionsCallback()
    {
        return $this->modelForOptionsCallback;
    }

    /**
     * @param \Closure|null|mixed $modelForOptionsCallback
     *
     * @return $this
     * @throws SelectException
     */
    public function setModelForOptionsCallback($modelForOptionsCallback)
    {
        if (! is_callable($modelForOptionsCallback) && ! is_null($modelForOptionsCallback)) {
            throw new SelectException('Option for setModelForOptionsCallback must be Closure or null');
        }

        $this->modelForOptionsCallback = $modelForOptionsCallback;

        return $this;
    }
}
