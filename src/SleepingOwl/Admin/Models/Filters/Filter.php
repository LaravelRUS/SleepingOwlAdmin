<?php namespace SleepingOwl\Admin\Models\Filters;

use SleepingOwl\Admin\Exceptions\MethodNotFoundException;
use SleepingOwl\Admin\Models\ModelItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

/**
 * Class Filter
 * @method Filter as ()
 */
class Filter
{
	/**
	 * Filter field name
	 * @var string
	 */
	protected $name;
	/**
	 * Filter alias name in query
	 * @var string
	 */
	protected $alias;
	/**
	 * Filter title object to display as subtitle
	 * @var Title
	 */
	protected $title;
	/**
	 * Apply this filter scope
	 * @var string
	 */
	protected $scope;
	/**
	 * Value to filter by (ignoring query parameter)
	 * @var string
	 */
	protected $value;

	/**
	 * @param $name
	 */
	function __construct($name)
	{
		$this->name = $name;
		$this->alias = $name;
		$this->title = new Title;
		if ($modelItem = ModelItem::$current)
		{
			$modelItem->addFilter($this);
		}
	}

	/**
	 * Set static title and/or get title object
	 * @param null $title
	 * @return Title
	 */
	public function title($title = null)
	{
		return $this->title->title($title);
	}

	/**
	 * Set filter scope
	 * @param string $scope
	 * @return $this
	 */
	public function scope($scope)
	{
		$this->scope = $scope;
		return $this;
	}

	/**
	 * Run filter
	 * @param Builder $query
	 * @param array $parameters
	 * @return string
	 */
	public function filter(Builder $query, $parameters)
	{
		$parameter = $this->getParameter($parameters);
		if (is_null($parameter)) return null;

		if ( ! $this->applyScope($query, $parameter) && $this->name)
		{
			$query->where($this->name, '=', $parameter);
		}
		return $this->title->get($parameter);
	}

	/**
	 * Set static value for filter
	 * @param $value
	 * @return $this
	 */
	public function value($value)
	{
		$this->value = $value;
		return $this;
	}

	/**
	 * @return string
	 */
	public function getAlias()
	{
		return $this->alias;
	}

	/**
	 * @param string $alias
	 */
	public function setAlias($alias)
	{
		$this->alias = $alias;
	}

	/**
	 * @param $name
	 * @param $arguments
	 * @throws MethodNotFoundException
	 */
	function __call($name, $arguments)
	{
		if ($name == 'as')
		{
			$this->setAlias(Arr::get($arguments, 0, null));
			return $this;
		}
		throw new MethodNotFoundException(get_class($this), $name);
	}

	/**
	 * Apply scope to $query
	 * @param Builder $query
	 * @param $parameter
	 * @return bool
	 */
	protected function applyScope(Builder $query, $parameter)
	{
		if ($this->scope)
		{
			$query->{$this->scope}($parameter);
			return true;
		}
		return false;
	}

	/**
	 * @param $parameters
	 * @return mixed
	 */
	protected function getParameter($parameters)
	{
		if (($parameter = Arr::get($parameters, $this->alias, null)) && ($this->value !== null))
		{
			$parameter = $this->value;
		}
		return $parameter;
	}

} 