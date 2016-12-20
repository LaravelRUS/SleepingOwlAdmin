<?php

namespace SleepingOwl\Admin\Templates;

use DaveJamesMiller\Breadcrumbs\Manager;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

class TemplateDefault implements TemplateInterface
{
    /**
     * @var MetaInterface
     */
    private $meta;

    /**
     * @var NavigationInterface
     */
    private $navigation;

    /**
     * @var Manager
     */
    private $breadcrumbs;

    /**
     * TemplateDefault constructor.
     *
     * @param Manager $breadcrumbs
     * @param MetaInterface $meta
     * @param NavigationInterface $navigation
     */
    public function __construct(
        Manager $breadcrumbs,
        MetaInterface $meta,
        NavigationInterface $navigation
    ) {
        $this->meta = $meta;
        $this->navigation = $navigation;
        $this->breadcrumbs = $breadcrumbs;
    }

    /**
     * @return Manager
     */
    public function breadcrumbs()
    {
        return $this->breadcrumbs;
    }

    /**
     * @return MetaInterface
     */
    public function meta()
    {
        return $this->meta;
    }

    /**
     * @return NavigationInterface
     */
    public function navigation()
    {
        return $this->navigation;
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
        if ($view instanceof \Illuminate\View\View) {
            return $view->getPath();
        }

        return $this->getViewNamespace().'default.'.$view;
    }

    /**
     * @param string|\Illuminate\View\View $view
     * @param array  $data
     * @param array  $mergeData
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function view($view, array $data = [], $mergeData = [])
    {
        $data['template'] = $this;

        if ($view instanceof \Illuminate\View\View) {
            return $view->with($data);
        }

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

    /**
     * @param string $key
     *
     * @return string
     */
    public function renderBreadcrumbs($key)
    {
        if (config('sleeping_owl.breadcrumbs')) {
            $this->breadcrumbs()->setView($this->getViewPath('_partials.breadcrumbs'));

            return $this->breadcrumbs()->renderIfExists($key);
        }
    }

    /**
     * @return string
     */
    public function renderNavigation()
    {
        return $this->navigation()->render(
            $this->getViewPath('_partials.navigation.navigation')
        );
    }

    /**
     * @param string $title
     *
     * @return string
     */
    public function renderMeta($title)
    {
        return $this->meta()
            ->setTitle($this->makeTitle($title))
            ->addMeta(['charset' => 'utf-8'], 'meta::charset')
            ->addMeta(['content' => csrf_token(), 'name' => 'csrf-token'])
            ->addMeta(['content' => 'width=device-width, initial-scale=1', 'name' => 'viewport'])
            ->addMeta(['content' => 'IE=edge', 'http-equiv' => 'X-UA-Compatible'])
            ->render();
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        $this->meta
            ->addJs('admin-default', resources_url('js/admin-app.js'), ['admin-scripts'])
            ->addJs('admin-scripts', route('admin.scripts'))
            ->addCss('admin-default', resources_url('css/admin-app.css'));
    }
}
