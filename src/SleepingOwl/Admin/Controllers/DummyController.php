<?php namespace SleepingOwl\Admin\Controllers;

use Illuminate\Routing\Controller;
use View;

class DummyController extends Controller
{
	public function getIndex()
	{
		return View::make('admin::dummy');
	}
} 