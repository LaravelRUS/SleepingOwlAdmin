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
     * @var \Closure
     */
    protected $saveCallback;

    /**
     * @var array
     */
    protected $uploadValidationRules = ['required', 'image'];

    /**
     * After save callback.
     * @var
     */
    protected $afterSaveCallback;
    /**
     * @var string
     */
    protected $view = 'form.element.image';

    /**
     * @param Validator $validator
     */
    public function customValidation(Validator $validator)
    {
        $validator->after(function (Validator $validator) {
            /** @var \Illuminate\Http\UploadedFile $file */
            $file = array_get($validator->attributes(), 'file');

            $size = getimagesize($file->getRealPath());

            if (! $size && $file->getMimeType() !== 'image/svg+xml') {
                $validator->errors()->add('file', trans('sleeping_owl::validation.not_image'));
            }
        });
    }

    /**
     * Set.
     * @param \Closure $callable
     * @return $this
     */
    public function setSaveCallback(\Closure $callable)
    {
        $this->saveCallback = $callable;

        return $this;
    }

    /**
     * Return save callback.
     * @return \Closure
     */
    public function getSaveCallback()
    {
        return $this->saveCallback;
    }

    /**
     * Set.
     * @param \Closure $callable
     * @return $this
     */
    public function setAfterSaveCallback(\Closure $callable)
    {
        $this->afterSaveCallback = $callable;

        return $this;
    }

    /**
     * Return save callback.
     * @return \Closure
     */
    public function getAfterSaveCallback()
    {
        return $this->afterSaveCallback;
    }

    /**
     * @param UploadedFile $file
     * @param string $path
     * @param string $filename
     * @param array $settings
     * @return \Closure|File|array
     */
    public function saveFile(UploadedFile $file, $path, $filename, array $settings)
    {
        if (is_callable($callback = $this->getSaveCallback())) {
            return $callback($file, $path, $filename, $settings);
        }

        if (class_exists('Intervention\Image\Facades\Image') && (bool) getimagesize($file->getRealPath())) {
            $image = \Intervention\Image\Facades\Image::make($file);

            foreach ($settings as $method => $args) {
                call_user_func_array([$image, $method], $args);
            }

            $value = $path.'/'.$filename;

            $image->save($value);

            return ['path' => asset($value), 'value' => $value];
        }

        return parent::saveFile($file, $path, $filename, $settings);
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

    /**
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function afterSave(\Illuminate\Http\Request $request)
    {
        $value = $request->input($this->getPath());
        $model = $this->getModel();

        if (is_callable($callback = $this->getAfterSaveCallback())) {
            return $callback($value, $model);
        }
    }
}
