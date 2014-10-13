<?php namespace SleepingOwl\Admin\Controllers;

use View;

class DummyController extends \Controller
{
	public function getIndex()
	{
		return View::make('admin::dummy');
	}
} 