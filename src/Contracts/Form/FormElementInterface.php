<?php

namespace SleepingOwl\Admin\Contracts\Form;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Validable;
use SleepingOwl\Admin\Contracts\WithModelInterface;

interface FormElementInterface extends Renderable, Arrayable, Initializable, WithModelInterface, Validable
{
    /**
     * @return mixed
     */
    public function getValue();

    /**
     * @return bool
     */
    public function isReadonly(): bool;

    /**
     * @return bool
     */
    public function isValueSkipped(): bool;

    /**
     * @return bool
     */
    public function isVisible(): bool;

    /**
     * @param  Request  $request
     * @return void
     */
    public function save(Request $request);

    /**
     * @param  Request  $request
     * @return void
     */
    public function afterSave(Request $request);
}
