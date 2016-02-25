<?php

namespace SleepingOwl\Admin\Contracts;

interface TemplateInterface
{
    /**
     * @return string
     */
    public function getViewNamespace();

    /**
     * @param string $view
     *
     * @return string
     */
    public function getViewPath($view);

    /**
     * @param string $view
     * @param array  $data
     * @param array  $mergeData
     *
     * @return \BladeView|bool|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function view($view, $data = [], $mergeData = []);
}
