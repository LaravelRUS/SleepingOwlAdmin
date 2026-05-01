<?php

namespace SleepingOwl\Admin\Support;

use File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;

trait Upload
{
    protected static function bootUpload()
    {
        static::updating(function (Model $model) {
            foreach ($model->getUploadFields() as $key) {
                $originalValue = Arr::get($model->original, $key);

                if (
                    ! empty($originalValue)
                    and
                    ($originalValue != $model->attributes[$key])
                    and
                    file_exists($filePath = public_path($originalValue))
                ) {
                    unlink($filePath);
                }
            }
        });

        static::saving(function (Model $model) {
            foreach ($model->getUploadFields() as $key) {
                if ($model->{$key} instanceof UploadedFile) {
                    $model->attachFile($key, $model->{$key});
                }
            }
        });

        static::deleting(function (Model $model) {
            if (in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, trait_uses_recursive($model)) && ! $model->forceDeleting) {
                return;
            }

            foreach ($model->getUploadFields() as $key) {
                $filePath = $model->{$key.'_path'};
                if (! empty($filePath) and file_exists($filePath)) {
                    unlink($model->{$key.'_path'});
                }
            }
        });
    }

    /**
     * @var array
     */
    protected $uploadGetKeys;

    /**
     * @var array
     */
    protected $uploadSetKeys;

    /**
     * @var array
     */
    protected $uploadFieldsKeys;

    /**
     * @return array
     */
    public function getUploadSettings()
    {
        if (property_exists($this, 'uploadSettings')) {
            return (array) $this->uploadSettings;
        }

        return [];
    }

    /**
     * @param  UploadedFile  $file
     * @return string
     */
    protected function getUploadFilename(UploadedFile $file)
    {
        return uniqid().'.'.$file->getClientOriginalExtension();
    }

    /**
     * @param  string  $field
     * @param  UploadedFile  $file
     */
    protected function attachFile($field, UploadedFile $file)
    {
        $destination_path = 'storage';
        $filename = $this->getUploadFilename($file);

        $subFolder = substr(md5($filename), 0, 2);

        if (! is_dir(public_path($dir = "{$destination_path}/{$this->getTable()}/{$field}/{$subFolder}"))) {
            File::makeDirectory(public_path($dir), 493, true);
        }

        $path = "{$dir}/{$filename}";

        if (
            class_exists('Intervention\Image\Facades\Image')
            and
            ($this->hasCast($field, 'image') or $this->isImageUploadedFile($file))
        ) {
            $settings = Arr::get($this->getUploadSettings(), $field, []);

            $image = \Intervention\Image\Facades\Image::make($file);

            foreach ($settings as $method => $args) {
                call_user_func_array([$image, $method], $args);
            }

            $image->save(public_path($path));
        } else {
            $file->move(public_path($dir), $filename);
        }

        $this->{$field} = $path;
    }

    /**
     * Get an attribute from the model.
     *
     * @param  string  $key
     * @return mixed
     */
    public function getAttribute($key)
    {
        $this->findUploadFields();

        if ($this->isUploadField($key)) {
            [$method, $originalKey] = $this->uploadGetKeys[$key];

            $value = $this->getAttribute($originalKey);

            if ($this->hasGetMutator($key)) {
                return $this->mutateAttribute($key, $value);
            }

            return $this->{$method}($originalKey, $value);
        }

        return parent::getAttribute($key);
    }

    /**
     * Get the value of an attribute using its mutator.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return mixed
     */
    protected function mutateAttribute($key, $value)
    {
        $this->findUploadFields();

        if ($this->isUploadField($key)) {
            return $this->getAttribute($key);
        }

        return parent::mutateAttribute($key, $value);
    }

    /**
     * Set a given attribute on the model.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return $this
     */
    public function setAttribute($key, $value)
    {
        $this->findUploadFields();

        if ($this->isUploadField($key)) {
            [$method, $originalKey] = $this->uploadSetKeys[$key];

            if ($this->hasSetMutator($key)) {
                $method = 'set'.Str::studly($key).'Attribute';

                return $this->{$method}($value);
            }

            return $this->{$method}($originalKey, $value);
        }

        return parent::setAttribute($key, $value);
    }

    /**
     * Determine if a set mutator exists for an attribute.
     *
     * @param  string  $key
     * @return bool
     */
    public function isUploadField($key)
    {
        return array_key_exists($key, $this->uploadGetKeys) || array_key_exists($key, $this->uploadSetKeys);
    }

    /**
     * @param  string  $key
     * @param  string  $value
     * @return string|null
     */
    public function getUploadUrl($key, $value)
    {
        if (! empty($value)) {
            return url($value);
        }
    }

    /**
     * @param  string  $key
     * @param  string  $value
     * @return string|null
     */
    public function getUploadPath($key, $value)
    {
        if (! empty($value)) {
            return public_path($value);
        }
    }

    /**
     * @param  string  $key
     * @param  UploadedFile|null  $file
     */
    public function setUploadFile($key, ?UploadedFile $file = null)
    {
        $this->{$key} = $file;
    }

    /**
     * @return mixed
     */
    public function getUploadFields()
    {
        $this->findUploadFields();

        return $this->uploadFieldsKeys;
    }

    protected function findUploadFields()
    {
        if (is_array($this->uploadGetKeys) and is_array($this->uploadSetKeys) and is_array($this->uploadFieldsKeys)) {
            return;
        }

        $fields = [];

        $casts = $this->getCasts();

        foreach ($casts as $field => $type) {
            if (in_array($type, ['upload', 'file', 'image'])) {
                $fields[] = $field;
            }
        }

        $this->uploadFieldsKeys = array_unique($fields);
        $this->uploadGetKeys = $this->uploadSetKeys = [];

        foreach ($this->uploadFieldsKeys as $field) {
            $this->uploadGetKeys[$field.'_url'] = ['getUploadUrl', $field];
            $this->uploadGetKeys[$field.'_path'] = ['getUploadPath', $field];

            $this->uploadSetKeys[$field.'_file'] = ['setUploadFile', $field];
        }
    }

    /**
     * @param  UploadedFile  $file
     * @return bool
     */
    protected function isImageUploadedFile(UploadedFile $file)
    {
        $size = getimagesize($file->getRealPath());

        return (bool) $size;
    }
}
