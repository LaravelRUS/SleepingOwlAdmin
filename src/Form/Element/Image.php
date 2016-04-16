<?php

namespace SleepingOwl\Admin\Form\Element;

class Image extends File
{
    /**
     * @var string
     */
    protected static $route = 'uploadImage';

    /**
     * @param \Illuminate\Validation\Validator $validator
     */
    protected static function validate(\Illuminate\Validation\Validator $validator)
    {
        $validator->after(function ($validator) {
            /** @var \Illuminate\Http\UploadedFile $file */
            $file = array_get($validator->attributes(), 'file');

            $size = getimagesize($file->getRealPath());

            if (! $size) {
                $validator->errors()->add('file', trans('sleeping_owl::validation.not_image'));
            }
        });
    }

    /**
     * @return string
     */
    protected static function getUploadPath()
    {
        return config('sleeping_owl.imagesUploadDirectory', 'images/uploads');
    }

    /**
     * @return array
     */
    protected static function uploadValidationRules()
    {
        return [
            'file' => 'image',
        ];
    }
}
