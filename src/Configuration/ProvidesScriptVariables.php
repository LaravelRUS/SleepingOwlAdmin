<?php

namespace SleepingOwl\Admin\Configuration;

use Illuminate\Support\Facades\Request;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Traits\DatePicker;
use SleepingOwl\Admin\Traits\MaxFileSizeTrait;

/**
 * Trait ProvidesScriptVariables.
 *
 * @property-read \Illuminate\Foundation\Application $app
 */
trait ProvidesScriptVariables
{
    use DatePicker, MaxFileSizeTrait;

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

        // $maxFileSize = $this->convertMB(ini_get('upload_max_filesize'));

        $state_filters = $this->config['state_filters'];
        if (! $this->config['state_datatables']) {
            $state_filters = false;
        }

        return [
            'debug' => config('app.debug'),
            'env' => $this->app->environment(),
            'locale' => $this->app['translator']->getLocale(),
            'url' => $this->app['url']->to('/'),
            'url_path' => Request::path(),
            'url_prefix' => $this->config['url_prefix'],
            'wysiwyg' => $this->config['wysiwyg'],
            'template' => $this->app[TemplateInterface::class]->toArray(),
            'user_id' => auth()->id(),
            'max_file_size' => $this->getMaxFileSize(),
            'datetime_format' => $this->generatePickerFormat($this->config['datetimeFormat']),
            'date_format' => $this->generatePickerFormat($this->config['dateFormat']),
            'state_datatables' => $this->config['state_datatables'],
            'datatables_highlight' => $this->config['datatables_highlight'],
            'state_tabs' => $this->config['state_tabs'],
            'state_filters' => $state_filters,
            'lang' => $lang,
        ];
    }
}
