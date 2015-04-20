<?php namespace SleepingOwl\Admin\Columns\Column;

use AdminTemplate;

class TreeControl extends Control
{

	public function render()
	{
		$params = [
			'editable'  => $this->editable(),
			'editUrl'   => $this->editUrl(),
			'deletable' => $this->deletable(),
			'deleteUrl' => $this->deleteUrl(),
		];
		return view(AdminTemplate::view('column.tree_control'), $params);
	}

}