<?php

namespace SleepingOwl\Admin\Templates;

use Diglactic\Breadcrumbs\Exceptions\InvalidBreadcrumbException;
use Diglactic\Breadcrumbs\Exceptions\UnnamedRouteException;
use Diglactic\Breadcrumbs\Exceptions\ViewNotSetException;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
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
    public function longName(): string
    {
        return $this->name().' v.'.$this->version();
    }

    /**
     * @return
     */
    public function breadcrumbs()
    {
        return $this->breadcrumbs;
    }

    /**
     * @return MetaInterface
     */
    public function meta(): MetaInterface
    {
        return $this->meta;
    }

    /**
     * @return NavigationInterface
     */
    public function navigation(): NavigationInterface
    {
        return $this->navigation;
    }

    /**
     * Генерация относительно пути до asset файлов для текущей темы.
     *
     * @param  string|null  $path  относительный путь до файла, например `js/app.js`
     * @return string
     */
    public function assetPath(string $path = null): string
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
    public function makeTitle(string $title, string $separator = ' | ')
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
    public function getViewPath(string $view): string
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
     * @return Factory|View
     */
    public function view($view, array $data = [], array $mergeData = [])
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
     * @throws InvalidBreadcrumbException
     * @throws UnnamedRouteException
     * @throws ViewNotSetException
     */
    public function renderBreadcrumbs(string $key)
    {
        if (config('sleeping_owl.breadcrumbs')) {
            config()->set('breadcrumbs.view', $this->getViewPath('_partials.breadcrumbs'));

            return $this->breadcrumbs()->renderIfExists($key);
        }
    }

    /**
     * @return string
     */
    public function renderNavigation(): string
    {
        return $this->navigation()->render(
            $this->getViewPath('_partials.navigation.navigation')
        );
    }

    /**
     * Регистрация стандартных
     * глобальных
     * Javascript переменных
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
    public function renderMeta(string $title): string
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
     * Получение пути расположения asset файлов.
     *
     * @return string
     */
    public function mainAsset()
    {
        return 'packages/sleepingowl';
    }

    /**
     * Render func.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'asset_dir' => $this->assetDir(),
            'view_namespace' => $this->getViewNamespace(),
            'name' => $this->name(),
            'version' => $this->version(),
            'homepage' => $this->homepage(),
        ];
    }

    /**
     * Increases or decreases the brightness of a color by a percentage of the current brightness.
     *
     * @param  string  $hexCode  Supported formats: `#FFF`, `#FFFFFF`, `FFF`, `FFFFFF`
     * @param  float  $adjustPercent  A number between -1 and 1. E.g. 0.3 = 30% lighter; -0.4 = 40% darker.
     * @return string
     */
    public function colorConvert($hexCode, $adjustPercent)
    {
        $hexCode = ltrim($hexCode, '#');

        if (strlen($hexCode) == 3) {
            $hexCode = $hexCode[0].$hexCode[0].$hexCode[1].$hexCode[1].$hexCode[2].$hexCode[2];
        }

        $hexCode = array_map('hexdec', str_split($hexCode, 2));

        foreach ($hexCode as &$color) {
            $adjustableLimit = $adjustPercent < 0 ? $color : 255 - $color;
            $adjustAmount = ceil($adjustableLimit * $adjustPercent);

            $color = str_pad(dechex($color + $adjustAmount), 2, '0', STR_PAD_LEFT);
        }

        return '#'.implode($hexCode);
    }
}
