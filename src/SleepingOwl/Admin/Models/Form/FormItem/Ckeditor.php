<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\AssetManager\AssetManager;

class Ckeditor extends Textarea
{
	public function render()
	{
		AssetManager::addScript(Admin::instance()->router->routeToAsset('ckeditor/ckeditor.js'));
		if ( ! isset($this->attributes['class']))
		{
			$this->attributes['class'] = '';
		}
		$this->attributes['class'] .= ' ckeditor';
		return parent::render();
	}
}