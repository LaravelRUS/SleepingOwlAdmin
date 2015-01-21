<?php namespace SleepingOwl\Models\Traits;

use Illuminate\Support\Arr;
use SleepingOwl\Models\Attributes\File;
use SleepingOwl\Models\Attributes\Image;
use SleepingOwl\Models\Interfaces\ModelWithFileFieldsInterface;
use SleepingOwl\Models\Interfaces\ModelWithImageFieldsInterface;
use SleepingOwl\RandomFilenamer\RandomFilenamer;
use Str;
use Config;
use Symfony\Component\HttpFoundation\File\UploadedFile;

trait ModelWithImageOrFileFieldsTrait
{
	/**
	 *
	 */
	protected static function bootModelWithImageOrFileFieldsTrait()
	{
		static::deleted(function ($row)
		{
			if ($row instanceof ModelWithImageFieldsInterface)
			{
				foreach ($row->getImageFields() as $field => $directory)
				{
					$row->$field->delete();
				}
			}
			if ($row instanceof ModelWithFileFieldsInterface)
			{
				foreach ($row->getFileFields() as $field => $directory)
				{
					$row->$field->delete();
				}
			}
		});
	}

	/**
	 * @param $field
	 * @return Image
	 */
	protected function getImage($field)
	{
		return new Image($this->getImageFieldDirectory($field), Arr::get($this->attributes, $field, null));
	}

	/**
	 * @param $field
	 * @return File
	 */
	protected function getFile($field)
	{
		return new File($this->getFileFieldDirectory($field), Arr::get($this->attributes, $field, null));
	}

	/**
	 * @param $field
	 * @param $image
	 */
	public function setImage($field, $image)
	{
		if (is_null($image)) return;
		$filename = $image;
		$this->$field->delete();
		if ($image instanceof UploadedFile)
		{
			$filename = $this->getFilenameFromFile($field, $image);
			$image->move(Config::get('admin::imagesDirectory') . '/' . $this->getImageFieldDirectory($field), $filename);
			$this->$field->setFilename($filename);
		}
		$this->attributes[$field] = $filename;
	}

	/**
	 * @param $field
	 * @param $file
	 */
	public function setFile($field, $file)
	{
		if ($file == null) return;
		$filename = $file;
		if ($file instanceof UploadedFile)
		{
			$this->$field->delete();
			$filename = $this->getFilenameFromFile($field, $file);
			$file->move(Config::get('admin::filesDirectory') . '/' . $this->getFileFieldDirectory($field), $filename);
			$this->$field->setFilename($filename);
		}
		$this->attributes[$field] = $filename;
	}

	/**
	 * @param $field
	 * @param UploadedFile $file
	 * @return string
	 */
	protected function getFilenameFromFile($field, UploadedFile $file)
	{
		return RandomFilenamer::get($this->$field->getDirectoryFullPath(), $file->guessClientExtension());
	}

	/**
	 * @param $field
	 * @return bool
	 */
	public function hasImageField($field)
	{
		if ( ! $this instanceof ModelWithImageFieldsInterface) return false;
		return isset($this->getImageFields()[$field]);
	}

	/**
	 * @param $field
	 * @return mixed
	 */
	public function getImageFieldDirectory($field)
	{
		return $this->getImageFields()[$field];
	}

	/**
	 * @param $field
	 * @return bool
	 */
	public function hasFileField($field)
	{
		if ( ! $this instanceof ModelWithFileFieldsInterface) return false;
		return isset($this->getFileFields()[$field]);
	}

	/**
	 * @param $field
	 * @return mixed
	 */
	public function getFileFieldDirectory($field)
	{
		return $this->getFileFields()[$field];
	}

	/**
	 * @param $key
	 * @return bool
	 */
	public function hasGetMutator($key)
	{
		if ($this->hasImageField(Str::lower($key)))
		{
			return true;
		}
		if ($this->hasFileField(Str::lower($key)))
		{
			return true;
		}
		return parent::hasGetMutator($key);
	}

	/**
	 * @param $key
	 * @return bool
	 */
	public function hasSetMutator($key)
	{
		if ($this->hasImageField(Str::lower($key)))
		{
			return true;
		}
		if ($this->hasFileField(Str::lower($key)))
		{
			return true;
		}
		return parent::hasSetMutator($key);
	}

	/**
	 * @param $method
	 * @param $parameters
	 * @return Image|void
	 */
	public function __call($method, $parameters)
	{
		if (preg_match('/set(?<field>[a-zA-Z0-9]+)Attribute/', $method, $attr))
		{
			$field = Str::camel($attr['field']);
			if ($this->hasImageField($field))
			{
				return $this->setImage($field, $parameters[0]);
			}
			if ($this->hasFileField($field))
			{
				return $this->setFile($field, $parameters[0]);
			}
		}
		if (preg_match('/get(?<field>[a-zA-Z]+)Attribute/', $method, $attr))
		{
			$field = Str::lower($attr['field']);
			if ($this->hasImageField($field))
			{
				return $this->getImage($field);
			}
			if ($this->hasFileField($field))
			{
				return $this->getFile($field);
			}
		}
		return parent::__call($method, $parameters);
	}

}