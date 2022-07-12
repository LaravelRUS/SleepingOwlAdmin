<?php

namespace SleepingOwl\Admin\Contracts\Form;

use Illuminate\Support\Collection;

interface ElementsInterface extends FormElementInterface
{
    /**
     * @param string $path
     * @return FormElementInterface|null
     */
    public function getElement(string $path): ?FormElementInterface;

    /**
     * @return Collection
     */
    public function getElements(): Collection;

    /**
     * @param  array  $elements
     * @return $this
     */
    public function setElements(array $elements): ElementsInterface;
}
