<?php

namespace SleepingOwl\Admin\Configuration;

use SleepingOwl\Admin\Traits\DatePicker;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

/**
 * Trait ProvidesScriptVariables.
 * @property-read \Illuminate\Foundation\Application $app
 */
trait ProvidesScriptVariables
{
    use DatePicker;

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
            'datetime_format' => $this->generatePickerFormat($this->config['datetimeFormat']),
            'date_format' => $this->generatePickerFormat($this->config['dateFormat']),
        ];
    }
}
