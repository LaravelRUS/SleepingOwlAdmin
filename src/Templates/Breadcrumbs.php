<?php

namespace SleepingOwl\Admin\Templates;

use Diglactic\Breadcrumbs\Exceptions\DuplicateBreadcrumbException;
use Diglactic\Breadcrumbs\Exceptions\InvalidBreadcrumbException;
use Diglactic\Breadcrumbs\Exceptions\UnnamedRouteException;
use Diglactic\Breadcrumbs\Exceptions\ViewNotSetException;
use Diglactic\Breadcrumbs\Manager as BreadcrumbsManager;
use Exception;
use Illuminate\Support\Facades\Log;
use SleepingOwl\Admin\Contracts\Template\BreadcrumbsInterface as BreadcrumbsContract;

class Breadcrumbs extends BreadcrumbsManager implements BreadcrumbsContract
{
    /**
     * @param  string|null  $name
     * @return string
     */
    public function renderIfExists(string $name = null): string
    {
        if (is_null($name)) {
            $params = $this->getCurrentRoute();
            $name = $params[0];
        }

        if (! $this->exists($name)) {
            return '';
        }

        try {
            $render = $this->render($name);
        } catch (Exception $e) {
            $render = $this->render('home');
            Log::error($e->getMessage());
        }

        return $render;
    }

    /**
     * @param  string  $name
     * @param  array  $params
     * @return string
     */
    public function renderArray(string $name, ...$params): string
    {
        return $this->render($name, ...$params);
    }

    /**
     * @param  string  $name
     * @param  array  $params
     * @return string
     */
    public function renderIfExistsArray(string $name, array $params = []): string
    {
        if (! $this->exists($name)) {
            return '';
        }

        return $this->renderArray($name, $params);
    }


    /**
     * Register Breadcrumbs.
     * Add in old version.
     *
     * @throws DuplicateBreadcrumbException
     */
    public function register(string $name, callable $callback): void
    {
        $this->for($name, $callback);
    }
}
