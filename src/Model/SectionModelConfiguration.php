<?php

namespace SleepingOwl\Admin\Model;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormInterface;

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

        $create = app()->call([$this, 'onCreate']);
        if ($create instanceof DisplayInterface) {
            $create->setModelClass($this->getClass());
            $create->initialize();
        }

        if ($create instanceof FormInterface) {
            $create->setAction($this->getStoreUrl());
        }

        return $create;
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

        $edit = app()->call([$this, 'onEdit'], ['id' => $id]);
        if ($edit instanceof DisplayInterface) {
            $edit->setModelClass($this->getClass());
            $edit->initialize();
        }

        return $edit;
    }

    /**
     * @param int $id
     *
     * @return $this
     */
    public function fireFullEdit($id)
    {
        $edit = $this->fireEdit($id);

        if ($edit instanceof FormInterface) {
            $edit->setAction($this->getUpdateUrl($id));
            $edit->setId($id);
        }

        return $edit;
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
