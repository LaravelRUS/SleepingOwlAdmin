<?php namespace SleepingOwl\Models\Attributes;

use Config;
use Illuminate\Support\Facades\File as IlluminateFile;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image as InterventionImage;
use URL;

class File
{
	/**
	 *
	 */
	const TEMPLATE_INFO = '.:type';

	/**
	 * @var
	 */
	protected $directory;
	/**
	 * @var
	 */
	protected $filename;

	/**
	 * @param $directory
	 * @param $filename
	 */
	function __construct($directory, $filename)
	{
		$this->directory = $directory;
		$this->filename = $filename;
	}

	/**
	 * @return bool
	 */
	public function isSeed()
	{
		return Str::startsWith($this->filename, 'seeds/');
	}

	/**
	 * @return string
	 */
	public function getPath()
	{
		return $this->directory . $this->filename;
	}

	/**
	 * @return string
	 */
	public function getDirectoryFullPath()
	{
		return Config::get('admin.filesDirectory') . '/' . $this->directory;
	}

	/**
	 * @return string
	 */
	public function getFullPath()
	{
		return $this->getDirectoryFullPath() . $this->filename;
	}

	/**
	 *
	 */
	public function delete()
	{
		if ( ! $this->exists()) return;
		if ($this->isSeed()) return;
		IlluminateFile::delete($this->getFullPath());
	}

	/**
	 * @return bool
	 */
	public function exists()
	{
		return is_file($this->getFullPath());
	}

	/**
	 * @return string
	 */
	public function link()
	{
		$link = str_replace(public_path(), '', $this->getFullPath());
		return URL::asset($link);
	}

	/**
	 * @return string
	 */
	public function info()
	{
		$filename = $this->getFullPath();
		if ( ! $this->exists()) return '';

		$extension = IlluminateFile::extension($filename);
		return strtr(static::TEMPLATE_INFO, [
			':type' => $extension,
		]);
	}

	/**
	 * @param mixed $filename
	 */
	public function setFilename($filename)
	{
		$this->filename = $filename;
	}

	/**
	 * @return mixed
	 */
	function __toString()
	{
		return $this->filename;
	}

} 