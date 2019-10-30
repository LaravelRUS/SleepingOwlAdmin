<?php

namespace SleepingOwl\Admin\Configuration;

use SleepingOwl\Admin\Traits\DatePicker;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use Illuminate\Support\Facades\Request;

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
            'url_path' => Request::path(),
            'wysiwyg' => $this->config['wysiwyg'],
            'template' => $this->app[TemplateInterface::class]->toArray(),
            'user_id' => auth()->id(),
            'datetime_format' => $this->generatePickerFormat($this->config['datetimeFormat']),
            'date_format' => $this->generatePickerFormat($this->config['dateFormat']),
            'state_datatables' => $this->config['state_datatables'],
            'state_tabs' => $this->config['state_tabs'],
            'state_filters' => $this->config['state_filters'],
            'lang' => $lang,
        ];
    }
}
