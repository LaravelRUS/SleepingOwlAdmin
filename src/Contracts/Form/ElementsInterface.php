<?php

namespace SleepingOwl\Admin\Contracts\Form;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Initializable;

interface ElementsInterface extends Initializable, Arrayable, Renderable
{
    /**
     * @return Collection
     */
    public function getElements();

    /**
     * @param array $elements
     *
     * @return $this
     */
    public function setElements(array $elements);

    /**
     * @return array
     */
    public function getValidationRules();

    /**
     * @return array
     */
    public function getValidationMessages();

    /**
     * @return array
     */
    public function getValidationLabels();

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model);

    public function save();

    public function afterSave();
}
