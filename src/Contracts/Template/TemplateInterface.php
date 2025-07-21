<?php

namespace SleepingOwl\Admin\Contracts\Template;

use Diglactic\Breadcrumbs\Manager as BreadcrumbsManager;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\View\Factory;
use Illuminate\View\View;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;

interface TemplateInterface extends Initializable, Arrayable
{
    /**
     * Получение названия текущего шаблона.
     *
     * @return string
     */
    public function name();

    /**
     * Версия темы.
     *
     * @return string
     */
    public function version();

    /**
     * URL проекта.
     *
     * @return string
     */
    public function homepage();

    /**
     * @return string
     */
    public function getViewNamespace();

    /**
     * @param  string  $view
     * @return string
     */
    public function getViewPath($view);

    /**
     * @param  string|View  $view
     * @param  array  $data
     * @param  array  $mergeData
     * @return bool|Factory|View
     */
    public function view($view, array $data = [], $mergeData = []);

    /**
     * @param  string  $key
     * @return string
     */
    public function renderBreadcrumbs($key);

    /**
     * @return BreadcrumbsManager
     */
    public function breadcrumbs();

    /**
     * @return MetaInterface
     */
    public function meta();

    /**
     * @param  string  $title
     * @return string
     */
    public function renderMeta($title);

    /**
     * @return NavigationInterface
     */
    public function navigation();

    /**
     * @return string
     */
    public function renderNavigation();

    /**
     * Получение относительного пути �
     * ранения asset файлов.
     *
     * @return string
     */
    public function assetDir();

    /**
     * Генерация относительно пути до asset файлов для текущей темы.
     *
     * @param  string  $path  относительный путь до файла, например `js/app.js`
     * @return string
     */
    public function assetPath($path = null);
}
