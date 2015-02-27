<?php namespace SleepingOwl\Admin\Controllers;

use App;
use AdminAuth;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Columns\Column\Action;
use SleepingOwl\Admin\Exceptions\ValidationException;
use SleepingOwl\Admin\Repositories\Interfaces\ModelRepositoryInterface;
use SleepingOwl\Admin\Models\ModelItem;
use SleepingOwl\Admin\Session\QueryState;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\View\View;
use Input;
use Lang;
use Redirect;
use Session;

/**
 * Class AdminController
 * @package SleepingOwl\Admin\Controllers
 */
class AdminController extends BaseController
{
	/**
	 * @var string
	 */
	protected $modelName;
	/**
	 * @var ModelItem
	 */
	protected $modelItem;
	/**
	 * @var QueryState
	 */
	protected $queryState;
	/**
	 * @var ModelRepositoryInterface
	 */
	protected $modelRepository;

	/**
	 * @param QueryState $queryState
	 */
	function __construct(QueryState $queryState, $disableFilters = false)
	{
		parent::__construct();

		if (is_null($this->getRouter()))
		{
			$disableFilters = true;
		}

		$this->queryState = $queryState;

		# if isnt 'get' request add csrf filter
		$this->beforeFilter('csrf', [
			'on' => [
				'post',
				'put',
				'patch',
				'delete'
			]
		]);

		if ( ! $disableFilters)
		{
			# if there is {model} in route we autoinit it
			$this->beforeFilter(function (Route $route, Request $request)
			{
				if ($model = $route->parameter('model'))
				{
					$this->modelName = $model;
					$this->getModelItem();

					$this->modelRepository = App::make('SleepingOwl\Admin\Repositories\Interfaces\ModelRepositoryInterface', [
						'modelItem' => $this->modelItem,
						'request'   => $request
					]);

					$this->queryState->setPrefix($model);
				}
			});
		}
	}

	/**
	 * @return ModelItem
	 */
	protected function getModelItem()
	{
		try
		{
			$this->modelItem = $this->admin->models->modelWithAlias($this->modelName);
		} catch (\SleepingOwl\Admin\Exceptions\ModelNotFoundException $e)
		{
			Redirect::to($this->admin_router->routeHome())->send();
		}
		return $this->modelItem;
	}

	/**
	 * @param View $view
	 */
	protected function addViewDefaults(View $view)
	{
		parent::addViewDefaults($view);

		$view->with('user', AdminAuth::user());
		$view->with('menu', $this->admin->menu->getItems());
	}

	/**
	 * @return RedirectResponse
	 */
	protected function redirectToTable()
	{
		return Redirect::to($this->admin_router->routeToModel($this->modelName, $this->queryState->load()));
	}

	/**
	 * @param string $wildcard
	 * @return View
	 * @throws \Exception
	 */
	public function getWildcard($wildcard = '/')
	{
		$title = null;
		$content = '';
		if ($menuItem = Admin::instance()->menu->itemWithUrl($wildcard))
		{
			if ($action = $menuItem->getUses())
			{
				list($controller, $action) = explode('@', $action);
				$content = app($controller)->$action();
				$title = ($wildcard !== '/') ? $menuItem->getLabel() : null;
			} else
			{
				throw new \Exception('You need to provide valid action for this route.');
			}
		} elseif ($wildcard !== '/')
		{
			App::abort(404);
		}
		return $this->makeView('page', compact('title', 'content'));
	}

	public function renderCustomContent($title, $content)
	{
		return $this->makeView('page', compact('title', 'content'));
	}

	/**
	 * @return RedirectResponse
	 */
	protected function checkCustomActionCall()
	{
		$action = Input::query('action');
		$id = Input::query('id');
		if (is_null($action) || is_null($id))
		{
			return;
		}
		$column = $this->modelItem->getColumnByName($action);
		if (is_null($column))
		{
			return;
		}
		if ( ! $column instanceof Action)
		{
			return;
		}
		$instance = $this->modelRepository->getInstance($id);
		$result = $column->call($instance);

		if ( ! $result instanceof RedirectResponse)
		{
			$result = Redirect::back();
		}
		return $result;
	}

	/**
	 * @return View
	 */
	public function table()
	{
		if ($result = $this->checkCustomActionCall())
		{
			return $result;
		}
		if (Input::get('datatable_request'))
		{
			return $this->asyncTable();
		}
		$this->queryState->save();
		$data = [
			'title'         => $this->modelItem->getTitle(),
			'columns'       => $this->modelItem->getColumns(),
			'newEntryRoute' => $this->admin_router->routeToCreate($this->modelName, Input::query()),
			'modelItem'     => $this->modelItem,
			'rows'          => []
		];
		if ( ! $this->modelItem->isAsync())
		{
			$tableData = [];
			try
			{
				$tableData = $this->modelRepository->tableData();
			} catch (ModelNotFoundException $e)
			{
				App::abort(404);
			}
			$data = array_merge($data, $tableData);
		}
		$data['subtitle'] = $this->modelRepository->getSubtitle();
		return $this->makeView('model.table', $data);
	}

	/**
	 * @return array
	 */
	protected function asyncTable()
	{
		$columns = $this->modelItem->getColumns();

		$params = [];
		$params['offset'] = Input::get('start');
		$params['limit'] = Input::get('length');
		$params['search'] = Input::get('search.value');
		$orderData = Input::get('order')[0];
		$columnToOrder = $columns[intval($orderData['column'])];
		$params['orderBy'] = $columnToOrder->getName();
		if (method_exists($columnToOrder, 'getOrderBy'))
		{
			$params['orderBy'] = $columnToOrder->getOrderBy();
		}
		$params['orderDest'] = $orderData['dir'];

		$data = $this->modelRepository->tableData($params);

		$rowsCount = count($data['rows']);

		$result = [];
		$result['draw'] = Input::get('draw');
		$result['recordsTotal'] = $data['totalCount'];
		$result['recordsFiltered'] = $data['totalCount'];
		$result['data'] = [];
		foreach ($data['rows'] as $row)
		{
			$_row = [];
			foreach ($columns as $column)
			{
				$_row[] = $column->render($row, $rowsCount);
			}
			$result['data'][] = $_row;
		}
		return $result;
	}

	/**
	 * @return View
	 */
	public function create()
	{
		if ( ! $this->modelItem->isCreatable())
		{
			return $this->redirectToTable();
		}
		$form = $this->modelItem->getForm();
		$form->setInstance($this->modelRepository->getInstance());
		$form->setMethod('post');
		$form->setSaveUrl($this->admin_router->routeToStore($this->modelName));
		$form->setErrors(Session::get('errors'));
		$form->setBackUrl($this->redirectToTable()->getTargetUrl());
		$form->setValues(Input::query());

		$data = [
			'title' => $this->modelItem->getTitle(),
			'form'  => $form
		];
		return $this->makeView('model.form', $data);
	}

	/**
	 * @return Redirect
	 */
	public function store()
	{
		if ( ! $this->modelItem->isCreatable())
		{
			return $this->redirectToTable();
		}
		try
		{
			$this->modelRepository->store();
		} catch (ValidationException $e)
		{
			return \Redirect::back()->withInput()->withErrors($e->getErrors());
		}
		return $this->redirectToTable();
	}

	/**
	 * @param $modelName
	 * @param $id
	 * @return View
	 */
	public function edit($modelName, $id)
	{
		$instance = $this->modelRepository->getInstance($id);

		if ( ! $this->modelItem->isEditable($instance))
		{
			return $this->redirectToTable();
		}

		$form = $this->modelItem->getForm();
		$form->setInstance($instance);
		$form->setMethod('put');
		$form->setSaveUrl($this->admin_router->routeToUpdate($this->modelName, [$id]));
		$form->setErrors(Session::get('errors'));
		$form->setBackUrl($this->redirectToTable()->getTargetUrl());
		$form->setValues(Input::query());

		$data = [
			'title' => $this->modelItem->getTitle(),
			'form'  => $form
		];
		return $this->makeView('model.form', $data);
	}

	/**
	 * @param $modelName
	 * @param $id
	 * @return Redirect
	 */
	public function update($modelName, $id)
	{
		$instance = $this->modelRepository->getInstance($id);
		if ( ! $this->modelItem->isEditable($instance))
		{
			return $this->redirectToTable();
		}

		try
		{
			$this->modelRepository->update($id);
		} catch (ValidationException $e)
		{
			return \Redirect::back()->withInput()->withErrors($e->getErrors());
		}
		return $this->redirectToTable();
	}

	/**
	 * @param $modelName
	 * @param $id
	 * @return Redirect
	 */
	public function moveup($modelName, $id)
	{
		$this->modelRepository->moveUp($id);
		return $this->redirectToTable();
	}

	/**
	 * @param $modelName
	 * @param $id
	 * @return Redirect
	 */
	public function movedown($modelName, $id)
	{
		$this->modelRepository->moveDown($id);
		return $this->redirectToTable();
	}

	/**
	 * @param $modelName
	 * @param $id
	 * @return Redirect
	 */
	public function destroy($modelName, $id)
	{
		$instance = $this->modelRepository->getInstance($id);
		if ( ! $this->modelItem->isDeletable($instance))
		{
			return $this->redirectToTable();
		}
		try
		{
			$this->modelRepository->destroy($id);
		} catch (QueryException $e)
		{
			return $this->redirectToTable()->withMessage(Lang::get('admin::lang.table.delete-error'));
		}
		return $this->redirectToTable();
	}
}