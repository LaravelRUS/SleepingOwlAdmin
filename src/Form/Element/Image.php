<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;

class Image extends File
{
    /**
     * @var string
     */
    protected static $route = 'image';

    /**
     * @var array
     */
    protected $uploadValidationRules = ['required', 'image'];

    /**
     * @var string
     */
    protected $view = 'form.element.image';

    /**
     * @param Validator $validator
     */
    public function customValidation(Validator $validator)
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
    public function saveFile(UploadedFile $file, $path, $filename, array $settings)
    {
        if (class_exists('Intervention\Image\Facades\Image') and (bool) getimagesize($file->getRealPath())) {
            $image = \Intervention\Image\Facades\Image::make($file);

            foreach ($settings as $method => $args) {
                call_user_func_array([$image, $method], $args);
            }

            return $image->save($path.'/'.$filename);
        }

        parent::saveFile($file, $path, $filename, $settings);
    }

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    public function defaultUploadPath(UploadedFile $file)
    {
        return config('sleeping_owl.imagesUploadDirectory', 'images/uploads');
    }
}
