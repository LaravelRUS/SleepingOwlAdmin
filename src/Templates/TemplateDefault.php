<?php

namespace SleepingOwl\Admin\Templates;

use DaveJamesMiller\Breadcrumbs\Manager;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use KodiCMS\Assets\Contracts\MetaInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;

class TemplateDefault implements TemplateInterface
{
    /**
     * @var Factory
     */
    protected $view;

    /**
     * @var Manager|bool
     */
    protected $breadcrumbs = false;

    /**
     * @var string
     */
    protected $title;

    /**
     * @var string
     */
    protected $logo;

    /**
     * @var string
     */
    protected $logoMini;

    /**
     * TemplateDefault constructor.
     * @param Factory $view
     * @param Manager|false $breadcrumbs
     * @param Repository $config
     */
    public function __construct(Factory $view, $breadcrumbs, Repository $config)
    {
        $this->view = $view;

        if ($breadcrumbs instanceof Manager) {
            $this->breadcrumbs = $breadcrumbs;
        }

        $this->title = $config->get('sleeping_owl.title');
        $this->logo = $config->get('sleeping_owl.logo');
        $this->logoMini = $config->get('sleeping_owl.logo_mini');
    }

    public function boot(MetaInterface $meta, UrlGenerator $generator)
    {
        $meta->loadPackage('admin-default');

        $meta->AddJs('adminScripts', $generator->route('admin.scripts'), ['libraries']);
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
        if ($view instanceof View) {
            /* @var \Illuminate\View\View $view */
            return $view->getPath();
        }

        return $this->getViewNamespace().'default.'.$view;
    }

    /**
     * @param string|\Illuminate\View\View $view
     * @param array  $data
     * @param array  $mergeData
     *
     * @return \Illuminate\Contracts\View\Factory|View
     */
    public function view($view, $data = [], $mergeData = [])
    {
        if ($view instanceof View) {
            return $view->with($data);
        }

        return $this->view->make($this->getViewPath($view), $data, $mergeData);
    }

    /**
     * @param string $title
     *
     * @return string
     */
    public function makeTitle($title)
    {
        return $title.' | '.$this->title;
    }

    /**
     * @return string
     */
    public function getLogo()
    {
        return $this->logo;
    }

    /**
     * @return string
     */
    public function getLogoMini()
    {
        return $this->logoMini;
    }

    /**
     * @param string $key
     *
     * @return string
     */
    public function renderBreadcrumbs($key)
    {
        if ($this->breadcrumbs instanceof Manager) {
            return $this->breadcrumbs->renderIfExists($key);
        }
    }
}
