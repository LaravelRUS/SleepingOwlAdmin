<?php

namespace SleepingOwl\Admin\Templates;

use Diglactic\Breadcrumbs\Exceptions\InvalidBreadcrumbException;
use Diglactic\Breadcrumbs\Exceptions\UnnamedRouteException;
use Diglactic\Breadcrumbs\Exceptions\ViewNotSetException;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\View\View;
use SleepingOwl\Admin\Assets\PublishedAssetHealth;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Navigation\NavigationInterface;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\ThemeConfiguration;
use SleepingOwl\Admin\Themes\ThemeSelection;

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
     * string VendorVersion.
     */
    protected string $ver = '<b>Ver:</b> dev.2608.2600';

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
     * @return Breadcrumbs
     */
    public function breadcrumbs(): Breadcrumbs
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
     * @param  string  $path  относительный путь до файла, например `js/app.js`
     * @return string
     */
    public function assetPath($path = null): string
    {
        return ! is_null($path) ? $this->assetDir().'/'.ltrim($path, '/') : $this->assetDir();
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return config('sleeping_owl.ui.title');
    }

    /**
     * @param  string  $title
     * @param  string  $separator
     * @return string
     */
    public function makeTitle($title, $separator = ' | '): string
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
    public function getViewPath($view): string
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
    public function view($view, array $data = [], $mergeData = [])
    {
        $data = array_replace($data, $this->themeViewData(), [
            'template' => $this,
        ]);

        if ($view instanceof View) {
            return $view->with($data);
        }

        return view($this->getViewPath($view), $data, $mergeData);
    }

    private function themeViewData(): array
    {
        if (! $this->app->bound(ThemeInterface::class) || ! $this->app->bound(ThemeConfiguration::class)) {
            return [];
        }

        return [
            'theme' => $this->app->make(ThemeInterface::class),
            'themeName' => $this->app->make(ThemeSelection::class)->name(),
            'themeConfig' => $this->app->make(ThemeConfiguration::class),
            'assetHealthStatus' => $this->assetHealthStatus(),
        ];
    }

    private function assetHealthStatus(): mixed
    {
        if (! $this->app->bound(PublishedAssetHealth::class)) {
            return null;
        }

        return $this->app->make(PublishedAssetHealth::class)->status();
    }

    /**
     * @param  string  $key
     * @return string|void
     *
     * @throws InvalidBreadcrumbException
     * @throws UnnamedRouteException
     * @throws ViewNotSetException
     */
    public function renderBreadcrumbs($key)
    {
        if (config('sleeping_owl.ui.breadcrumbs')) {
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
     * Registering standard global Javascript variables.
     */
    protected function setGlobalVariables(): void
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
    public function renderMeta($title): string
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
     * Displaying the version in the footer.
     *
     * @return string
     */
    public function getVersion(): string
    {
        if (config('sleeping_owl.ui.version_text')) {
            $this->ver = config('sleeping_owl.ui.version_text');
        }

        return $this->ver;
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
}
