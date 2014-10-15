<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

use SleepingOwl\Admin\Exceptions\MethodNotFoundException;
use SleepingOwl\Admin\Exceptions\ValueNotSetException;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Arr;

/**
 * Class MultiSelect
 *
 * @package SleepingOwl\Admin\Models\Form\FormItem
 * @method MultiSelect list($modelClass)
 */
class MultiSelect extends BaseFormItem
{
	/**
	 * Class to load list from
	 *
	 * @var string
	 */
	protected $list;
	/**
	 * Attribute name to load selected values from
	 *
	 * @var string
	 */
	protected $value;

	/**
	 * @param string|null $name
	 * @param string|null $label
	 */
	function __construct($name = null, $label = null)
	{
		parent::__construct($name . '[]', $label);
	}

	/**
	 * @return string
	 */
	public function render()
	{
		if (is_array($this->list))
		{
			$list = $this->list;
			$list = array_combine($list, $list);
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
		return $this->formBuilder->selectGroup($this->name, $this->label, $list, $this->values(), [
			'class' => 'multiselect',
			'multiple'
		]);
	}

	/**
	 * @param $value
	 * @return $this
	 */
	public function value($value)
	{
		$this->value = $value;
		return $this;
	}

	/**
	 * @param $list
	 * @return $this
	 */
	public function setList($list)
	{
		$this->list = $list;
		return $this;
	}

	/**
	 * @param $name
	 * @param $arguments
	 * @throws MethodNotFoundException
	 */
	function __call($name, $arguments)
	{
		if ($name === 'list')
		{
			return $this->setList(Arr::get($arguments, 0, null));
		}
		throw new MethodNotFoundException(get_class($this), $name);
	}

	/**
	 * @throws ValueNotSetException
	 * @return mixed
	 */
	public function values()
	{
		$result = $this->form->instance;
		if (is_null($this->value))
		{
			throw new ValueNotSetException;
		}
		$parts = explode('.', $this->value);
		foreach ($parts as $part)
		{
			if ($result instanceof Relation)
			{
				$result = $result->lists($part);
			} else
			{
				$result = $result->$part();
			}
		}
		return $result;
	}

} 