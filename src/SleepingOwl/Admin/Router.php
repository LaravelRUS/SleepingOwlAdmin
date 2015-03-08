<?php namespace SleepingOwl\Admin;

use SleepingOwl\Admin\Exceptions\MethodNotFoundException;
use Illuminate\Config\Repository;
use Illuminate\Http\Response;
use Illuminate\Routing\Router as IlluminateRouter;
use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\Str;

/**
 * Class Router
 *
 * @package SleepingOwl\Admin
 * @method string routeToTable($alias)
 * @method string routeToCreate()
 * @method string routeToStore()
 * @method string routeToEdit()
 * @method string routeToUpdate()
 * @method string routeToDestroy()
 * @method string routeToMoveup()
 * @method string routeToMovedown()
 */
class Router
{
	/**
	 * @var string
	 */
	public $prefix;
	/**
	 * @var string
	 */
	public $routePrefix;
	/**
	 * @var IlluminateRouter
	 */
	protected $laravelRouter;

	/**
	 * @var array
	 */
	public static $modelRoutes = [
		[
			'url'    => '{model}',
			'action' => 'table',
			'method' => 'get'
		],
		[
			'url'    => '{model}/create',
			'action' => 'create',
			'method' => 'get'
		],
		[
			'url'    => '{model}',
			'action' => 'store',
			'method' => 'post'
		],
		[
			'url'    => '{model}/{id}/edit',
			'action' => 'edit',
			'method' => 'get'
		],
		[
			'url'    => '{model}/{id}/update',
			'action' => 'update',
			'method' => 'put'
		],
		[
			'url'    => '{model}/{id}',
			'action' => 'destroy',
			'method' => 'delete'
		],
		[
			'url'    => '{model}/{id}/moveup',
			'action' => 'moveup',
			'method' => 'patch'
		],
		[
			'url'    => '{model}/{id}/movedown',
			'action' => 'movedown',
			'method' => 'patch'
		],
	];
	/**
	 * @var Repository
	 */
	private $config;
	/**
	 * @var UrlGenerator
	 */
	private $urlGenerator;

	/**
	 * @param IlluminateRouter $router
	 * @param Repository $config
	 * @param UrlGenerator $urlGenerator
	 * @param string $prefix
	 * @param string $routePrefix
	 */
	function __construct(IlluminateRouter $router, Repository $config, UrlGenerator $urlGenerator, $prefix,
						 $routePrefix = 'sleeping-owl-admin')
	{
		$this->laravelRouter = $router;
		$this->config = $config;
		$this->prefix = $prefix;
		$this->routePrefix = $routePrefix;
		$this->urlGenerator = $urlGenerator;
	}

	/**
	 * Register all admin routes
	 */
	public function registerRoutes()
	{
		$this->registerAssetsRoutes();
		$this->registerAuthRoutes();
		$this->registerImageCacheRoute();

		$models = Admin::instance()->models->getAllAliases();

		$this->laravelRouter->group([
			'prefix'    => $this->prefix,
			'before'    => $this->getBeforeFilters(),
			'namespace' => 'SleepingOwl\Admin\Controllers',
		], function () use ($models)
		{
			if (empty($models)) $models = ['__empty_models__'];
			$this->laravelRouter->group([
				'where' => ['model' => implode('|', $models)]
			], function ()
			{
				foreach (static::$modelRoutes as $route)
				{
					$url = $route['url'];
					$action = $route['action'];
					$method = $route['method'];
					$this->laravelRouter->$method($url, [
						'as'   => $this->routePrefix . '.table.' . $action,
						'uses' => 'AdminController@' . $action
					]);
				}
			});

			$wildcardRoute = $this->laravelRouter->any('{wildcard?}', [
				'as'   => $this->routePrefix . '.wildcard',
				'uses' => 'AdminController@getWildcard'
			])->where('wildcard', '.*');
			$this->setRoutePriority($wildcardRoute, 0);
		});
	}

	/**
	 * Register routes to admin assets
	 */
	protected function registerAssetsRoutes()
	{
		# CKEditor file listing and upload
		$this->laravelRouter->group([
			'before'    => $this->getBeforeFilters(),
			'prefix'    => 'images',
			'namespace' => 'SleepingOwl\Admin\Controllers'
		], function ()
		{
			$this->laravelRouter->get('all', 'ImagesController@getAll');
			$this->laravelRouter->post('upload', 'ImagesController@postUpload');
		});
		$this->laravelRouter->get('js/{locale}/lang.js', [
			'prefix' => $this->prefix,
			'as'     => $this->routePrefix . '.lang',
			'uses'   => 'SleepingOwl\Admin\Controllers\LangController@getAll'
		]);
	}

	/**
	 * Register login and logout routes
	 */
	protected function registerAuthRoutes()
	{
		$this->laravelRouter->group([
			'prefix'    => $this->prefix,
			'namespace' => 'SleepingOwl\Admin\Controllers'
		], function ()
		{
			$this->laravelRouter->get('login', [
				'as'   => $this->routePrefix . '.login',
				'uses' => 'AuthController@getLogin'
			]);
			$this->laravelRouter->post('login', [
				'as'   => $this->routePrefix . '.login.post',
				'uses' => 'AuthController@postLogin'
			])->before('csrf');
			$this->laravelRouter->get('logout', [
				'as'   => $this->routePrefix . '.logout',
				'uses' => 'AuthController@getLogout'
			]);
		});
	}

	/**
	 *
	 */
	protected function registerImageCacheRoute()
	{
		$this->laravelRouter->get($this->config->get('imagecache.route') . '/admin_preview/{filename}', 'SleepingOwl\Admin\Controllers\ImagesController@getImage')->where(['filename' => '[ \w\\.\\/\\-]+']);
	}

	/**
	 * @return array
	 */
	protected function getBeforeFilters()
	{
		return $this->config->get('admin.beforeFilters');
	}

	/**
	 * @param string $asset
	 * @return string
	 */
	public function routeToAsset($asset)
	{
		return $this->urlGenerator->asset('packages/sleeping-owl/admin/' . $asset);
	}

	/**
	 * @param $locale
	 * @return string
	 */
	public function routeToLang($locale)
	{
		return $this->urlGenerator->route($this->routePrefix . '.lang', $locale);
	}

	/**
	 * @param string $model
	 * @param array $parameters
	 * @return string
	 */
	public function routeToModel($model, $parameters = [])
	{
		return $this->routeToTable($model, $parameters);
	}

	/**
	 * Get route to admin startpage
	 * @return string
	 */
	public function routeHome()
	{
		return $this->routeToWildcard('/');
	}

	/**
	 * @param $url
	 * @return string
	 */
	public function routeToWildcard($url)
	{
		return $this->urlGenerator->route($this->routePrefix . '.wildcard', $url);
	}

	/**
	 * @param $action
	 * @return string
	 */
	public function routeToAuth($action)
	{
		return $this->urlGenerator->route($this->routePrefix . '.' . $action);
	}

	/**
	 * @param string $method
	 * @param array $parameters
	 * @throws MethodNotFoundException
	 */
	public function __call($method, $parameters)
	{
		if (preg_match('/^routeTo(?<routeName>[a-zA-Z]+)$/', $method, $matches))
		{
			$route = Str::camel($matches['routeName']);
			while (count($parameters) < 2)
			{
				$parameters[] = [];
			}
			if ( ! is_array($parameters[1]))
			{
				$parameters[1] = [$parameters[1]];
			}
			$routeParameters = $parameters[1];
			array_unshift($routeParameters, $parameters[0]);
			return $this->urlGenerator->route($this->routePrefix . '.table.' . $route, $routeParameters);
		}
		throw new MethodNotFoundException(get_class($this), $method);
	}

	protected function setRoutePriority($wildcardRoute, $priority)
	{
		if (method_exists($wildcardRoute, 'setPriority'))
		{
			$wildcardRoute->setPriority($priority);
		}
	}

}