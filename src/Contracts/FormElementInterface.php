<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;

interface FormElementInterface extends Renderable, Arrayable, Initializable, WithModel, Validable
{
    /**
     * @return mixed
     */
    public function getValue();

    /**
     * @return bool
     */
    public function isReadonly();

    /**
     * @return bool
     */
    public function isVisible();

    /**
     * Save form item.
     */
    public function save();

    /**
     * Save form item.
     */
    public function afterSave();
}
