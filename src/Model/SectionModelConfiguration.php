<?php

namespace SleepingOwl\Admin\Model;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\DisplayInterface;

class SectionModelConfiguration extends ModelConfigurationManager
{
    /**
     * @return bool
     */
    public function isCreatable()
    {
        return method_exists($this, 'onCreate') && parent::isCreatable($this->getModel());
    }

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function isEditable(Model $model)
    {
        return method_exists($this, 'onEdit') && parent::isEditable($model);
    }

    /**
     * @return DisplayInterface|mixed
     */
    public function fireDisplay()
    {
        if (! method_exists($this, 'onDisplay')) {
            return;
        }

        $display = app()->call([$this, 'onDisplay']);

        if ($display instanceof DisplayInterface) {
            $display->setModelClass($this->getClass());
            $display->initialize();
        }

        return $display;
    }

    /**
     * @return mixed|void
     */
    public function fireCreate()
    {
        if (! method_exists($this, 'onCreate')) {
            return;
        }

        $form = app()->call([$this, 'onCreate']);
        if ($form instanceof DisplayInterface) {
            $form->setModelClass($this->getClass());
        }

        if ($form instanceof Initializable) {
            $form->initialize();
        }

        if ($form instanceof FormInterface) {
            $form->setAction($this->getStoreUrl());
        }

        return $form;
    }

    /**
     * @param $id
     *
     * @return mixed|void
     */
    public function fireEdit($id)
    {
        if (! method_exists($this, 'onEdit')) {
            return;
        }

        $form = app()->call([$this, 'onEdit'], ['id' => $id]);
        if ($form instanceof DisplayInterface) {
            $form->setModelClass($this->getClass());
        }

        if ($form instanceof Initializable) {
            $form->initialize();
        }

        if ($form instanceof FormInterface) {
            $form->setAction($this->getUpdateUrl($id));
            $form->setId($id);
        }

        return $form;
    }

    /**
     * @param $id
     *
     * @return mixed
     */
    public function fireDelete($id)
    {
        if (method_exists($this, 'onDelete')) {
            return app()->call([$this, 'onDelete'], ['id' => $id]);
        }
    }

    /**
     * @param $id
     *
     * @return mixed
     */
    public function fireDestroy($id)
    {
        if (method_exists($this, 'onDestroy')) {
            return app()->call([$this, 'onDestroy'], ['id' => $id]);
        }
    }

    /**
     * @param $id
     *
     * @return bool|mixed
     */
    public function fireRestore($id)
    {
        if (method_exists($this, 'onRestore')) {
            return app()->call([$this, 'onRestore'], ['id' => $id]);
        }
    }
}
