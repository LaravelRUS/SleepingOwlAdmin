<?php

namespace SleepingOwl\Admin\Configuration;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Request;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Traits\DatePicker;
use SleepingOwl\Admin\Traits\MaxFileSizeTrait;

/**
 * Trait ProvidesScriptVariables.
 *
 * @property-read Application $app
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

        $datatablesSettings = $this->config['datatables_settings'] ?? [];
        $stateDatatables = $datatablesSettings['state_datatables'] ?? true;
        $stateFilters = $datatablesSettings['state_filters'] ?? false;
        if (! $stateDatatables) {
            $stateFilters = false;
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
            'datatables_settings' => [
                'state_datatables' => $stateDatatables,
                'state_filters' => $stateFilters,
                'state_tabs' => $datatablesSettings['state_tabs'] ?? false,
                'datatables_highlight' => $datatablesSettings['datatables_highlight'] ?? false,
                'page_jump' => $datatablesSettings['page_jump'] ?? true,
                'datatables_inline_edit_refresh' => $datatablesSettings['datatables_inline_edit_refresh'] ?? 'row',
            ],
            'lang' => $lang,
        ];
    }
}
