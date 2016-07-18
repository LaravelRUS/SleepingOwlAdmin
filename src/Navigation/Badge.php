<?php

namespace SleepingOwl\Admin\Navigation;

class Badge extends \KodiComponents\Navigation\Badge
{
    /**
     * @return string
     */
    public function getValue()
    {
        if (is_callable($this->value)) {
            return call_user_func($this->value);
        }

        return parent::getValue();
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('_partials.navigation.badge', $this->toArray());
    }
}
