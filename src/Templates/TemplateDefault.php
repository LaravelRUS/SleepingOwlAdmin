<?php

namespace SleepingOwl\Admin\Templates;

class TemplateDefault extends Template
{
    /**
     * Получение названия текущего шаблона.
     *
     * @return string
     */
    public function name()
    {
        return 'AdminLTE 2';
    }

    /**
     * Версия темы.
     *
     * @return string
     */
    public function version()
    {
        return '2.3.8';
    }

    /**
     * URL проекта.
     *
     * @return string
     */
    public function homepage()
    {
        return 'https://almsaeedstudio.com/';
    }

    public function initialize()
    {
        $this->meta()
            ->addJs('admin-default', $this->assetPath('js/admin-app.js'))
            ->addJs('admin-vue-init', $this->assetPath('js/vue.js'))
            ->addJs('admin-modules-load', $this->assetPath('js/modules.js'))
            ->addCss('admin-default', $this->assetPath('css/admin-app.css'));
    }

    /**
     * @return string
     */
    public function getViewNamespace()
    {
        return 'sleeping_owl::default';
    }

    /**
     * Получение относительного пути �
     * ранения asset файлов.
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
    public function getLogoMini()
    {
        return config('sleeping_owl.logo_mini');
    }
}
