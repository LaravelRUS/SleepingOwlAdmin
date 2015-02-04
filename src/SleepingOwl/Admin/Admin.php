<?php namespace SleepingOwl\Admin;

use SleepingOwl\Html\FormBuilder;
use SleepingOwl\Html\HtmlBuilder;
use SleepingOwl\Admin\Menu\MenuItem;
use SleepingOwl\Admin\Models\ModelItem;
use SleepingOwl\Admin\Models\Models;
use Illuminate\Config\Repository;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Routing\Router as IlluminateRouter;
use Symfony\Component\Finder\Finder;
use Illuminate\Routing\UrlGenerator;

/**
 * Class Admin
 *
 * @package SleepingOwl\Admin
 */
class Admin
{
	/**
	 * Bootstrap filename
	 */
	const BOOTSRAP_FILE = 'bootstrap.php';
	/**
	 * @var Admin
	 */
	public static $instance;

	/**
	 * @var string
	 */
	public $title;
	/**
	 * @var Router
	 */
	public $router;
	/**
	 * @var MenuItem
	 */
	public $menu;
	/**
	 * @var Models
	 */
	public $models;
	/**
	 * @var HtmlBuilder
	 */
	public $htmlBuilder;
	/**
	 * @var FormBuilder
	 */
	public $formBuilder;
	/**
	 * @var Finder
	 */
	protected $finder;
	/**
	 * @var string
	 */
	protected $bootstrapDirectory;
	/**
	 * @var Filesystem
	 */
	protected $filesystem;

	/**
	 * @param HtmlBuilder $htmlBuilder
	 * @param FormBuilder $formBuilder
	 * @param Finder $finder
	 * @param Repository $config
	 * @param IlluminateRouter $illuminateRouter
	 * @param UrlGenerator $urlGenerator
	 * @param Filesystem $filesystem
	 */
	function __construct(HtmlBuilder $htmlBuilder, FormBuilder $formBuilder, Finder $finder, Repository $config,
						 IlluminateRouter $illuminateRouter, UrlGenerator $urlGenerator, Filesystem $filesystem)
	{
		static::$instance = $this;

		$this->htmlBuilder = $htmlBuilder;
		$this->formBuilder = $formBuilder;
		$this->finder = $finder;
		$this->filesystem = $filesystem;

		$this->title = $config->get('admin.title');
		$this->bootstrapDirectory = $config->get('admin.bootstrapDirectory');
		$this->router = new Router($illuminateRouter, $config, $urlGenerator, $config->get('admin.prefix'));
		$this->menu = new MenuItem;
		$this->models = new Models;

		$this->requireBootstrap();
	}

	/**
	 * @return Admin
	 */
	public static function instance()
	{
		if (is_null(static::$instance))
		{
			app('\SleepingOwl\Admin\Admin');
		}
		return static::$instance;
	}

	/**
	 *
	 */
	protected function requireBootstrap()
	{
		if (! $this->filesystem->isDirectory($this->bootstrapDirectory)) return;
		$files = $this->finder->create()->files()->name('/^[^_].+\.php$/')->in($this->bootstrapDirectory);
		$files->sort(function ($a)
		{
			return $a->getFilename() !== static::BOOTSRAP_FILE;
		});
		foreach ($files as $file)
		{
			$this->filesystem->requireOnce($file);
		}
	}

	/**
	 * @param $class
	 * @return ModelItem
	 */
	public static function model($class)
	{
		$modelItem = new ModelItem($class);
		return $modelItem;
	}

	/**
	 * @param null $model
	 * @return MenuItem
	 */
	public static function menu($model = null)
	{
		return new MenuItem($model);
	}

	/**
	 * @param string $content
	 * @param $title
	 * @return string
	 */
	public static function view($content, $title = null)
	{
		$controller = \App::make('SleepingOwl\Admin\Controllers\AdminController', ['disableFilters' => true]);
		return $controller->renderCustomContent($title, $content);
	}

}