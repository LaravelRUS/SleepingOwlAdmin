<?php

namespace SleepingOwl\Admin\Display\Column;

use Exception;

class Index extends NamedColumn
{
    /**
     * @var string
     */
    protected string $view = 'column.custom';

    /**
     * @var string|null
     */
    protected ?string $width = '45px';

    /**
     * @var bool
     */
    protected bool $orderable = false;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * Custom constructor.
     *
     * @param null|string $label
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
     * @throws Exception
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'value' => ++request()->start,
        ];
    }
}
