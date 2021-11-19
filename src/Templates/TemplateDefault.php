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
        return 'AdminLTE 3 (BS4)';
    }

    /**
     * Версия темы.
     *
     * @return string
     */
    public function version()
    {
        return '3.0.1';
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
        try {
            // New version - with versioning tags. Travis was crashed with error:
            // Exception: The Mix manifest does not exist.
            if (config('sleeping_owl.dev_assets')) {
                $this->meta()->addJs('admin-default', mix('/js/admin-app-dev.js', $this->assetDir()));
            } else {
                $this->meta()->addJs('admin-default', mix('/js/admin-app.js', $this->assetDir()));
            }

            $this->meta()
                ->addJs('admin-vue-init', mix('/js/vue.js', $this->assetDir()))
                ->addJs('admin-modules-load', mix('/js/modules.js', $this->assetDir()))
                ->addCss('admin-default', mix('/css/admin-app.css', $this->assetDir()));
        } catch (Exception $e) {
            // Old version - without versioning tags

            if (config('sleeping_owl.dev_assets')) {
                $this->meta()->addJs('admin-default', $this->assetPath('js/admin-app-dev.js'));
            } else {
                $this->meta()->addJs('admin-default', $this->assetPath('js/admin-app.js'));
            }

            $this->meta()
                ->addJs('admin-vue-init', $this->assetPath('js/vue.js'))
                ->addJs('admin-modules-load', $this->assetPath('js/modules.js'))
                ->addCss('admin-default', $this->assetPath('css/admin-app.css'));
        }
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
