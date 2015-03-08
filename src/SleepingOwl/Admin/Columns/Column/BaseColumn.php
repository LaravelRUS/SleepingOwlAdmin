<?php namespace SleepingOwl\Admin\Columns\Column;

use Illuminate\Support\Str;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Columns\Interfaces\ColumnInterface;
use SleepingOwl\Admin\Models\ModelItem;
use Illuminate\Support\Collection;

abstract class BaseColumn implements ColumnInterface
{
	/**
	 * Column field name
	 *
	 * @var string
	 */
	protected $name;
	/**
	 * Column label
	 *
	 * @var string
	 */
	protected $label;
	/**
	 * Is column sortable?
	 *     false|true|'default'
	 *
	 * @var string|boolean
	 */
	protected $sortable;
	/**
	 * Html builder
	 *
	 * @var \SleepingOwl\Html\HtmlBuilder
	 */
	protected $htmlBuilder;
	/**
	 * Model item, that ownes this column
	 *
	 * @var ModelItem
	 */
	protected $modelItem;
	/**
	 * Appends to this column cells
	 *
	 * @var ColumnInterface[]
	 */
	protected $appends = [];
	/**
	 * Is this column hidden?
	 *
	 * @var bool
	 */
	protected $hidden = false;

	/**
	 * @param string $name
	 * @param string $label
	 */
	function __construct($name, $label = null)
	{
		$this->name = $name;
		if (is_null($label))
		{
			$this->label = ucwords(str_replace('_', ' ', $name));
		} else
		{
			$this->label = $label;
		}
		$this->sortable(true);
		$this->htmlBuilder = Admin::instance()->htmlBuilder;
		$this->modelItem = ModelItem::$current;
	}

	/**
	 * Set sortable property
	 *
	 * @param bool $sortable
	 */
	public function sortable($sortable)
	{
		$this->sortable = $sortable;
	}

	/**
	 * Set this column as default sortable for this model item
	 */
	public function sortableDefault()
	{
		$this->sortable = 'default';
	}

	/**
	 * Is this column sortable?
	 *
	 * @return bool
	 */
	public function isSortable()
	{
		return $this->sortable !== false;
	}

	/**
	 * Is this column default sortable?
	 *
	 * @return bool
	 */
	public function isSortableDefault()
	{
		return $this->sortable === 'default';
	}

	/**
	 * Append column to this column cells
	 *
	 * @param ColumnInterface $append
	 */
	public function append(ColumnInterface $append)
	{
		$this->appends[] = $append;
	}

	/**
	 * Render column header
	 *
	 * @return string
	 */
	public function renderHeader()
	{
		return $this->htmlBuilder->tag('th', $this->getAttributesForHeader(), $this->label);
	}

	/**
	 * Get attributes for column header tag
	 *
	 * @return array
	 */
	protected function getAttributesForHeader()
	{
		$attributes = [];
		if ( ! $this->isSortable())
		{
			$attributes['data-sortable'] = 'false';
		}
		if ($this->isSortableDefault())
		{
			$attributes['data-sortable-default'] = 'true';
		}
		$attributes['style'] = 'width:10px;';
		return $attributes;
	}

	/**
	 * Render column cell
	 *
	 * @param $instance
	 * @param int $totalCount
	 * @param string $content
	 * @return string
	 */
	public function render($instance, $totalCount, $content = null)
	{
		if (is_null($content))
		{
			$content = $this->valueFromInstance($instance, $this->name);
		}
		$content = $this->renderAppends($instance, $totalCount, $content);
		return $this->htmlBuilder->tag('td', $this->getAttributesForCell($instance), $content);
	}

	/**
	 * Get attributes for column cell tag
	 *
	 * @return array
	 */
	protected function getAttributesForCell($instance)
	{
		return [];
	}

	/**
	 * Render column cells appends
	 *
	 * @param $instance
	 * @param $totalCount
	 * @param $content
	 * @return string
	 */
	protected function renderAppends($instance, $totalCount, $content)
	{
		$appends = [$content];
		foreach ($this->appends as $append)
		{
			$appends[] = $append->render($instance, $totalCount);
		}
		return implode(' ', $appends);
	}

	/**
	 * Get value from $instance by $name
	 * Use dot delimiter and search recursive
	 *
	 * @param $instance
	 * @param string $name
	 * @return mixed
	 */
	public function valueFromInstance($instance, $name)
	{
		$result = $instance;
		$parts = explode('.', $name);
		foreach ($parts as $part)
		{
			if ($result instanceof Collection)
			{
				$result = $result->lists($part);
			} elseif (is_null($result))
			{
				$result = null;
			} else
			{
				$result = $result->$part;
			}
		}
		return $result;
	}

	/**
	 * @return bool
	 */
	public function isHidden()
	{
		return $this->hidden;
	}

	/**
	 * @return string
	 */
	public function getName()
	{
		return $this->name;
	}

}