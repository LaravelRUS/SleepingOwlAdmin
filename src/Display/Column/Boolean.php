<?php

namespace SleepingOwl\Admin\Display\Column;

class Boolean extends NamedColumn
{
    /**
     * @var string
     */
    protected $view = 'column.boolean';

    /**
     * @var string
     */
    protected ?string $width = '50px';

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * @var bool
     */
    protected bool $orderable = false;

    /**
     * @return array
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'value' => $this->getModelValue(),
        ];
    }
}
