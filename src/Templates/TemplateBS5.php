<?php

namespace SleepingOwl\Admin\Templates;

use Exception;

class TemplateBS5 extends TemplateDefault
{
    /**
     * Получение названия текущего шаблона.
     *
     * @return string
     */
    public function name(): string
    {
        return 'Template BS5';
    }

    /**
     * Версия темы.
     *
     * @return string
     */
    public function version(): string
    {
        return '5.1.3';
    }

    /**
     * URL проекта.
     *
     * @return string
     */
    public function homepage(): string
    {
        return 'https://getbootstrap.com/';
    }

    /**
     * @throws Exception
     */
    public function initialize()
    {
        $this->meta()
//            ->addJs('admin-main-bs5', '//cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js')
//            ->addCss('admin-main-bs5', '//cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css')
//            ->addJs('admin-main-tw', '//cdn.tailwindcss.com')
;

//        /**
//         * Include jQuery.
//         */
//        if (config('sleeping_owl.templateParam.jquery') && config('sleeping_owl.templateParam.jqueryPath')) {
//            $this->meta()->addJs('admin-jq', config('sleeping_owl.templateParam.jqueryPath'));
//        }

        if (config('sleeping_owl.dev_assets')) {
            $this->meta()->addJs('admin-bs5', mix('bs5/js/admin-app-dev.js', $this->mainAsset()));
        } else {
            $this->meta()->addJs('admin-bs5', mix('bs5/js/admin-app.js', $this->mainAsset()));
        }

        /**
         * Include Vue, Modules && Styles.
         */
        $this->meta()
            ->addJs('admin-vue-init', mix('default/js/vue.js', $this->mainAsset()))
            ->addJs('admin-modules-load', mix('default/js/modules.js', $this->mainAsset()))
            ->addCss('admin-bs5', mix('bs5/css/admin-app.css', $this->mainAsset()));
    }

    /**
     * @return string
     */
    public function getViewNamespace(): string
    {
        return 'sleeping_owl::bs5';
    }

    /**
     * Получение относительного пути
     * расположения asset файлов.
     *
     * @return string
     */
    public function assetDir(): string
    {
        return 'packages/sleepingowl/bs5';
    }
}
