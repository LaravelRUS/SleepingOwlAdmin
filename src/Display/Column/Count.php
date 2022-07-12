<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Support\Collection;

class Count extends NamedColumn
{
    /**
     * @var string
     */
    protected string $view = 'column.count';

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * @var bool
     */
    protected bool $orderable = false;

    /**
     * @return int
     */
    public function getModelValue(): int
    {
        $value = parent::getModelValue();

        if (is_array($value) || $value instanceof Collection) {
            return count($value);
        }

        return 0;
    }

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
