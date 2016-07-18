<?php

namespace SleepingOwl\Admin\Contracts\Form;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\FormElementInterface;

interface ElementsInterface extends FormElementInterface
{
    /**
     * @return Collection
     */
    public function getElements();

    /**
     * @param array $elements
     *
     * @return $this
     */
    public function setElements(array $elements);
}
