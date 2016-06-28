<?php

namespace SleepingOwl\Admin;

use SleepingOwl\Admin\Model\ModelConfiguration;

class Section implements SectionInterface
{

    /**
     * @var ModelConfiguration
     */
    protected $model;

    /**
     * @param ModelConfiguration $model
     */
    public function __construct(ModelConfiguration $model)
    {
        $this->model = $model;

        $this->initialize();
    }

    public function initialize()
    {
        $this->model->setTitle($this->getTitle());
        $this->model->setAlias($this->getAlias());

        if (method_exists($this, 'display')) {
            $this->model->onDisplay(function () {
                return $this->display();
            });
        }

        if (method_exists($this, 'create')) {
            $this->model->onCreate(function () {
                return $this->create();
            });
        }

        if (method_exists($this, 'edit')) {
            $this->model->onEdit(function ($id) {
                return $this->edit($id);
            });
        }

        if (method_exists($this, 'delete')) {
            $this->model->onDelete(function ($id) {
                return $this->delete($id);
            });
        }

        if (method_exists($this, 'restore')) {
            $this->model->onRestore(function ($id) {
                return $this->restore($id);
            });
        }
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return null;
    }

    /**
     * @return string
     */
    public function getAlias()
    {
        return null;
    }
}