<?php

namespace SleepingOwl\Admin\Templates;

use DaveJamesMiller\Breadcrumbs\Manager;
use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

class TemplateDefault implements TemplateInterface
{
    /**
     * @var Application
     */
    protected $app;

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
     * @param Application $application
     * @param MetaInterface $meta
     * @param NavigationInterface $navigation
     * @param Manager $breadcrumbs
     */
    public function __construct(Application $application, MetaInterface $meta, NavigationInterface $navigation, Manager $breadcrumbs)
    {
        $this->app = $application;
        $this->meta = $meta;
        $this->navigation = $navigation;
        $this->breadcrumbs = $breadcrumbs;
    }

    public function initialize()
    {
        $this->meta->addJs('admin-default', resources_url('js/admin-app.js'), ['admin-scripts'])
            ->addJs('admin-scripts', route('admin.scripts'))
            ->addCss('admin-default', resources_url('css/admin-app.css'));
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
     * @return string
     */
    public function getTitle()
    {
        return config('sleeping_owl.title');
    }

    /**
     * @param string $title
     * @param string $separator
     *
     * @return string
     */
    public function makeTitle($title, $separator = ' | ')
    {
        if (empty($title)) {
            return $this->getTitle();
        }

        return $title."{$separator}".$this->getTitle();
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
            $this->breadcrumbs()->setView(
                $this->getViewPath('_partials.breadcrumbs')
            );

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
}
