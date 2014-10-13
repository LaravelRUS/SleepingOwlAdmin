<?php namespace SleepingOwl\Admin\Models\Form\FormItem;

class TextAddon extends BaseFormItem
{
	protected $addon;
	protected $placement = 'before';

	public function render()
	{
		return $this->formBuilder->textAddonGroup($this->name, $this->label, $this->getAddon(), $this->placement, $this->getValueFromForm());
	}

	public function addon($addon)
	{
		$this->addon = $addon;
		return $this;
	}

	protected function getAddon()
	{
		$data = explode(':', $this->addon);
		$method = array_shift($data);
		if (method_exists($this, $method))
		{
			return call_user_func_array([
				$this,
				$method
			], $data);
		}
		return $this->addon;
	}

	/**
	 * @param string $placement
	 * @return $this
	 */
	public function placement($placement)
	{
		$this->placement = $placement;
		return $this;
	}

	protected function route($name, $parameters = [])
	{
		return route($name, $parameters);
	}

} 