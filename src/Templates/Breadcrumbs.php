<?php

namespace SleepingOwl\Admin\Templates;

use DaveJamesMiller\Breadcrumbs\BreadcrumbsManager;
use DaveJamesMiller\Breadcrumbs\Exceptions\ViewNotSetException;
use SleepingOwl\Admin\Contracts\Template\BreadcrumbsInterface as BreadcrumbsContract;

class Breadcrumbs extends BreadcrumbsManager implements BreadcrumbsContract
{
    /**
     * @param string|null $name
     *
     * @return string
     * @throws ViewNotSetException
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\InvalidBreadcrumbException
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\UnnamedRouteException
     */
    public function renderIfExists($name = null)
    {
        if (is_null($name)) {
            $params = $this->getCurrentRoute();
            $name = $params[0];
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
     * @throws ViewNotSetException
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\InvalidBreadcrumbException
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\UnnamedRouteException
     */
    public function renderArray($name, ...$params)
    {
        return $this->render($name, ...$params);
        // return $this->view($this->generator->generate($this->callbacks, $name, $params));
    }

    /**
     * @param string $name
     * @param array $params
     *
     * @return string
     * @throws ViewNotSetException
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\InvalidBreadcrumbException
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\UnnamedRouteException
     */
    public function renderIfExistsArray($name, $params = [])
    {
        if (! $this->exists($name)) {
            return '';
        }

        return $this->renderArray($name, $params);
    }
}
