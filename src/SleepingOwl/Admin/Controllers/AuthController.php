<?php namespace SleepingOwl\Admin\Controllers;

use AdminAuth;
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
			return Redirect::to($this->router->routeHome());
		}
		$loginPostUrl = $this->router->routeToAuth('login.post');
		return $this->makeView('login', compact('loginPostUrl'));
	}

	/**
	 * @return $this|\Illuminate\Http\RedirectResponse
	 */
	public function postLogin()
	{
		$data = Input::only([
			'username',
			'password'
		]);
		$rules = [
			'username' => 'required',
			'password' => 'required'
		];
		$validator = Validator::make($data, $rules, Lang::get('admin::validation'));
		if ($validator->fails())
		{
			return Redirect::back()->withInput()->withErrors($validator);
		}

		if (AdminAuth::attempt($data))
		{
			return Redirect::intended($this->router->routeHome());
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
		return Redirect::to($this->router->routeToAuth('login'));
	}
}