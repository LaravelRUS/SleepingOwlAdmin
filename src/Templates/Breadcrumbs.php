<?php

namespace SleepingOwl\Admin\Templates;

use Diglactic\Breadcrumbs\Manager;
use Exception;
use Illuminate\Support\Facades\Log;
use SleepingOwl\Admin\Contracts\Template\BreadcrumbsInterface as BreadcrumbsContract;

class Breadcrumbs extends Manager implements BreadcrumbsContract
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
}
