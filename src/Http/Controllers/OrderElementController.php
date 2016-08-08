<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Routing\Redirector;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class OrderElementController extends Controller
{
    /**
     * @param Redirector $redirect
     * @param ModelConfigurationInterface $model
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function up(Redirector $redirect, ModelConfigurationInterface $model, $id)
    {
        $instance = $model->getRepository()->find($id);

        if ($model->isEditable($instance)) {
            $instance->moveUp();
        }

        return $redirect->back();
    }

    /**
     * @param Redirector $redirect
     * @param ModelConfigurationInterface $model
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function down(Redirector $redirect, ModelConfigurationInterface $model, $id)
    {
        $instance = $model->getRepository()->find($id);

        if ($model->isEditable($instance)) {
            $instance->moveDown();
        }

        return $redirect->back();
    }
}
