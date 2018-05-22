<?php

namespace SleepingOwl\Admin\Configuration;

use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

trait ProvidesScriptVariables
{
    /**
     * Получение массива глобальных
     * переменных
     * для JavaScript.
     *
     * @return array
     */
    public function scriptVariables()
    {
        $lang = trans('sleeping_owl::lang');
        if ($lang == 'sleeping_owl::lang') {
            $lang = trans('sleeping_owl::lang', [], 'en');
        }

        return [
            'debug' => config('app.debug'),
            'env' => $this->app->environment(),
            'locale' => $this->app['translator']->getLocale(),
            'url' => $this->app['url']->to('/'),
            'lang' => $lang,
            'wysiwyg' => $this->config['wysiwyg'],
            'template' => $this->app[TemplateInterface::class]->toArray(),
            'user_id' => auth()->id(),
        ];
    }
}
