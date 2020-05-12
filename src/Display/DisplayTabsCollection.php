<?php

namespace SleepingOwl\Admin\Display;

use SleepingOwl\Admin\Contracts\Display\TabInterface;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Form\FormElementsCollection;

class DisplayTabsCollection extends FormElementsCollection
{
    /**
     * @return static
     */
    public function onlyActive()
    {
        return $this->filter(function (TabInterface $tab) {
            $element = $tab->getContent();

            if ($element instanceof FormElementInterface) {
                return ! $element->isReadonly() && $element->isVisible();
            }

            return true;
        })->onlyVisible();
    }

    /**
     * @return static
     */
    public function onlyVisible()
    {
        return $this->filter(function (TabInterface $tab) {
            return $tab->isVisible();
        });
    }
}
