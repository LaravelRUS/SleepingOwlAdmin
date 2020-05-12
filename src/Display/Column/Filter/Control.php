<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

class Control extends BaseColumnFilter
{
    /**
     * Control constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->initialize();
    }

    /**
     * @var string
     */
    protected $view = 'column.filter.control';

    /**
     * @var string
     */
    protected $placeholder;

    public function initialize()
    {
        parent::initialize();

        $this->setHtmlAttribute('class', 'btn btn-sm btn-primary column-filter');
        $this->setHtmlAttribute('data-type', 'control');
        $this->setHtmlAttribute('id', 'filters-exec');
    }
}
