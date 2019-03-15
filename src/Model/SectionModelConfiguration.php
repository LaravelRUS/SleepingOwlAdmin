<?php

namespace SleepingOwl\Admin\Model;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Contracts\Display\DisplayInterface;

class SectionModelConfiguration extends ModelConfigurationManager
{
    protected $breadcrumbs = null;

    public function __construct(\Illuminate\Contracts\Foundation\Application $app, $class)
    {
        parent::__construct($app, $class);

        $this->breadcrumbs = collect();
    }

    /**
     * @return \Illuminate\Support\Collection|null
     */
    public function getBreadCrumbs()
    {
        return $this->breadcrumbs->toArray();
    }

    /**
     * @param $breadcrumb
     * @return mixed|void
     */
    public function addBreadCrumb($breadcrumb)
    {
        $this->breadcrumbs->push($breadcrumb);
    }

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

    public function isDeletable(Model $model)
    {
        return method_exists($this, 'onDelete') && parent::isDeletable($model);
    }

    /**
     * @param mixed $payload
     * @return mixed|DisplayInterface|void
     */
    public function fireDisplay($payload = [])
    {
        if (! method_exists($this, 'onDisplay')) {
            return;
        }

        $display = $this->app->call([$this, 'onDisplay'], ['payload' => $payload]);

        if ($display instanceof DisplayDatatablesAsync) {
            $display->setPayload($payload);
        }

        if ($display instanceof DisplayInterface) {
            $display->setModelClass($this->getClass());
            $display->initialize();
        }

        return $display;
    }

    /**
     * @param mixed $payload
     * @return mixed|void
     */
    public function fireCreate($payload = [])
    {
        if (! method_exists($this, 'onCreate')) {
            return;
        }

        $form = $this->app->call([$this, 'onCreate'], ['payload' => $payload]);

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
     * @param int   $id
     * @param mixed $payload
     *
     * @return mixed|void
     */
    public function fireEdit($id, $payload = [])
    {
        if (! method_exists($this, 'onEdit')) {
            return;
        }

        $payload = array_merge(['id' => $id], ['payload' => $payload]);

        $form = $this->app->call([$this, 'onEdit'], $payload);

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
            return $this->app->call([$this, 'onDelete'], ['id' => $id]);
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
            return $this->app->call([$this, 'onDestroy'], ['id' => $id]);
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
            return $this->app->call([$this, 'onRestore'], ['id' => $id]);
        }
    }
}
