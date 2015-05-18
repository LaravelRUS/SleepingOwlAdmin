<?php namespace SleepingOwl\Admin\Http\Controllers;

use AdminTemplate;
use App;
use Illuminate\Routing\Controller;
use Illuminate\Support\MessageBag;
use Input;
use Redirect;
use SleepingOwl\AdminAuth\Facades\AdminAuth;
use Validator;

class AuthController extends Controller
{

	protected function redirect()
	{
		return Redirect::route('admin.wildcard', '/');
	}

	public function getLogin()
	{
		if ( ! AdminAuth::guest())
		{
			return $this->redirect();
		}
		$loginPostUrl = route('admin.login.post');
		return view(AdminTemplate::view('pages.login'), [
			'title' => config('admin.title'),
			'loginPostUrl' => $loginPostUrl,
		]);
	}

	public function postLogin()
	{
		$rules = config('admin.auth.rules');
		$data = Input::only(array_keys($rules));
		$lang = trans('admin::validation');
		if ($lang == 'admin::validation')
		{
			$lang = [];
		}
		$validator = Validator::make($data, $rules, $lang);
		if ($validator->fails())
		{
			return Redirect::back()->withInput()->withErrors($validator);
		}

		if (AdminAuth::attempt($data))
		{
			return Redirect::intended(route('admin.wildcard', '/'));
		}

		$message = new MessageBag([
			'username' => trans('admin::lang.auth.wrong-username'),
			'password' => trans('admin::lang.auth.wrong-password')
		]);
		return Redirect::back()->withInput()->withErrors($message);
	}

	public function getLogout()
	{
		AdminAuth::logout();
		return $this->redirect();
	}

}