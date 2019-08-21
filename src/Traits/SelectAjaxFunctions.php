<?php

namespace SleepingOwl\Admin\Traits;

trait SelectAjaxFunctions
{
    protected $search_url = null;
    protected $search = null;
    protected $min_symbols = 2;
    protected $default_query_preparer;

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
}
