<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Router;
use KodiComponents\Support\Upload;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;
use Validator;

class File extends NamedFormElement implements WithRoutesInterface
{

    /**
     * @var string
     */
    protected static $route = 'uploadFile';

    /**
     * @param Router $router
     */
    public static function registerRoutes(Router $router)
    {
        $routeName = 'admin.form.element.file.'.static::$route;

        if (! $router->has($routeName)) {
            $router->post('{adminModel}/'.static::$route.'/{field}/{id?}', ['as' => $routeName, function (
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
                $rules = static::defaultUploadValidationRules();

                if (! is_null($element = $form->getElement($field))) {
                    $rules    = $element->getUploadValidationRules();
                    $messages = $element->getUploadValidationMessages();
                    $labels   = $element->getUploadValidationLabels();
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
    protected static function defaultUploadValidationRules()
    {
        return [
            'file' => ['required', 'file'],
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
    protected $uploadValidationRules = ['required', 'file'];

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
        if (! is_callable($this->uploadFileName)) {
            return static::defaultUploadPath($file);
        }

        return call_user_func($this->uploadFileName, $file);
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
        $uploadRules = ['file', 'image', 'mime', 'size', 'dimensions'];

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
}
