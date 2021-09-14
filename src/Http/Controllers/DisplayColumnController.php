<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Traits\OrderableModel;

class DisplayColumnController extends Controller
{
    /**
     * @param  ModelConfigurationInterface  $model
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function orderUp(ModelConfigurationInterface $model, $id)
    {
        /** @var OrderableModel $instance */
        $instance = $model->getRepository()->find($id);
        $instance->moveUp();

        return back();
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function orderDown(ModelConfigurationInterface $model, $id)
    {
        /** @var OrderableModel $instance */
        $instance = $model->getRepository()->find($id);
        $instance->moveDown();

        return back();
    }
}
