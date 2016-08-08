<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\UploadedFile;

class Image extends File
{
    /**
     * @param Validator $validator
     */
    public static function validate(Validator $validator)
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
     * @param UploadedFile $file
     * @param string $path
     * @param string $filename
     * @param array $settings
     */
    public static function saveFile(UploadedFile $file, $path, $filename, array $settings)
    {
        if (
            class_exists('Intervention\Image\Facades\Image')
            and
            (bool) getimagesize($file->getRealPath())
        ) {
            $image = \Intervention\Image\Facades\Image::make($file);

            foreach ($settings as $method => $args) {
                call_user_func_array([$image, $method], $args);
            }

            $image->save($path.'/'.$filename);

            return;
        }

        $file->move($path, $filename);
    }

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    public static function defaultUploadPath(UploadedFile $file)
    {
        return config('sleeping_owl.imagesUploadDirectory', 'images/uploads');
    }

    /**
     * @return array
     */
    public static function defaultUploadValidationRules()
    {
        return [
            'file' => 'image',
        ];
    }

    /**
     * @var array
     */
    protected $uploadValidationRules = ['required', 'image'];
}
