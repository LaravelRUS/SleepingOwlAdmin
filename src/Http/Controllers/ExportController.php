<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Http\Request\ExportModel;

class ExportController extends Controller
{
    public function export(ModelConfigurationInterface $model, ExportModel $export)
    {
        $export->setModel($model);

        return $export->handleExport();
    }
}
