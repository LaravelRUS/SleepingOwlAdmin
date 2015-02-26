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
		if ( ! isset($this->attributes['class']))
		{
			$this->attributes['class'] = '';
		}
		$this->attributes['class'] .= ' multiselect';
		$this->attributes['multiple'] = true;

		$content = $this->formBuilder->selectGroup($this->name, $this->label, $list, $this->values(), $this->attributes);
		$content .= '<input type="hidden" name="' . $this->name . '" value="__dummy-multiselect-value"/>';
		return $content;
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
	 * @return \SleepingOwl\Admin\Models\Form\FormItem\MultiSelect|void
	 * @throws MethodNotFoundException
	 */
	function __call($name, $arguments)
	{
		if ($name === 'list')
		{
			return $this->setList(Arr::get($arguments, 0, null));
		}
		return parent::__call($name, $arguments);
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
		if (count($result) == 0 && ! $this->form->instance->exists)
		{
			return $this->getDefault();
		}
		return $result;
	}

	/**
	 * @param array $data
	 */
	public function updateRequestData(&$data)
	{
		foreach ($data as $key => &$value)
		{
			if (is_array($value))
			{
				$value = array_filter($value, function ($item)
				{
					return $item !== '__dummy-multiselect-value';
				});
			}
		}
	}

} 