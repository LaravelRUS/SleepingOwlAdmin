<?php

namespace SleepingOwl\Admin\Templates;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\View\View;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

abstract class Template implements TemplateInterface
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var MetaInterface
     */
    protected $meta;

    /**
     * @var NavigationInterface
     */
    protected $navigation;

    /**
     * @var Breadcrumbs
     */
    protected $breadcrumbs;

    /**
     * @var AdminInterface
     */
    protected $admin;

    /**
     * TemplateDefault constructor.
     *
     * @param  Application  $application
     * @param  AdminInterface  $admin
     * @param  MetaInterface  $meta
     * @param  NavigationInterface  $navigation
     * @param  Breadcrumbs  $breadcrumbs
     */
    public function __construct(
        Application $application,
        AdminInterface $admin,
        MetaInterface $meta,
        NavigationInterface $navigation,
        Breadcrumbs $breadcrumbs
    ) {
        $this->app = $application;
        $this->meta = $meta;
        $this->navigation = $navigation;
        $this->breadcrumbs = $breadcrumbs;
        $this->admin = $admin;
    }

    /**
     * Название с указанием версии.
     *
     * @return string
     */
    public function longName()
    {
        return $this->name().' v.'.$this->version();
    }

    /**
     * @return Breadcrumbs
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
     * Генерация относительно пути до asset файлов для текущей темы.
     *
     * @param  string  $path  относительный путь до файла, например `js/app.js`
     * @return string
     */
    public function assetPath($path = null)
    {
        return ! is_null($path) ? $this->assetDir().'/'.ltrim($path, '/') : $this->assetDir();
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return config('sleeping_owl.title');
    }

    /**
     * @param  string  $title
     * @param  string  $separator
     * @return string
     */
    public function makeTitle($title, $separator = ' | ')
    {
        if (empty($title)) {
            return $this->getTitle();
        }

        return strip_tags($title)."{$separator}".$this->getTitle();
    }

    /**
     * @param  string  $view
     * @return string
     */
    public function getViewPath($view)
    {
        if ($view instanceof View) {
            return $view->getPath();
        }

        if (strpos($view, '::') !== false) {
            return $view;
        }

        return $this->getViewNamespace().'.'.$view;
    }

    /**
     * @param  string|View  $view
     * @param  array  $data
     * @param  array  $mergeData
     * @return \Illuminate\Contracts\View\Factory|View
     */
    public function view($view, array $data = [], $mergeData = [])
    {
        $data['template'] = $this;

        if ($view instanceof View) {
            return $view->with($data);
        }

        return view($this->getViewPath($view), $data, $mergeData);
    }

    /**
     * @param  string  $key
     * @return string
     *
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\InvalidBreadcrumbException
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\UnnamedRouteException
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\ViewNotSetException
     */
    public function renderBreadcrumbs($key)
    {
        if (config('sleeping_owl.breadcrumbs')) {
            config()->set('breadcrumbs.view', $this->getViewPath('_partials.breadcrumbs'));

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
     * Регистрация стандартных
     * глобальных
     * Javascript перменных
     * .
     */
    protected function setGlobalVariables()
    {
        $globalVars = $this->admin->scriptVariables();

        foreach ($globalVars as $var => $value) {
            $this->meta->putGlobalVar($var, $value);
        }
    }

    /**
     * @param  string  $title
     * @return string
     */
    public function renderMeta($title)
    {
        $this->setGlobalVariables();

        return $this->meta()
            ->setTitle($this->makeTitle($title))
            ->addMeta(['charset' => 'utf-8'], 'meta::charset')
            ->addMeta(['content' => csrf_token(), 'name' => 'csrf-token'])
            ->addMeta(['content' => 'width=device-width, initial-scale=1', 'name' => 'viewport'])
            ->addMeta(['content' => 'IE=edge', 'http-equiv' => 'X-UA-Compatible'])
            ->render();
    }

    /**
     * Render func.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'asset_dir' => $this->assetDir(),
            'view_namespace' => $this->getViewNamespace(),
            'name' => $this->name(),
            'version' => $this->version(),
            'homepage' => $this->homepage(),
        ];
    }
}
