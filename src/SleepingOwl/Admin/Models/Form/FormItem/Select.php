<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\Admin\Exceptions\MethodNotFoundException;
use Illuminate\Support\Arr;

/**
 * Class Select
 * @package SleepingOwl\Admin\Models\Form\FormItem
 * @method Select list($modelClass)
 */
class Select extends BaseFormItem
{
	/**
	 * @var array
	 */
	protected $list;

	/**
	 * @var bool
	 */
	protected $nullable = false;

	public function render()
	{
		if (is_array($this->list))
		{
			$list = $this->list;
		} else
		{
			if ( ! method_exists($this->list, 'getList'))
			{
				throw new \Exception('You must implement "public static function getList()" in "' . $this->list . '"');
			}
			$list = forward_static_call([
				$this->list,
				'getList'
			]);
		}
		if ( ! isset($this->attributes['class']))
		{
			$this->attributes['class'] = '';
		}
		$this->attributes['class'] .= ' multiselect';
		$this->attributes['size'] = 2;
		$this->attributes['data-select-type'] = 'single';

		if ($this->nullable)
		{
			$this->attributes['multiple'] = true;
			$this->attributes['data-nullable'] = true;
		}

		$select = $this->formBuilder->selectGroup($this->name, $this->label, $list, $this->getValueFromForm(), $this->attributes);

		return $select;
	}

	public function enum($values)
	{
		$this->list(array_combine($values, $values));
	}

	function __call($name, $arguments)
	{
		if ($name === 'list')
		{
			$this->list = Arr::get($arguments, 0, null);
			return $this;
		}
		return parent::__call($name, $arguments);
	}

	/**
	 * @param bool $nullable
	 * @return $this
	 */
	public function nullable($nullable = true)
	{
		$this->nullable = $nullable;
		return $this;
	}

	/**
	 * @param array $data
	 */
	public function updateRequestData(&$data)
	{
		if ($this->nullable && ! isset($data[$this->name]))
		{
			$data[$this->name] = null;
		}
	}

} 