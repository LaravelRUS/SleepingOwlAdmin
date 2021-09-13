<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Validation\Validator;
use SleepingOwl\Admin\Exceptions\Form\FormElementException;
use SleepingOwl\Admin\Rules\ImageExtended;

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
    protected $uploadValidationRules;

    /**
     * After save callback.
     *
     * @var
     */
    protected $afterSaveCallback;

    /**
     * @var string
     */
    protected $view = 'form.element.image';

    /**
     * @var bool
     */
    protected $allowSvg;

    /**
     * @param  string  $path
     * @param  string|null  $label
     *
     * @throws FormElementException
     */
    public function __construct($path, $label = null)
    {
        $this->uploadValidationRules = ['required', new ImageExtended()];

        $this->setAllowSvg((bool) config('sleeping_owl.imagesAllowSvg'));

        parent::__construct($path, $label);
    }

    /**
     * @param  Validator  $validator
     */
    public function customValidation(Validator $validator)
    {
        $validator->after(function (Validator $validator) {
            /** @var \Illuminate\Http\UploadedFile $file */
            $file = Arr::get($validator->attributes(), 'file');

            $size = getimagesize($file->getRealPath());

            if (! $size) {
                if (! $this->isAllowSvg()) {
                    if ($file->getMimeType() !== 'image/svg+xml') {
                        // Find localized error message in SleepingOwl translation file
                        $bad_image_validation_key = 'sleeping_owl::validation.not_image';
                        $bad_image_validation_text = trans($bad_image_validation_key);
                        if ($bad_image_validation_text != $bad_image_validation_key) {
                            $error_message = $bad_image_validation_text;
                        } else {
                            // Find localized error message in local project translation file
                            $bad_image_validation_key = 'validation.not_image';
                            $bad_image_validation_text = trans($bad_image_validation_key);
                            if ($bad_image_validation_text != $bad_image_validation_key) {
                                $error_message = $bad_image_validation_text;
                            } else {
                                // Default error message on english
                                $error_message = 'The uploaded file is not an image';
                            }
                        }
                        $validator->errors()->add('file', $error_message);
                    }
                }
            }
        });
    }

    /**
     * Set.
     *
     * @param  \Closure  $callable
     * @return $this
     */
    public function setSaveCallback(\Closure $callable)
    {
        $this->saveCallback = $callable;

        return $this;
    }

    /**
     * Return save callback.
     *
     * @return \Closure
     */
    public function getSaveCallback()
    {
        return $this->saveCallback;
    }

    /**
     * Set.
     *
     * @param  \Closure  $callable
     * @return $this
     */
    public function setAfterSaveCallback(\Closure $callable)
    {
        $this->afterSaveCallback = $callable;

        return $this;
    }

    /**
     * Return save callback.
     *
     * @return \Closure
     */
    public function getAfterSaveCallback()
    {
        return $this->afterSaveCallback;
    }

    /**
     * @param  UploadedFile  $file
     * @param  string  $path
     * @param  string  $filename
     * @param  array  $settings
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

            return ['path' => asset($value), 'value' => $value, 'original_name' => $file->getClientOriginalName()];
        }

        return parent::saveFile($file, $path, $filename, $settings);
    }

    /**
     * @param  UploadedFile  $file
     * @return string
     */
    public function defaultUploadPath(UploadedFile $file)
    {
        return config('sleeping_owl.imagesUploadDirectory', 'images/uploads');
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return mixed|void
     */
    public function afterSave(Request $request)
    {
        $value = $request->input($this->getPath());
        $model = $this->getModel();

        if (is_callable($callback = $this->getAfterSaveCallback())) {
            return $callback($value, $model);
        }
    }

    /**
     * @return bool
     */
    public function isAllowSvg(): bool
    {
        return $this->allowSvg;
    }

    /**
     * @param  bool  $allowSvg
     * @return Image
     */
    public function setAllowSvg(bool $allowSvg): self
    {
        $this->allowSvg = $allowSvg;

        return $this;
    }
}
