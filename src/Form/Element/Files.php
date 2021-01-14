<?php

namespace SleepingOwl\Admin\Form\Element;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use KodiComponents\Support\Upload;

class Files extends Images
{
    protected $uploadValidationRules = ['required'];

    protected $view = 'form.element.files';

    protected $files_group_class = null;

    protected $show_title = true;

    protected $show_description = true;

    protected $title_required = false;

    protected $description_required = false;

    protected $text_fields = [];

    protected $checkboxes = [];

    /**
     * @param bool $bool
     *
     * @return $this
     */
    public function showTitle($bool)
    {
        $this->show_title = $bool;

        return $this;
    }

    /**
     * @param bool $bool
     *
     * @return $this
     */
    public function showDescription($bool)
    {
        $this->show_description = $bool;

        return $this;
    }

    /**
     * @param bool $bool
     *
     * @return $this
     */
    public function setTitleRequired($bool)
    {
        $this->title_required = $bool;

        return $this;
    }

    /**
     * @param bool $bool
     *
     * @return $this
     */
    public function setDescriptionRequired($bool)
    {
        $this->description_required = $bool;

        return $this;
    }

    /**
     * Добавляет <input type="text"> в карточку файла.
     * @param $name - название поля из модели
     * @param null $placeholder
     * @param null $label
     * @return $this
     */
    public function addTextField($name, $placeholder = null, $label = null)
    {
        $res = ['name' => $name];

        if ($placeholder) {
            $res = array_merge(['placeholder' => $placeholder], $res);
        }
        if ($label) {
            $res = array_merge(['label' => $label], $res);
        }

        array_push($this->text_fields, $res);

        return $this;
    }

    /**
     * Установка обязательности заполнения текстогово поля.
     * @param $bool
     * @return $this
     */
    public function setTextRequired($bool)
    {
        end($this->text_fields);
        $last = key($this->text_fields);
        $this->text_fields[$last] = array_merge($this->text_fields[$last], [
            'required' => $bool,
        ]);
        reset($this->text_fields);

        return $this;
    }

    /**
     * Добавляет <input type="checkbox"> в карточку файла.
     * @param $name - название поля из модели
     * @param null $label
     * @return $this
     */
    public function addCheckboxField($name, $label = null)
    {
        $res = ['name' => $name];

        if ($label) {
            $res = array_merge(['label' => $label], $res);
        }

        array_push($this->checkboxes, $res);

        return $this;
    }

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
     * @param array $driverOptions
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
     * @param string $rule
     * @param null $message
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
     * @param UploadedFile $file
     * @param string $path
     * @param string $filename
     * @param array $settings
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

        return ['path' => asset($value), 'value' => $value];
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

    /**
     * @return array|mixed|string
     */
    public function getValueFromModel()
    {
        // $value = $this->model->{$this->name};
        $value = parent::getValueFromModel();
        if (is_array($value)) {
            // Some hooks)
            if (count($value) && @$value[0] && is_object($value[0])) {
                $value = json_decode(json_encode($value), true);
            }
            $return = $value;
        } elseif (is_string($value) && is_array($json_decoded = json_decode($value, true))) {
            $return = $json_decoded;
        } else {
            $return = [];
        }

        return $return;
    }

    /**
     * @param string $mode
     *
     * @return $this
     */
    public function setListMode($mode)
    {
        if ($mode == 'vertical') {
            $this->files_group_class = 'files-group-vertical';
        } elseif ($mode == 'horizontal') {
            $this->files_group_class = null;
        }

        return $this;
    }

    /**
     * @return $this
     */
    public function setVertical()
    {
        $this->setListMode('vertical');

        return $this;
    }

    /**
     * @return $this
     */
    public function setHorizontal()
    {
        $this->setListMode('horizontal');

        return $this;
    }

    /**
     * @param Request $request
     */
    public function save(Request $request)
    {
        $value = Arr::get($request->all(), $this->getNameKey());

        if (is_array($value_array = json_decode($value, true)) && count($value_array)) {
            foreach ($value_array as $v => $array) {
                $file = $array['url'];
                if ($file && File::exists($file)) {
                    if (! isset($array['filesize'])) {
                        $array['filesize'] = File::size($file);
                    }
                    if (! isset($array['ext'])) {
                        $array['ext'] = File::extension($file);
                    }
                    $mime = File::mimeType($file);
                    if (! isset($array['mime'])) {
                        $array['mime'] = $mime;
                    }
                    if (mb_strpos($mime, '/')) {
                        [$mime1, $mime2] = explode('/', $mime);
                        if (! isset($array['mime_base'])) {
                            $array['mime_base'] = $mime1;
                        }
                        if (! isset($array['mime_detail'])) {
                            $array['mime_detail'] = $mime2;
                        }
                    }
                }
                $value_array[$v] = $array;
            }
            $value = json_encode($value_array);
        }

        /*
        $temp_merge_array = Arr::add($request->all(), $this->getNameKey(), $value);
        dd($request->all(), $this->getNameKey(), $value, $temp_merge_array);
        $request->merge($temp_merge_array);
        dd($request->all());
        */

        $this->setModelAttribute($value);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $return = parent::toArray();

        $return = array_merge($return, [
            'files_group_class' => $this->files_group_class,
            'show_title' => $this->show_title,
            'show_description' => $this->show_description,
            'title_required' => $this->title_required,
            'description_required' => $this->description_required,
            'text_fields' => $this->text_fields,
            'checkboxes' => $this->checkboxes,
        ]);

        return $return;
    }
}
