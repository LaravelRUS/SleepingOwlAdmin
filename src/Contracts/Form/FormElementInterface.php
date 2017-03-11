<?php

namespace SleepingOwl\Admin\Contracts\Form;

use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModel;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Initializable;

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
    public function isValueSkipped();

    /**
     * @return bool
     */
    public function isVisible();

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request);

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function afterSave(\Illuminate\Http\Request $request);
}
