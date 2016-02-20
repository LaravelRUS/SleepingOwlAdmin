<?php

namespace SleepingOwl\Admin\Templates;

use Meta;

class TemplateDefault implements TemplateInterface
{
    public function __construct()
    {
        Meta::loadPackage('libraries', 'admin-default');
    }

    /**
     * Get full view name
     *
     * @param string $view
     *
     * @return string
     */
    public function view($view)
    {
        return 'sleeping_owl::default.'.$view;
    }

}