<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Form\FormElementInterface;

class FormElementsCollection extends Collection
{
    /**
     * @return static
     */
    public function onlyActive()
    {
        return $this->filter(function ($element) {
            if ($element instanceof FormElementInterface) {
                // fix
                if ($element->isReadonly()) {
                    return false;
                }
                if (! $element->isDisplayed()) {
                    return false;
                }

                return true;
            }

            return true;
        })->onlyVisible();
    }

    /**
     * @return static
     */
    public function onlyVisible()
    {
        return $this->filter(function ($element) {
            if ($element instanceof FormElementInterface) {
                return $element->isVisible();
            }

            return true;
        });
    }
}
