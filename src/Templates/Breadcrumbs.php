<?php

namespace SleepingOwl\Admin\Templates;

use DaveJamesMiller\Breadcrumbs\Manager as BreadcrumbsManager;
use SleepingOwl\Admin\Contracts\Template\Breadcrumbs as BreadcrumbsContract;

class Breadcrumbs extends BreadcrumbsManager implements BreadcrumbsContract
{
    /**
     * @param string|null $name
     *
     * @return string
     */
    public function render($name = null)
    {
        if (is_null($name)) {
            list($name, $params) = $this->currentRoute->get();
        } else {
            $params = array_slice(func_get_args(), 1);
        }

        return $this->view($this->generator->generate($this->callbacks, $name, $params));
    }

    /**
     * @param string|null $name
     *
     * @return string
     */
    public function renderIfExists($name = null)
    {
        if (is_null($name)) {
            list($name, $params) = $this->currentRoute->get();
        }

        if (! $this->exists($name)) {
            return '';
        }

        return $this->render($name);
    }

    /**
     * @param string $name
     * @param array $params
     *
     * @return string
     */
    public function renderArray($name, $params = [])
    {
        return $this->view($this->generator->generate($this->callbacks, $name, $params));
    }

    /**
     * @param string $name
     * @param array $params
     *
     * @return string
     */
    public function renderIfExistsArray($name, $params = [])
    {
        if (! $this->exists($name)) {
            return '';
        }

        return $this->renderArray($name, $params);
    }

    /**
     * @param array $breadcrumbs
     *
     * @return string
     */
    protected function view(array $breadcrumbs)
    {
        return $this->view->render($this->viewName, $breadcrumbs);
    }
}
