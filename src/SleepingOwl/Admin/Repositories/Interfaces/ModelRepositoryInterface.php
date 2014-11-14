<?php namespace SleepingOwl\Admin\Repositories\Interfaces;

use SleepingOwl\Admin\Models\ModelItem;
use Illuminate\Http\Request;

/**
 * Interface ModelRepositoryInterface
 * @package SleepingOwl\Admin\Repositories\Interfaces
 */
interface ModelRepositoryInterface
{
	/**
	 * @param ModelItem $modelItem
	 * @param Request $request
	 */
	function __construct(ModelItem $modelItem, Request $request);

	/**
	 * @param null $id
	 * @return mixed
	 */
	public function getInstance($id = null);

	/**
	 * @param $id
	 * @return mixed
	 */
	public function find($id);

	/**
	 * @param null $params
	 * @return mixed
	 */
	public function tableData($params = null);

	/**
	 * @return string
	 */
	public function getSubtitle();

	/**
	 * @return mixed
	 */
	public function store();

	/**
	 * @param $id
	 * @return mixed
	 */
	public function update($id);

	/**
	 * @param $id
	 * @return mixed
	 */
	public function moveUp($id);

	/**
	 * @param $id
	 * @return mixed
	 */
	public function moveDown($id);
} 