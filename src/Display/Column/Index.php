<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;

class Index extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.custom';

    /**
     * @var string
     */
    protected $width = '45px';

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * Custom constructor.
     *
     * @param  null|string  $label
     * @param  Closure  $callback
     */
    public function __construct($label = null)
    {
        parent::__construct($label);
        if (! is_null($label)) {
            $this->setLabel($label);
        }
    }

    /**
     * @return array
     *
     * @throws \Exception
     */
    public function toArray()
    {
        return parent::toArray() + [
            'value' => ++request()->start,
        ];
    }
}
