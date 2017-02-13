<?php

namespace SleepingOwl\Admin\Configuration;

trait ProvidesScriptVariables
{

    /**
     * Получение массива глобальных переменных для JavaScript
     *
     * @return array
     */
    public function scriptVariables()
    {
        $lang = trans('sleeping_owl::lang');
        if ($lang == 'sleeping_owl::lang') {
            $lang = trans('sleeping_owl::lang', [], 'messages', 'en');
        }

        return [
            'debug' => config('app.debug'),
            'env' => $this->app->environment(),
            'locale' => $this->app['translator']->getLocale(),
            'url_prefix' => $this->config['url_prefix'],
            'asset_url' => asset('/'),
            'url' => $this->app['url']->to(''),
            'lang' => $lang,
            'wysiwyg' => $this->config['wysiwyg'],
        ];
    }
}