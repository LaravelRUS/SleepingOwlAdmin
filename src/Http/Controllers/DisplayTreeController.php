<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DisplayTreeController extends Controller
{
    /**
     * @param Request $request
     * @param ModelConfigurationInterface $model
     * @return mixed
     */
    public function reorder(Request $request, ModelConfigurationInterface $model)
    {
        if (! $model->isEditable($model->getRepository()->getModel())) {
            throw new NotFoundHttpException();
        }

        return $model->fireDisplay()->getRepository()->reorder($request->input('data'));
    }
}
