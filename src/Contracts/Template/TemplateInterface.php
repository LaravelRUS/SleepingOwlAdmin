<?php

namespace SleepingOwl\Admin\Contracts\Template;

use Diglactic\Breadcrumbs\Breadcrumbs;
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
    public function name(): string;

    /**
     * Версия темы.
     *
     * @return string
     */
    public function version(): string;

    /**
     * URL проекта.
     *
     * @return string
     */
    public function homepage(): string;

    /**
     * @return string
     */
    public function getViewNamespace(): string;

    /**
     * @param string $view
     * @return string
     */
    public function getViewPath(string $view): string;

    /**
     * @param  string|View  $view
     * @param  array  $data
     * @param array $mergeData
     * @return bool|Factory|View
     */
    public function view($view, array $data = [], array $mergeData = []);

    /**
     * @param string $key
     * @return string
     */
    public function renderBreadcrumbs(string $key);

    /**
     * @return Breadcrumbs
     */
    public function breadcrumbs();

    /**
     * @return MetaInterface
     */
    public function meta(): MetaInterface;

    /**
     * @param string $title
     * @return string
     */
    public function renderMeta(string $title): string;

    /**
     * @return NavigationInterface
     */
    public function navigation(): NavigationInterface;

    /**
     * @return string
     */
    public function renderNavigation(): string;

    /**
     * Получение относительного пути хранения asset файлов.
     *
     * @return string
     */
    public function assetDir(): string;

    /**
     * Генерация относительно пути до asset файлов для текущей темы.
     *
     * @param string|null $path  Относительный путь до файла, например `js/app.js`
     * @return string
     */
    public function assetPath(string $path = null): string;
}
