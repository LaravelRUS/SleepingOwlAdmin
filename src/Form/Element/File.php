<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Router;
use Illuminate\Support\Arr;
use KodiComponents\Support\Upload;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use SleepingOwl\Admin\Traits\FileSize;

class File extends NamedFormElement implements WithRoutesInterface
{
    use FileSize;

    /**
     * @var string
     */
    protected static $route = 'file';

    /**
     * @var \Closure
     */
    protected $saveCallback;

    /**
     * @var bool
     */
    protected $addOnlyLink = false;

    /**
     * Set.
     *
     * @param  Closure|bool  $onlyLink
     * @return $this
     */
    public function setOnlyLink($onlyLink)
    {
        $this->addOnlyLink = $onlyLink;

        return $this;
    }

    /**
     * Return save callback.
     *
     * @return bool|callable
     */
    public function getOnlyLink()
    {
        if (is_callable($this->addOnlyLink)) {
            return (bool) call_user_func($this->addOnlyLink, $this->getModel());
        }

        return (bool) $this->addOnlyLink;
    }

    /**
     * @param  Router  $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.form.element.'.static::$route;

        if (! $router->has($routeName)) {
            $router->post('{adminModel}/'.static::$route.'/{field?}/{id?}', [
                'as' => $routeName,
                'uses' => 'SleepingOwl\Admin\Http\Controllers\UploadController@fromField',
            ]);
        }
    }

    /**
     * @var string
     */
    protected $driver = 'file';

    /**
     * @var array
     */
    protected $driverOptions = [];

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
     * @var string
     */
    protected $asset = '';

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
     * @param $driver
     * @param  array  $driverOptions
     * @return $this
     */
    public function setDriver($driver, $driverOptions = [])
    {
        $this->driver = $driver;
        $this->driverOptions = $driverOptions;

        return $this;
    }

    /**
     * @return array
     */
    public function getDriver()
    {
        return ['driver' => $this->driver, 'driverOptions' => $this->driverOptions];
    }

    /**
     * @return array
     */
    public function getUploadValidationRules()
    {
        return ['file' => array_unique($this->uploadValidationRules)];
    }

    /**
     * @param  UploadedFile  $file
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
     * @param  Closure  $uploadPath
     * @return $this
     */
    public function setUploadPath(Closure $uploadPath)
    {
        $this->uploadPath = $uploadPath;

        return $this;
    }

    /**
     * @param  UploadedFile  $file
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
     * @param  Closure  $uploadFileName
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
            return (array) Arr::get($this->getModel()->getUploadSettings(), $this->getPath());
        }

        return $this->uploadSettings;
    }

    /**
     * @param  array  $imageSettings
     * @return $this
     */
    public function setUploadSettings(array $imageSettings)
    {
        $this->uploadSettings = $imageSettings;

        return $this;
    }

    /**
     * @param  string  $rule
     * @param  null  $message
     * @return $this|\SleepingOwl\Admin\Form\Element\File|\SleepingOwl\Admin\Form\Element\NamedFormElement
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
     * @param  \Closure  $callable
     * @return $this
     */
    public function setSaveCallback(\Closure $callable)
    {
        $this->saveCallback = $callable;

        return $this;
    }

    /**
     * @param  string  $asset
     * @return $this
     */
    public function setAssetPrefix($asset)
    {
        $this->asset = $asset;

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
     * @param  UploadedFile  $file
     * @param  string  $path
     * @param  string  $filename
     * @param  array  $settings
     * @return \Closure|array
     */
    public function saveFile(UploadedFile $file, $path, $filename, array $settings)
    {
        if (is_callable($callback = $this->getSaveCallback())) {
            return $callback($file, $path, $filename, $settings);
        }

        $file->move($path, $filename);

        //S3 Implement
        $value = $path.'/'.$filename;

        return ['path' => asset($value), 'value' => $value, 'original_name' => $file->getClientOriginalName()];
    }

    /**
     * @param  \Illuminate\Validation\Validator  $validator
     */
    public function customValidation(\Illuminate\Validation\Validator $validator)
    {
    }

    /**
     * @param  UploadedFile  $file
     * @return string
     */
    public function defaultUploadFilename(UploadedFile $file)
    {
        return md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();
    }

    /**
     * @param  UploadedFile  $file
     * @return string
     */
    public function defaultUploadPath(UploadedFile $file)
    {
        return config('sleeping_owl.filesUploadDirectory', 'files/uploads');
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $return = parent::toArray();

        return array_merge($return, [
            'asset_prefix' => $this->asset,
            'paste_only_link' => $this->getOnlyLink(),
        ]);
    }
}
