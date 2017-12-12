<?php

namespace SleepingOwl\Admin\Http\Request;

use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Display\Column\Control;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class ExportModelHandler
{
    /**
     * @var DisplayTable
     */
    protected $display;

    /**
     * Initialize DisplayTable.
     *
     * @param ModelConfigurationInterface $model
     * @throws \Exception
     */
    public function initDisplay(ModelConfigurationInterface $model)
    {
        /** @var DisplayTable $display */
        $display = $model->onDisplay();

        if (! $display instanceof DisplayTable) {
            throw new \Exception('Display is not instance of "'.DisplayTable::class.'" class');
        }

        $display->setModelClass($model->getClass());
        $display->initialize();
        $display->disablePagination();

        $this->display = $display;
    }

    /**
     * Return data array without pagination.
     *
     * @return array
     */
    protected function getCollectionArray()
    {
        return $this->display->getCollection()->map(function ($model) {
            return $this->display->getColumns()->all()->filter(function ($column) {
                return ! $column instanceof Control;
            })->map(function ($column) use ($model) {
                $column->setModel($model);

                if (! method_exists($column, 'getModelValue')) {
                    return false;
                }

                $value = $column->getModelValue();

                return is_object($value) ? $value->__toString() : $value;
            });
        })->toArray();
    }

    /**
     * Return array of columns header.
     *
     * @return array
     */
    protected function getHeadersArray()
    {
        return $this->display->getColumns()->all()->filter(function ($column) {
            return ! $column instanceof Control;
        })->map(function ($column) {
            $value = $column->getHeader()->getTitle();

            return ! is_object($value) ? $value : '';
        })->toArray();
    }

    /**
     * @return array
     */
    protected function getFiltersArray()
    {
        $filters = $this->display->getFilters()->toArray();

        return array_map(function ($filter) {
            return $filter->getTitle();
        },
            $filters['filters']
        );
    }

    /**
     * @return array
     */
    protected function getTotalsArray(ModelConfigurationInterface $model)
    {
        if (! method_exists($model, 'getTotalRow')) {
            return [];
        }

        return array_pad(
            forward_static_call([get_class($model), 'getTotalRow'], $this->display),
            $this->display->getColumns()->all()->count(),
            ''
        );
    }

    /**
     * @return string
     */
    protected function getExcelFileNameFromFilters()
    {
        $filtersValue = array_map(function ($filter) {
            return camel_case(
                preg_replace('/^.*?\[(.*?)\].*?$/s', '$1', $filter)
            );
        },
            $this->getFiltersArray()
        );

        $filtersValue = array_filter($filtersValue);

        if (count($filtersValue)) {
            return implode('-', $filtersValue);
        }

        return date('Y-m-d H:i:s');
    }

    /**
     * Get data array for write to excel file.
     *
     * @return array
     */
    public function getData(ModelConfigurationInterface $model)
    {
        $data = $this->getCollectionArray();
        $headers = $this->getHeadersArray();

        $result = array_filter(array_merge(
            [$this->getFiltersArray()],
            [$headers],
            $data,
            [$this->getTotalsArray($model)]
        ));

        return $result;
    }

    public function handle(ExportModel $export)
    {
        $model = $export->getModel();

        $this->initDisplay($model);
        $filename = $this->getExcelFileNameFromFilters();
        $export->setFilename($filename);

        return $export->sheet('sheetName', function ($sheet) use ($model) {
            $sheet->fromArray($this->getData($model), null, 'A1', false, false);
        })
        ->export('xls');
    }
}
