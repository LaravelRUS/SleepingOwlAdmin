<?php

namespace App\Admin\Form\Element;

use SleepingOwl\Admin\Form\Element\MultiSelect;
use SleepingOwl\Admin\Form\Element\NamedFormElement;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Validator;
use KodiComponents\Support\Upload;
use Closure;
class ImagesWithRelation extends MultiSelect
{
    protected $uploadValidationRules = ['required', 'image'];
    protected $uploadSettings = [];

    protected $taggable = true;
    protected $uploadFileName;

    protected $saveCallback;


    public function getSaveCallback()
    {
        return $this->saveCallback;
    }
    protected $view = 'form.element.images';

    public function toArray()
    {

        $model=$this->getModel();
        $relation=$this->getModelAttributeKey();
        $key = ($this->usageKey) ? $this->usageKey : $this->getModelForOptions()->getKeyName();
        $options=$model->{$relation};
        $options=$options->all();

        if (is_callable($makeDisplay = $this->getDisplay())) {
            // make dynamic display text
            if ($options instanceof Collection) {
                $options = $options->all();
            }
            // iterate for all options and redefine it as
            // list of KEY and TEXT pair
            $options = array_map(function ($opt) use ($key, $makeDisplay) {
                // get the KEY and make the display text
                return [data_get($opt, $key), $makeDisplay($opt)];
            }, $options);

            // take options as array with KEY => VALUE pair
            $options = array_pluck($options, 1, 0);
        } elseif ($options instanceof Collection) {
            // take options as array with KEY => VALUE pair
            $options = array_pluck($options->all(), $this->getDisplay(), $key);
        } else {
            // take options as array with KEY => VALUE pair
            $options = array_pluck($options, $this->getDisplay(), $key);
        }
        $options=array_values($options);
        return NamedFormElement::toArray() + [
                'options'  => $options,
                'limit'    => $this->getLimit(),
                'nullable' => $this->isNullable(),
            ];
    }

    public function getUploadValidationMessages()
    {
        $messages = [];
        foreach ($this->validationMessages as $rule => $message) {
            $messages["file.{$rule}"] = $message;
        }

        return $messages;
    }
    public function getValueFromModel()
    {
        $value = NamedFormElement::getValueFromModel();
        //dd($value);
//        $x=$value->all()[0];
//        if($x->getTable()!="photos"){
//
//        }

        if (is_array($value)) {
            foreach ($value as $key => $val) {
                $value[$key] = $val;
            }
        }

        if ($value instanceof Collection && $value->count() > 0) {
            $value = $value->pluck($value->first()->getKeyName())->all();
        }

        if ($value instanceof Collection) {
            $value = $value->toArray();
        }
        return $value;
    }
    public function defaultUploadPath(UploadedFile $file)
    {
        $config_path= config('sleeping_owl.imagesUploadDirectory', 'images/uploads');
        $path=$config_path.'/'.$this->getModelForOptions()->getTable();
        if (!is_dir($path)){
            mkdir($path, 0755);
        }
        return $path;
    }

    public function getUploadValidationRules()
    {
        return ['file' => array_unique($this->uploadValidationRules)];
    }
    public function getUploadValidationLabels()
    {
        return ['file' => $this->getLabel()];
    }

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
    public function getUploadFileName(UploadedFile $file)
    {
        if (! is_callable($this->uploadFileName)) {
            return $this->defaultUploadFilename($file);
        }
        return call_user_func($this->uploadFileName, $file);
    }
    public function setUploadFileName(Closure $uploadFileName)
    {
        $this->uploadFileName = $uploadFileName;

        return $this;
    }
    public function defaultUploadFilename(UploadedFile $file)
    {
        return md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();
    }

    public function getUploadPath(UploadedFile $file)
    {
       return $this->defaultUploadPath($file);
    }

    public function getUploadSettings()
    {
        if (empty($this->uploadSettings) && in_array(Upload::class, class_uses($this->getModel()))) {
            return (array) array_get($this->getModel()->getUploadSettings(), $this->getPath());
        }

        return $this->uploadSettings;
    }
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
    public function save(\Illuminate\Http\Request $request)
    {
        if (is_null($this->getModelForOptions())) {
            parent::save($request);
        }
    }
    public function afterSave(\Illuminate\Http\Request $request)
    {
        if (is_null($this->getModelForOptions())) {
            return;
        }
        if ($this->isValueSkipped()) {
            return;
        }
        $attribute = $this->getModelAttributeKey();

        if (is_null($request->input($this->getPath()))) {
            $values = [];
        } else {
            $values_str = $this->getValueFromModel();
        }
        $values=explode(",",$values_str[0]);
        $relation = $this->getModel()->{$attribute}();
        if ($relation instanceof \Illuminate\Database\Eloquent\Relations\BelongsToMany) {
            dd("Нобходимо Добавить метод из родительского и переписать!");
            $this->syncBelongsToManyRelation($relation, $values);
        } elseif ($relation instanceof \Illuminate\Database\Eloquent\Relations\HasMany) {
            $this->deleteOldItemsFromHasManyRelation($relation, $values);
            $this->attachItemsToHasManyRelation($relation, $values);
        }
    }

    protected function attachItemsToHasManyRelation(
        \Illuminate\Database\Eloquent\Relations\HasMany $relation,
        array $values
    ) {
        foreach ($values as $i => $value) {
            if (empty($value)){
                continue;
            }
            /** @var Model $model */
            $model = clone $this->getModelForOptions();
            $item = $model->where($this->getDisplay(),$value)->where($relation->getForeignKeyName(),$this->getModel()->getKey())->first();
            if (is_null($item)) {
                if (! $this->isTaggable()) {
                    continue;
                }
                $model->{$this->getDisplay()} = $value;
                $item = $model;
            }
            $relation->save($item);
        }
    }
    protected function deleteOldItemsFromHasManyRelation(
        \Illuminate\Database\Eloquent\Relations\HasMany $relation,
        array $values
    ) {

        $items = $relation->get();
        $display=$this->getDisplay();
        foreach ($items as $item) {
            if (! in_array($item->{$display}, $values)) {
                $item->delete();
                if(file_exists($item->{$display})){
                    unlink($item->{$display});
                }
            }
        }
    }
}
