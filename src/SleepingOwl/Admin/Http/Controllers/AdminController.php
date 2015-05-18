<?php namespace SleepingOwl\Admin\Http\Controllers;

use AdminTemplate;
use App;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Input;
use Redirect;
use SleepingOwl\Admin\Interfaces\FormInterface;
use SleepingOwl\Admin\Repository\BaseRepository;

class AdminController extends Controller
{

	public function getDisplay($model)
	{
		return $this->render($model->title(), $model->display());
	}

	public function getCreate($model)
	{
		$create = $model->create();
		if (is_null($create))
		{
			abort(404);
		}
		return $this->render($model->title(), $create);
	}

	public function postStore($model)
	{
		$create = $model->create();
		if (is_null($create))
		{
			abort(404);
		}
		if ($create instanceof FormInterface)
		{
			if ($validator = $create->validate($model))
			{
				return Redirect::back()->withErrors($validator)->withInput()->with([
					'_redirectBack' => Input::get('_redirectBack'),
				]);
			}
			$create->save($model);
		}
		return Redirect::to(Input::get('_redirectBack', $model->displayUrl()));
	}

	public function getEdit($model, $id)
	{
		$edit = $model->fullEdit($id);
		if (is_null($edit))
		{
			abort(404);
		}
		return $this->render($model->title(), $edit);
	}

	public function postUpdate($model, $id)
	{
		$edit = $model->fullEdit($id);
		if (is_null($edit))
		{
			abort(404);
		}
		if ($edit instanceof FormInterface)
		{
			if ($validator = $edit->validate($model))
			{
				return Redirect::back()->withErrors($validator)->withInput()->with([
					'_redirectBack' => Input::get('_redirectBack'),
				]);
			}
			$edit->save($model);
		}
		return Redirect::to(Input::get('_redirectBack', $model->displayUrl()));
	}

	public function postDestroy($model, $id)
	{
		$delete = $model->delete($id);
		if (is_null($delete))
		{
			abort(404);
		}
		$model->repository()->delete($id);
		return Redirect::back();
	}

	public function postRestore($model, $id)
	{
		$restore = $model->restore($id);
		if (is_null($restore))
		{
			abort(404);
		}
		$model->repository()->restore($id);
		return Redirect::back();
	}

	public function render($title, $content)
	{
		if ($content instanceof Renderable)
		{
			$content = $content->render();
		}
		return view(AdminTemplate::view('_layout.inner'), [
			'title'   => $title,
			'content' => $content,
		]);
	}

	public function getLang()
	{
		$lang = trans('admin::lang');
		if ($lang == 'admin::lang')
		{
			$lang = trans('admin::lang', [], 'messages', 'en');
		}
		$content = 'window.admin={}; window.admin.locale="' . App::getLocale() . '"; window.admin.token="' . csrf_token() . '"; window.admin.prefix="' . config('admin.prefix') . '"; window.admin.lang=' . json_encode($lang) . ';';

		$response = new Response($content, 200, [
			'Content-Type' => 'text/javascript',
		]);

		return $this->cacheResponse($response);
	}

	protected function cacheResponse(Response $response)
	{
		$response->setSharedMaxAge(31536000);
		$response->setMaxAge(31536000);
		$response->setExpires(new \DateTime('+1 year'));

		return $response;
	}

	public function getWildcard()
	{
		abort(404);
	}

} 