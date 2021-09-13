<?php

namespace SleepingOwl\Admin\Contracts\Form;

use Illuminate\Support\Collection;

interface ElementsInterface extends FormElementInterface
{
    /**
     * @param  string  $path
     * @return FormElementInterface|null
     */
    public function getElement($path);

    /**
     * @return Collection
     */
    public function getElements();

    /**
     * @param  array  $elements
     * @return $this
     */
    public function setElements(array $elements);
}
