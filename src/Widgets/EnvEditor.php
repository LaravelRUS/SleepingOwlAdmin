<?php

namespace SleepingOwl\Admin\Widgets;

use SleepingOwl\Admin\Facades\Template as AdminTemplate;

class EnvEditor extends Widget
{
    /**
     * @return bool
     */
    public function active()
    {
        return config('sleeping_owl.enable_editor');
    }

    /**
     * @return string
     *
     * @throws \Throwable
     */
    public function toHtml()
    {
        return view(AdminTemplate::getViewPath('_partials.env_editor'))->render();
    }

    /**
     * @return string|array
     */
    public function template()
    {
        return AdminTemplate::getViewPath('_partials.header');
    }

    /**
     * @return string
     */
    public function block()
    {
        return 'navbar.right';
    }
}
