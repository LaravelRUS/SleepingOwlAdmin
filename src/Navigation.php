<?php

namespace SleepingOwl\Admin;

class Navigation extends \KodiComponents\Navigation\Navigation
{
    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        $this->findActive();
        $this->filterByAccessRights();
        $this->sort();

        return app('sleeping_owl.template')->view('_partials.navigation.navigation', [
            'pages' => $this->toArray(),
        ])->render();
    }
}
