<?php

namespace SleepingOwl\Admin\Http\Request;

use Maatwebsite\Excel\Files\NewExcelFile;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class ExportModel extends NewExcelFile
{
    /** @var string */
    protected $filename;

    /** @var ModelConfigurationInterface */
    protected $model;

    /**
     * @return string
     */
    public function getFilename()
    {
        return $this->filename;
    }

    /**
     * @return ModelConfigurationInterface
     */
    public function getModel()
    {
        return $this->model;
    }

    public function setModel(ModelConfigurationInterface $model)
    {
        $this->model = $model;
    }
}
