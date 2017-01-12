<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use KodiComponents\Support\Upload;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class File extends NamedFormElement implements WithRoutesInterface
{
    /**
     * @var string
     */
    protected static $route = 'file';

    /**
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.form.element.'.static::$route;

        if (! $router->has($routeName)) {
            $router->post('{adminModel}/'.static::$route.'/{field}/{id?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\UploadController@fromField'
            ]);
        }
    }

    /**
     * @var Closure
     */
    protected $uploadPath;

    /**
     * @var Closure
     */
    protected $uploadFileName;

    /**
     * @var array
     */
    protected $uploadSettings = [];

    /**
     * @var array
     */
    protected $uploadValidationRules = ['required', 'file'];

    /**
     * @var string
     */
    protected $view = 'form.element.file';

    /**
     * @return array
     */
    public function getUploadValidationMessages()
    {
        $messages = [];
        foreach ($this->validationMessages as $rule => $message) {
            $messages["file.{$rule}"] = $message;
        }

        return $messages;
    }

    /**
     * @return array
     */
    public function getUploadValidationLabels()
    {
        return ['file' => $this->getLabel()];
    }

    /**
     * @return array
     */
    public function getUploadValidationRules()
    {
        return ['file' => array_unique($this->uploadValidationRules)];
    }

    /**
     * @param UploadedFile $file
     *
     * @return mixed
     */
    public function getUploadPath(UploadedFile $file)
    {
        if (! is_callable($this->uploadPath)) {
            return $this->defaultUploadPath($file);
        }

        return call_user_func($this->uploadPath, $file);
    }

    /**
     * @param Closure $uploadPath
     *
     * @return $this
     */
    public function setUploadPath(Closure $uploadPath)
    {
        $this->uploadPath = $uploadPath;

        return $this;
    }

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    public function getUploadFileName(UploadedFile $file)
    {
        if (! is_callable($this->uploadFileName)) {
            return $this->defaultUploadFilename($file);
        }

        return call_user_func($this->uploadFileName, $file);
    }

    /**
     * @param Closure $uploadFileName
     *
     * @return $this
     */
    public function setUploadFileName(Closure $uploadFileName)
    {
        $this->uploadFileName = $uploadFileName;

        return $this;
    }

    /**
     * @return array
     */
    public function getUploadSettings()
    {
        if (empty($this->uploadSettings) && in_array(Upload::class, class_uses($this->getModel()))) {
            return (array) array_get($this->getModel()->getUploadSettings(), $this->getPath());
        }

        return $this->uploadSettings;
    }

    /**
     * @param array $imageSettings
     *
     * @return $this
     */
    public function setUploadSettings(array $imageSettings)
    {
        $this->uploadSettings = $imageSettings;

        return $this;
    }

    /**
     * @param string      $rule
     * @param string|null $message
     *
     * @return $this
     */
    public function addValidationRule($rule, $message = null)
    {
        $uploadRules = ['file', 'image', 'mime', 'size', 'dimensions', 'max', 'min', 'between'];

        foreach ($uploadRules as $uploadRule) {
            if (strpos($rule, $uploadRule) !== false) {
                $this->uploadValidationRules[] = $rule;

                if (is_null($message)) {
                    return $this;
                }

                return $this->addValidationMessage($rule, $message);
            }
        }

        return parent::addValidationRule($rule, $message);
    }

    /**
     * @param int $size Max size in kilobytes
     *
     * @return $this
     */
    public function maxSize($size)
    {
        $this->addValidationRule('max:'.(int) $size);

        return $this;
    }

    /**
     * @param int $size Max size in kilobytes
     *
     * @return $this
     */
    public function minSize($size)
    {
        $this->addValidationRule('min:'.(int) $size);

        return $this;
    }



    /**
     * @param UploadedFile $file
     * @param string $path
     * @param string $filename
     * @param array $settings
     */
    public function saveFile(UploadedFile $file, $path, $filename, array $settings)
    {
        $file->move($path, $filename);
    }

    /**
     * @param \Illuminate\Validation\Validator $validator
     */
    public function customValidation(\Illuminate\Validation\Validator $validator)
    {
    }

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    public function defaultUploadFilename(UploadedFile $file)
    {
        return md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();
    }

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    public function defaultUploadPath(UploadedFile $file)
    {
        return config('sleeping_owl.filesUploadDirectory', 'files/uploads');
    }
}
