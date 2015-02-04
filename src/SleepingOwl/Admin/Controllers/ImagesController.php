<?php namespace SleepingOwl\Admin\Controllers;

use App;
use Config;
use Illuminate\Routing\Controller;
use SleepingOwl\RandomFilenamer\RandomFilenamer;
use Exception;
use Illuminate\Http\Response;
use Input;
use Lang;
use StdClass;
use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;
use URL;

/**
 * Class ImagesController
 *
 * @package SleepingOwl\Admin\Controllers
 */
class ImagesController extends Controller
{
	/**
	 * @var Finder
	 */
	protected $finder;
	/**
	 * @var Filesystem
	 */
	protected $filesystem;

	/**
	 * @param Finder $finder
	 * @param Filesystem $filesystem
	 */
	function __construct(Finder $finder, Filesystem $filesystem)
	{
		$this->finder = $finder;
		$this->filesystem = $filesystem;
	}

	/**
	 * Get all images within "images" directory without "seeds" subdirectories
	 *
	 * @return array
	 */
	public function getAll()
	{
		$files = $this->getAllFiles();
		$result = [];
		foreach ($files as $file)
		{
			$result[] = $this->createImageObject($file);
		}
		return $result;
	}

	/**
	 * @return Finder
	 */
	protected function getAllFiles()
	{
		return $this->finder->create()->exclude('seeds')->files()->in(Config::get('admin.imagesDirectory'));
	}

	/**
	 * @param SplFileInfo $file
	 * @return StdClass
	 */
	protected function createImageObject(SplFileInfo $file)
	{
		$obj = new StdClass;
		$path = $file->getRelativePathname();
		$obj->url = route('imagecache', [
			'original',
			$path
		]);
		$obj->thumbnail = route('imagecache', [
			'small',
			$path
		]);
		return $obj;
	}

	/**
	 * Upload new image (uses "imgupload" ckeditor plugin, with little modifications in file naming)
	 */
	public function postUpload()
	{
		$imageDirectory = Config::get('admin.imagesUploadDirectory');
		$upload_dir = Config::get('admin.imagesDirectory') . '/' . $imageDirectory;

		$allowedExtensions = [
			'bmp',
			'gif',
			'jpg',
			'jpeg',
			'png'
		];

		$maxsize = 2000;
		$maxwidth = 9000;
		$maxheight = 8000;
		$minwidth = 10;
		$minheight = 10;

		$file = Input::file('upload');
		$errors = [];

		$extension = null;
		$width = 0;
		$height = 0;
		try
		{
			if (is_null($file))
			{
				$errors[] = Lang::get('admin::lang.ckeditor.upload.error.common');
				throw new Exception;
			}
			$extension = $file->guessClientExtension();
			if ( ! in_array($extension, $allowedExtensions))
			{
				$errors[] = Lang::get('admin::lang.ckeditor.upload.error.wrong_extension', ['file' => $file->getClientOriginalName()]);
				throw new Exception;
			}
			if ($file->getSize() > $maxsize * 1000)
			{
				$errors[] = Lang::get('admin::lang.ckeditor.upload.error.filesize_limit', ['size' => $maxsize]);
			}
			$image = App::make('image')->make($file);
			$width = $image->width();
			$height = $image->height();
			if ($width > $maxwidth || $height > $maxheight)
			{
				$errors[] = Lang::get('admin::lang.ckeditor.upload.error.imagesize_max_limit', [
					'width'     => $width,
					'height'    => $height,
					'maxwidth'  => $maxwidth,
					'maxheight' => $maxheight
				]);
			}
			if ($width < $minwidth || $height < $minheight)
			{
				$errors[] = Lang::get('admin::lang.ckeditor.upload.error.imagesize_min_limit', [
					'width'     => $width,
					'height'    => $height,
					'minwidth'  => $minwidth,
					'minheight' => $minheight
				]);
			}
		} catch (Exception $e)
		{
		}

		if ( ! empty($errors))
		{
			return '<script>alert("' . implode('\\n', $errors) . '");</script>';
		}

		$finalFilename = RandomFilenamer::get($upload_dir, $extension);
		$file = $file->move($upload_dir, $finalFilename);
		$CKEditorFuncNum = Input::get('CKEditorFuncNum');
		$url = URL::route('imagecache', [
			'original',
			$imageDirectory . '/' . $finalFilename
		]);
		$message = Lang::get('admin::lang.ckeditor.upload.success', [
			'size'   => number_format($file->getSize() / 1024, 3, '.', ''),
			'width'  => $width,
			'height' => $height
		]);
		$result = "window.parent.CKEDITOR.tools.callFunction($CKEditorFuncNum, '$url', '$message')";
		return '<script>' . $result . ';</script>';
	}

	public function getImage($filename)
	{
		Config::set('session.driver', 'array');

		// find file
		$image_path = false;
		foreach (Config::get('imagecache.paths') as $path)
		{
			// don't allow '..' in filenames
			$image_path = $path . '/' . str_replace('..', '', $filename);
			if (file_exists($image_path) && is_file($image_path))
			{
				break;
			}
		}

		// abort if file not found
		if ($image_path === false)
		{
			App::abort(404);
		}

		// define template callback
		$callback = function ($image)
		{
			return $image->widen(80);
		};

		// image manipulation based on callback
		$content = app('image')->cache(function ($image) use ($image_path, $callback)
		{
			return $callback($image->make($image_path));
		}, Config::get('imagecache::lifetime'));

		// define mime type
		$mime = finfo_buffer(finfo_open(FILEINFO_MIME_TYPE), $content);

		// return http response
		return new Response($content, 200, [
			'Content-Type'  => $mime,
			'Cache-Control' => 'max-age=' . (Config::get('imagecache::lifetime') * 60) . ', public',
			'Etag'          => md5($content)
		]);
	}
}