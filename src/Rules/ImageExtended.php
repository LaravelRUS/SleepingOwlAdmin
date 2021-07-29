<?php

namespace SleepingOwl\Admin\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Validation\Concerns\ValidatesAttributes;

class ImageExtended implements Rule
{
    use ValidatesAttributes;

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return $this->validateMimes($attribute, $value, config('sleeping_owl.imagesAllowedExtensions', ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']));
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.image');
    }

    public function __toString()
    {
        return 'image_extended';
    }
}
