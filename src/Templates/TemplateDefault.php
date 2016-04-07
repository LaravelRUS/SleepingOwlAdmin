<?php

namespace SleepingOwl\Admin\Templates;

use Meta;
use SleepingOwl\Admin\Contracts\TemplateInterface;

class TemplateDefault implements TemplateInterface
{
    public function __construct()
    {
        Meta::loadPackage([
            'libraries',
            'select2',
            'metisMenu',
            'admin-default',
            'font-awesome',
            'flow.js',
            'Sortable',
        ]);

        Meta::AddJs('adminScripts', route('admin.scripts'), ['libraries']);
    }

    /**
     * @return string
     */
    public function getViewNamespace()
    {
        return 'sleeping_owl::';
    }

    /**
     * @param string $view
     *
     * @return string
     * @deprecated
     */
    public function getTemplateViewPath($view)
    {
        return $this->getViewPath($view);
    }

    /**
     * @param string $view
     *
     * @return string
     */
    public function getViewPath($view)
    {
        return $this->getViewNamespace().'default.'.$view;
    }

    /**
     * @param string $view
     * @param array  $data
     * @param array  $mergeData
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function view($view, $data = [], $mergeData = [])
    {
        return view($this->getViewPath($view), $data, $mergeData);
    }

    /**
     * @param string $title
     *
     * @return string
     */
    public function makeTitle($title)
    {
        return $title.' | '.config('sleeping_owl.title');
    }

    /**
     * @return string
     */
    public function getLogo()
    {
        return config('sleeping_owl.logo');
    }

    /**
     * @return string
     */
    public function getLogoMini()
    {
        return config('sleeping_owl.logo_mini');
    }
}
