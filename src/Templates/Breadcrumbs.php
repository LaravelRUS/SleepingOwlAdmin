<?php

namespace SleepingOwl\Admin\Templates;

use DaveJamesMiller\Breadcrumbs\BreadcrumbsManager as BreadcrumbsManager;
use SleepingOwl\Admin\Contracts\Template\BreadcrumbsInterface as BreadcrumbsContract;
use \Illuminate\Support\HtmlString;

class Breadcrumbs extends BreadcrumbsManager implements BreadcrumbsContract
{
    /**
     * Render breadcrumbs for a page with the default view.
     *
     * @param string|null $name The name of the current page.
     * @param mixed ...$params The parameters to pass to the closure for the current page.
     * @return \Illuminate\Support\HtmlString The generated HTML.
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\InvalidBreadcrumbException if the name is (or any ancestor names are) not registered.
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\UnnamedRouteException if no name is given and the current route doesn't have an associated name.
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\ViewNotSetException if no view has been set.
     */
    public function render(string $name = null, ...$params): HtmlString
    {
        $view = config('breadcrumbs.view');

        if (! $view) {
            throw new ViewNotSetException('Breadcrumbs view not specified (check config/breadcrumbs.php)');
        }

        return $this->view($view, $name, ...$params);
    }

    /**
     * @param string|null $name
     *
     * @return string
     */
    public function renderIfExists($name = null)
    {
        if (is_null($name)) {
            $params = $this->currentRoute->get();
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
     * Render breadcrumbs for a page with the specified view.
     *
     * @param string $view The name of the view to render.
     * @param string|null $name The name of the current page.
     * @param mixed ...$params The parameters to pass to the closure for the current page.
     * @return \Illuminate\Support\HtmlString The generated HTML.
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\InvalidBreadcrumbException if the name is (or any ancestor names are) not registered.
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\UnnamedRouteException if no name is given and the current route doesn't have an associated name.
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\ViewNotSetException if no view has been set.
     */
    public function view(string $view, string $name = null, ...$params): HtmlString
    {
        $breadcrumbs = $this->generate($name, ...$params);

        $html = $this->viewFactory->make($view, compact('breadcrumbs'))->render();

        return new HtmlString($html);
    }
}
