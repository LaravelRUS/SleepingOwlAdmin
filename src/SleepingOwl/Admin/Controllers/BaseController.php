<?php namespace SleepingOwl\Admin\Controllers;

use App;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Config;
use SleepingOwl\Admin\Admin;
use Illuminate\Foundation\Application;
use View;

/**
 * Class BaseController
 *
 * @package SleepingOwl\Admin\Controllers
 */
class BaseController extends Controller
{
	/**
	 * @var Admin
	 */
	protected $admin;
	/**
	 * @var \SleepingOwl\Admin\Router
	 */
	protected $admin_router;

	/**
	 *
	 */
	function __construct()
	{
		$this->admin = Admin::instance();
		$this->admin_router = $this->admin->router;
	}

	/**
	 * @param $name
	 * @param array $data
	 * @return \Illuminate\View\View
	 */
	protected function makeView($name, $data = [])
	{
		$view = View::make(Config::get('admin.bladePrefix') . $name, $data);
		$this->addViewDefaults($view);
		return $view;
	}

	/**
	 * @param \Illuminate\View\View $view
	 */
	protected function addViewDefaults(\Illuminate\View\View $view)
	{
		if ($title = $view->title)
		{
			$title .= ' &ndash; ';
		}
		$title .= $this->admin->title;
		$view->with('pageTitle', $title);
		$view->with('adminTitle', $this->admin->title);
	}

} 