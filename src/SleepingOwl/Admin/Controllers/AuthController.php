<?php namespace SleepingOwl\Admin\Controllers;

use AdminAuth;
use Config;
use Illuminate\Support\MessageBag;
use Input;
use Lang;
use Redirect;
use Validator;

/**
 * Class AuthController
 * @package SleepingOwl\Admin\Controllers
 */
class AuthController extends BaseController
{
	/**
	 * @return \Illuminate\Http\RedirectResponse|\Illuminate\View\View
	 */
	public function getLogin()
	{
		if ( ! AdminAuth::guest())
		{
			return Redirect::to($this->admin_router->routeHome());
		}
		$loginPostUrl = $this->admin_router->routeToAuth('login.post');
		return $this->makeView('login', compact('loginPostUrl'));
	}

	/**
	 * @return $this|\Illuminate\Http\RedirectResponse
	 */
	public function postLogin()
	{
		$rules = Config::get('admin.auth.rules');
		$data = Input::only(array_keys($rules));
		$validator = Validator::make($data, $rules, Lang::get('admin::validation'));
		if ($validator->fails())
		{
			return Redirect::back()->withInput()->withErrors($validator);
		}

		if (AdminAuth::attempt($data))
		{
			return Redirect::intended($this->admin_router->routeHome());
		}

		$message = new MessageBag([
			'username' => Lang::get('admin::lang.auth.wrong-username'),
			'password' => Lang::get('admin::lang.auth.wrong-password')
		]);
		return Redirect::back()->withInput()->withErrors($message);
	}

	/**
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function getLogout()
	{
		AdminAuth::logout();
		return Redirect::to($this->admin_router->routeToAuth('login'));
	}
}