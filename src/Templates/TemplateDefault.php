<?php

namespace SleepingOwl\Admin\Templates;

use Exception;

class TemplateDefault extends Template
{
    /**
     * Получение названия текущего шаблона.
     *
     * @return string
     */
    public function name()
    {
        return 'AdminLTE 4 (BS5)';
    }

    /**
     * Версия темы.
     *
     * @return string
     */
    public function version()
    {
        return '4.9.1';
    }

    /**
     * URL проекта.
     *
     * @return string
     */
    public function homepage()
    {
        return 'https://adminlte.io/';
    }

    public function initialize()
    {
        $paths = $this->assetPaths();

        try {
            $assets = $this->resolveAssets($paths, fn ($path) => mix('/'.$path, $this->assetDir()));
        } catch (Exception $e) {
            $assets = $this->resolveAssets($paths, fn ($path) => $this->assetPath($path));
        }

        $this->registerAssets($this->versionUnversionedAssets($paths, $assets));
    }

    private function assetPaths(): array
    {
        $suffix = config('sleeping_owl.dev_assets') ? '-dev' : '';

        return [
            'app' => "js/admin-app{$suffix}.js",
            'vue' => "js/vue{$suffix}.js",
            'modules' => 'js/modules.js',
            'css' => 'css/admin-app.css',
        ];
    }

    private function resolveAssets(array $paths, callable $resolve): array
    {
        return array_map($resolve, $paths);
    }

    private function versionUnversionedAssets(array $paths, array $assets): array
    {
        foreach ($assets as $name => $url) {
            $url = (string) $url;
            $publishedPath = public_path($this->assetPath($paths[$name]));

            if (! str_contains($url, '?id=') && is_file($publishedPath)) {
                $version = md5_file($publishedPath);
                if ($version !== false) {
                    $url .= '?id='.$version;
                }
            }

            $assets[$name] = $url;
        }

        return $assets;
    }

    private function registerAssets(array $assets): void
    {
        $this->meta()
            ->addJs('admin-default', $assets['app'])
            ->addJs('admin-vue-init', $assets['vue'])
            ->addJs('admin-modules-load', $assets['modules'])
            ->addCss('admin-default', $assets['css']);
    }

    /**
     * @return string
     */
    public function getViewNamespace()
    {
        return 'sleeping_owl::default';
    }

    /**
     * Получение относительного пути
     * расположения asset файлов.
     *
     * @return string
     */
    public function assetDir()
    {
        return 'packages/sleepingowl/default';
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
    public function getMenuTop()
    {
        return config('sleeping_owl.menu_top');
    }

    /**
     * @return string
     */
    public function getLogoMini()
    {
        return config('sleeping_owl.logo_mini');
    }
}
