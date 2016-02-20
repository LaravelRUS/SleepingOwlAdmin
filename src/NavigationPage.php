<?php

namespace SleepingOwl\Admin;

use KodiCMS\Navigation\Page;
use SleepingOwl\Admin\Traits\Accessor;
use SleepingOwl\Admin\Model\ModelConfiguration;

class NavigationPage extends Page
{
    use Accessor;

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
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->model->getTitle();
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        if (is_null($label = $this->getAttribute('label'))) {
            $label = $this->model->getTitle();
        }

        return $label;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->model->getDisplayUrl();
    }
}
