<?php

namespace SleepingOwl\Admin\Traits;

use SleepingOwl\Admin\Contracts\Form\ElementsInterface;

trait FormElementsRecursiveIterator
{
    /**
     * @param  \Closure  $callback
     * @return bool|void
     */
    public function recursiveIterateElements(\Closure $callback)
    {
        // If Callback function returns TRUE then recurse iterator should stop.
        $result = null;

        foreach ($this->getElements() as $element) {
            if ($element instanceof ElementsInterface) {
                $result = $element->recursiveIterateElements($callback);
            } else {
                $result = $callback($element);
            }

            if ($result === true) {
                break;
            }
        }

        return $result;
    }
}
