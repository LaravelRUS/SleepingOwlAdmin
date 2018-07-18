<?php

namespace SleepingOwl\Admin\Form\Related;

use SleepingOwl\Admin\Form\FormElementsCollection;

class Columns extends \SleepingOwl\Admin\Form\Columns\Columns
{
    public function setElements(array $columns)
    {
        $this->elements = new FormElementsCollection();

        return parent::setElements($columns);
    }
}
