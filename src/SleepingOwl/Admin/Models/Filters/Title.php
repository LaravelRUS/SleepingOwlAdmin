<?php namespace SleepingOwl\Admin\Models\Filters;

use SleepingOwl\Admin\Exceptions\ModelAttributeNotFoundException;
use SleepingOwl\Admin\Exceptions\TitleNotFormattedException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class Title
 */
class Title
{
	/**
	 * Default field name
	 */
	const DEFAULT_FIELD = 'title';
	/**
	 * Classname to load title from
	 *
	 * @var string
	 */
	protected $from;
	/**
	 * Field name to load title from
	 *
	 * @var string
	 */
	protected $field;
	/**
	 * Static title. If set - $from field is ignored
	 *
	 * @var string
	 */
	protected $staticTitle;

	/**
	 * Set static title
	 *
	 * @param string $title
	 * @return $this
	 */
	public function title($title)
	{
		$this->staticTitle = $title;
		return $this;
	}

	/**
	 * Set model classname and/or attribute to load title from
	 *
	 * @param string $modelClass
	 * @param string|null $field
	 * @return $this
	 */
	public function from($modelClass, $field = null)
	{
		$this->from = $modelClass;
		$this->field = $field ?: static::DEFAULT_FIELD;
		return $this;
	}

	/**
	 * Get title as string
	 *
	 * @param string $parameter
	 * @throws ModelAttributeNotFoundException
	 * @throws TitleNotFormattedException
	 * @throws ModelNotFoundException
	 * @return string
	 */
	public function get($parameter)
	{
		if ( ! is_null($this->staticTitle)) return $this->staticTitle;
		if (is_null($this->from))
		{
			throw new TitleNotFormattedException;
		}
		$from = $this->from;
		$property = $this->field;
		$model = new $this->from;
		$model = $this->getInstance($parameter, $model);
		if (isset($model->$property))
		{
			return $model->$property;
		}
		throw new ModelAttributeNotFoundException($from, $property);
	}

	/**
	 * Get instance by id
	 *
	 * @param string $id
	 * @param Model $model
	 * @throws ModelNotFoundException
	 * @return Model|null
	 */
	protected function getInstance($id, $model)
	{
		return $model->findOrFail($id);
	}
}