<?php

namespace SleepingOwl\Admin\Templates;

use Diglactic\Breadcrumbs\Exceptions\InvalidBreadcrumbException;
use Diglactic\Breadcrumbs\Exceptions\UnnamedRouteException;
use Diglactic\Breadcrumbs\Exceptions\ViewNotSetException;
use Diglactic\Breadcrumbs\Manager as BreadcrumbsManager;
use Illuminate\Support\Facades\Log;
use SleepingOwl\Admin\Contracts\Template\BreadcrumbsInterface as BreadcrumbsContract;

class Breadcrumbs extends BreadcrumbsManager implements BreadcrumbsContract
{
    /**
     * @param  string|null  $name
     * @return string
     *
     * @throws ViewNotSetException
     * @throws InvalidBreadcrumbException
     * @throws UnnamedRouteException
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

        $render = '';
        try {
            $render = $this->render($name);
        } catch (\Exception $e) {
            $render = $this->render('home');
            Log::error($e->getMessage());
        }

        return $render;
    }

    /**
     * @param  string  $name
     * @param  array  $params
     * @return string
     *
     * @throws ViewNotSetException
     * @throws InvalidBreadcrumbException
     * @throws UnnamedRouteException
     */
    public function renderArray($name, ...$params)
    {
        return $this->render($name, ...$params);
    }

    /**
     * @param  string  $name
     * @param  array  $params
     * @return string
     *
     * @throws ViewNotSetException
     * @throws InvalidBreadcrumbException
     * @throws UnnamedRouteException
     */
    public function renderIfExistsArray($name, $params = [])
    {
        if (! $this->exists($name)) {
            return '';
        }

        return $this->renderArray($name, $params);
    }
}
