<?php namespace SleepingOwl\Admin\Controllers;

use App;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Lang;

class LangController extends Controller
{
	public function getAll()
	{
		$lang = Lang::get('admin::lang');
		$content = 'window.admin={}; window.admin.locale="' . App::getLocale() . '"; window.admin.lang=' . json_encode($lang) . ';';

		$response = new Response($content, 200, [
			'Content-Type' => 'text/javascript',
		]);

		return $this->cacheResponse($response);
	}

	/**
	 * Cache the response 1 year (31536000 sec)
	 * @param Response $response
	 * @return \Illuminate\Http\Response
	 */
	protected function cacheResponse(Response $response)
	{
		$response->setSharedMaxAge(31536000);
		$response->setMaxAge(31536000);
		$response->setExpires(new \DateTime('+1 year'));

		return $response;
	}
} 