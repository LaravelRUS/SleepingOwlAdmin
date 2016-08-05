<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use KodiComponents\Support\Upload;
use Route;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use Validator;

class File extends NamedFormElement implements WithRoutesInterface
{

    /**
     * @var string
     */
    protected static $route = 'uploadFile';

    public static function registerRoutes()
    {
        $routeName = 'admin.form.element.file.'.static::$route;

        if (! Route::has($routeName)) {
            Route::post('{adminModel}/'.static::$route.'/{field}/{id?}', ['as' => $routeName, function (
                Request $request,
                ModelConfigurationInterface $model,
                $field,
                $id = null
            ) {
                if (! is_null($id)) {
                    $item = $model->getRepository()->find($id);
                    if (is_null($item) || ! $model->isEditable($item)) {
                        return new JsonResponse([
                            'message' => 'Access denied'
                        ], 403);
                    }

                    $form = $model->fireEdit($id);
                } else {
                    if (! $model->isCreatable()) {
                        return new JsonResponse([
                            'message' => 'Access denied'
                        ], 403);
                    }

                    $form = $model->fireCreate();
                }

                $messages = [];
                $labels   = [];
                $rules = static::uploadValidationRules();

                if (! is_null($element = $form->getElement($field))) {
                    $rules    = $element->getValidationRules();
                    $messages = $element->getValidationMessages();
                    $labels   = $element->getValidationLabels();
                }

                $validator = Validator::make($request->all(), $rules, $messages, $labels);

                static::validate($validator);

                if ($validator->fails()) {
                    return new JsonResponse([
                        'message' => 'Validation error',
                        'errors' => $validator->errors()->get('file')
                    ], 400);
                }

                $file = $request->file('file');

                /** @var File $element */
                if (! is_null($element = $form->getElement($field))) {
                    $filename = $element->getUploadFileName($file);
                    $path     = $element->getUploadPath($file);
                    $settings = $element->getUploadSettings();
                } else {
                    $filename = static::defaultUploadFilename($file);
                    $path     = static::defaultUploadPath($file);
                    $settings = [];
                }

                static::saveFile($file, public_path($path), $filename, $settings);

                $value = $path.'/'.$filename;

                return new JsonResponse([
                    'url' => asset($value),
                    'value' => $value,
                ]);
            }]);
        }
    }

    /**
     * @param UploadedFile $file
     * @param string $path
     * @param string $filename
     * @param array $settings
     */
    protected static function saveFile(UploadedFile $file, $path, $filename, array $settings)
    {
        $file->move($path, $filename);
    }

    /**
     * @param \Illuminate\Validation\Validator $validator
     */
    protected static function validate(\Illuminate\Validation\Validator $validator)
    {

    }

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    protected static function defaultUploadFilename(UploadedFile $file)
    {
        return md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();
    }

    /**
     * @param UploadedFile $file
     *
     * @return string
     */
    protected static function defaultUploadPath(UploadedFile $file)
    {
        return config('sleeping_owl.filesUploadDirectory', 'files/uploads');
    }

    /**
     * @return array
     */
    protected static function uploadValidationRules()
    {
        return [
            'file' => 'required',
        ];
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
    protected $validationRules = [
        'required'
    ];

    /**
     * @return array
     */
    public function getValidationMessages()
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
    public function getValidationLabels()
    {
        return ['file' => $this->getLabel()];
    }

    /**
     * @return array
     */
    public function getValidationRules()
    {
        return ['file' => $this->validationRules];
    }

    /**
     * @param UploadedFile $file
     *
     * @return mixed
     */
    public function getUploadPath(UploadedFile $file)
    {
        if (! is_callable($this->uploadFileName)) {
            return static::defaultUploadPath($file);
        }

        return call_user_func($this->uploadFileName, $file);
    }

    /**
     * @param Closure $uploadPath
     *
     * @internal param $ \Closure
     */
    public function setUploadPath(Closure $uploadPath)
    {
        $this->uploadPath = $uploadPath;
    }

    /**
     * @param UploadedFile $file
     *
     * @return Closure
     */
    public function getUploadFileName(UploadedFile $file)
    {
        if (! is_callable($this->uploadFileName)) {
            return static::defaultUploadFilename($file);
        }

        return call_user_func($this->uploadFileName, $file);
    }

    /**
     * @param Closure $uploadFileName
     */
    public function setUploadFileName(Closure $uploadFileName)
    {
        $this->uploadFileName = $uploadFileName;
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
     */
    public function setUploadSettings(array $imageSettings)
    {
        $this->uploadSettings = $imageSettings;
    }
}
