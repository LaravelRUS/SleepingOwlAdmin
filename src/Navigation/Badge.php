<?php

namespace SleepingOwl\Admin\Navigation;

class Badge extends \KodiComponents\Navigation\Badge
{
    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('_partials.navigation.badge', $this->toArray());
    }
}
