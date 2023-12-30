<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class DisplayDatatablesAsyncAlterPaginate extends DisplayDatatablesAsync implements WithRoutesInterface
{
    /**
     * Register display routes.
     *
     * @param  Router  $router
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.display.async.alter_paginate';
        if (! $router->has($routeName)) {
            $router->get('{adminModel}/async/alter_paginate/{adminDisplayName?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\AlterPaginateDisplayController@async',
            ]);
        }

        $routeName = 'admin.display.async.inlineEdit';
        if (! $router->has($routeName)) {
            $router->post('{adminModel}/async/{adminDisplayName?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\AdminController@inlineEdit',
            ]);
        }
    }

    /**
     * Render async request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function renderAsync(Request $request)
    {
        $query = $this->getRepository()->getQuery();
        $totalCount = 0;
        $filteredCount = 0;

        if (! is_null($this->distinct)) {
            $filteredCount = $query->distinct()->count($this->getDistinct());
        }

        $this->modifyQuery($query);
        $this->applySearch($query, $request);

        if (is_null($this->distinct)) {
            $countQuery = clone $query;
            $countQuery->getQuery()->orders = null;
            $filteredCount = 500;
        }

        $this->applyOffset($query, $request);
        $collection = $query->get();

        return $this->prepareDatatablesStructure($request, $collection, $totalCount, $filteredCount);
    }
}
