<?php namespace SleepingOwl\Models\Attributes;

use Config;
use Illuminate\Support\Facades\File as IlluminateFile;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image as InterventionImage;

class Image
{
	/**
	 *
	 */
	const TEMPLATE_INFO = '.:type (:widthx:height)';

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
		return Config::get('admin.imagesDirectory') . '/' . $this->directory;
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
	public function info()
	{
		$filename = $this->getFullPath();
		if ( ! $this->exists()) return '';

		list($width, $height) = getimagesize($filename);
		$extension = \File::extension($filename);
		return strtr(static::TEMPLATE_INFO, [
			':type'   => $extension,
			':width'  => $width,
			':height' => $height
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
	 * @param $template
	 * @return string
	 */
	public function thumbnail($template)
	{
		if ( ! $this->exists()) return null;
		return route('imagecache', [
			$template,
			$this->getPath()
		]);
	}

	/**
	 * @return mixed
	 */
	function __toString()
	{
		return $this->filename;
	}

} 