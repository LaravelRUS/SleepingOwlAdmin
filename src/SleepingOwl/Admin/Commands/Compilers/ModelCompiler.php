<?php namespace SleepingOwl\Admin\Commands\Compilers;

use DB;
use Doctrine\DBAL\Schema\Column;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use SleepingOwl\Models\Interfaces\ModelWithFileFieldsInterface;
use SleepingOwl\Models\Interfaces\ModelWithImageFieldsInterface;

class ModelCompiler
{
	/**
	 * @var Command
	 */
	protected $command;
	/**
	 * @var string
	 */
	protected $modelClass;
	/**
	 * @var string|null
	 */
	protected $title;
	/**
	 * @var string[]
	 */
	protected $with;
	/**
	 * @var string[]
	 */
	protected $columns;
	/**
	 * @var string[]
	 */
	protected $filters;
	/**
	 * @var string[]
	 */
	protected $formItems;
	/**
	 * @var Model
	 */
	protected $instance;
	/**
	 * @var \Doctrine\DBAL\Schema\AbstractSchemaManager
	 */
	protected $schemaManager;
	/**
	 * @var string
	 */
	protected $table;
	/**
	 * @var array
	 */
	protected $columnsInfo;

	/**
	 * @param Command $command
	 * @param string $modelClass
	 * @param string $title
	 */
	function __construct(Command $command, $modelClass, $title)
	{
		$this->command = $command;
		$this->schemaManager = DB::getDoctrineSchemaManager();
		$this->schemaManager->getDatabasePlatform()->registerDoctrineTypeMapping('enum', 'string');
		$this->modelClass = $modelClass;
		$this->instance = new $this->modelClass;
		$this->table = $this->instance->getTable();
		$this->title = $title;
		$this->with = [];
		$this->columns = [];
		$this->filters = [];
		$this->formItems = [];
	}

	/**
	 * @param string $columnsString
	 */
	public function parseColumns($columnsString)
	{
		if (is_null($columnsString)) return;

		$columns = preg_split('/\s?,\s?/', $columnsString, -1, PREG_SPLIT_NO_EMPTY);
		foreach ($columns as $column)
		{
			$type = $this->guessType($column);
			$this->guessWith($column);
			$title = $this->getColumnDefaultTitle($column);
			$this->columns[] = $this->renderColumn($type, $column, $title);
		}
	}

	/**
	 * @param string $type
	 * @param string $column
	 * @param string $title
	 * @return string
	 */
	protected function renderColumn($type, $column, $title)
	{
		$template = "Column:::type(':field', ':title')";
		if ($type == 'image')
		{
			$template = "Column:::type(':field')->sortable(false)";
		}
		$result = strtr($template, [
			':type'  => $type,
			':field' => $column,
			':title' => $title
		]);
		if ($this->hasRelation($column, '\Illuminate\Database\Eloquent\Relations\HasMany'))
		{
			$appendTemplate = ";//->append(Column::filter(':foreignKey')->model(:foreignModel::class));";
			$relation = $this->getRelation($column);
			list($foreignModel, $foreignKey) = explode('.', $relation->getForeignKey());
			$foreignModel = Str::studly(Str::singular($foreignModel));
			$result .= strtr($appendTemplate, [
				':foreignKey'   => $foreignKey,
				':foreignModel' => $foreignModel
			]);
			return $result;
		}
		$first = $this->getFirstPart($column);
		if ($this->hasRelation($first, '\Illuminate\Database\Eloquent\Relations\BelongsTo'))
		{
			$appendTemplate = "->append(Column::filter(':foreignKey')->value(':first.id'));";
			$relation = $this->getRelation($first);
			$foreignKey = $relation->getForeignKey();
			$foreignModel = get_class($relation->getRelated());
			$result .= strtr($appendTemplate, [
				':foreignKey' => $foreignKey,
				':first'      => $first
			]);

			$this->appendFilter($foreignKey, $foreignModel);
			return $result;
		}
		if ($this->isDateTimeColumn($column))
		{
			$appendTemplate = "->format(':date', ':time');";
			$columnType = $this->getColumnType($column);
			switch ($columnType)
			{
				case 'date':
					$date = 'medium';
					$time = 'none';
					break;
				case 'time':
					$date = 'none';
					$time = 'short';
					break;
				case 'datetime':
					$date = 'medium';
					$time = 'short';
					break;
			}
			$result .= strtr($appendTemplate, [
				':date' => $date,
				':time' => $time
			]);
			return $result;
		}
		return $result . ';';
	}

	/**
	 * @param string $column
	 * @return string
	 */
	protected function guessType($column)
	{
		if ($this->isImageColumn($column))
		{
			return 'image';
		}
		if ($this->hasRelation($column, '\Illuminate\Database\Eloquent\Relations\HasMany'))
		{
			return 'count';
		}
		if ($this->hasRelation($this->getFirstPart($column), '\Illuminate\Database\Eloquent\Relations\BelongsToMany'))
		{
			return 'lists';
		}
		if ($this->isDateTimeColumn($column))
		{
			return 'date';
		}
		return 'string';
	}

	/**
	 * @param string $column
	 */
	protected function guessWith($column)
	{
		if ($this->hasRelation($column, '\Illuminate\Database\Eloquent\Relations\HasMany'))
		{
			$this->with[] = $column;
		} else
		{
			$first = $this->getFirstPart($column);
			if ($this->hasRelation($first, [
				'\Illuminate\Database\Eloquent\Relations\BelongsTo',
				'\Illuminate\Database\Eloquent\Relations\BelongsToMany'
			])
			)
			{
				$this->with[] = $first;
			}
		}
	}

	/**
	 * @param string $column
	 * @param string|string[] $relation
	 * @return bool
	 */
	protected function hasRelation($column, $relation)
	{
		if ( ! is_array($relation)) $relation = [$relation];
		return method_exists($this->instance, $column) && in_array(get_class($this->getRelation($column)), $relation);
	}

	/**
	 * @param string $column
	 * @return HasMany|BelongsTo|BelongsToMany
	 */
	protected function getRelation($column)
	{
		return $this->instance->$column();
	}

	/**
	 * @param string $column
	 * @return string
	 */
	protected function getColumnDefaultTitle($column)
	{
		return ucwords($this->getFirstPart($column));
	}

	/**
	 * @param string $column
	 * @return string|null
	 */
	protected function getFirstPart($column)
	{
		$parts = explode('.', $column);
		return array_shift($parts);
	}

	/**
	 * @return array
	 */
	public function getReplacements()
	{
		$with = array_map(function ($with)
		{
			return "'$with'";
		}, $this->with);
		$appendTab = function ($entry)
		{
			return "\t$entry";
		};
		$columns = array_map($appendTab, $this->columns);
		$filters = array_map($appendTab, $this->filters);
		$formItems = array_map($appendTab, $this->formItems);
		return [
			':modelClass' => $this->modelClass,
			':title'      => $this->title,
			':with'       => implode(', ', $with),
			':filters'    => implode("\n", $filters),
			':columns'    => implode("\n", $columns),
			':form'       => implode("\n", $formItems)
		];
	}

	/**
	 * @return string
	 */
	public function getModelClass()
	{
		return $this->modelClass;
	}

	/**
	 * @param string $foreignKey
	 * @param string $foreignModel
	 */
	protected function appendFilter($foreignKey, $foreignModel)
	{
		$filterTemplate = "ModelItem::filter(':foreignKey')->title()->from(:foreignModel::class);";
		$this->filters[] = strtr($filterTemplate, [
			':foreignKey'   => $foreignKey,
			':foreignModel' => $foreignModel
		]);
	}

	/**
	 * @param $column
	 * @return null|string
	 */
	protected function getColumnType($column)
	{
		$columns = $this->schemaManager->listTableColumns($this->table);
		if (isset($columns[$column]))
		{
			return $columns[$column]->getType()->getName();
		}
		return null;
	}

	/**
	 *
	 */
	public function generateForm()
	{
		$ignoredColumns = [
			$this->instance->getKeyName(),
			Model::CREATED_AT,
			Model::UPDATED_AT
		];

		$columns = $this->schemaManager->listTableColumns($this->table);
		$textareas = [];
		foreach ($columns as $column)
		{
			if (in_array($column->getName(), $ignoredColumns)) continue;
			$formItem = $this->generateFormItem($column);
			if ($column->getType()->getName() === 'text')
			{
				$textareas[] = $formItem;
			} else
			{
				$this->formItems[] = $formItem;
			}
		}
		$this->formItems = array_merge($this->formItems, $textareas);
	}

	/**
	 * @param Column $column
	 * @return string
	 */
	protected function generateFormItem(Column $column)
	{
		$template = "FormItem:::type(':name', ':label')";
		$type = $this->guessFormItemType($column);
		$name = $column->getName();
		$result = strtr($template, [
			':type'  => $type,
			':name'  => $name,
			':label' => ucwords(Str::snake(Str::camel(str_replace('_id', '', $name)), ' '))
		]);

		switch ($type)
		{
			case 'select':
				if ($foreignKey = $this->getForeignKey($name))
				{
					$foreignModel = Str::studly(Str::singular($foreignKey->getForeignTableName()));
					$result .= "->list($foreignModel::class)";
				}
				if ($this->isEnumColumn($name))
				{
					$enumValues = $this->getEnumValues($name);
					$result .= "->enum([" . implode(', ', $enumValues) . "])";
				}
				break;
			case 'time':
			case 'timestamp':
				$result .= ';//->seconds(true)';
				break;
		}

		return $result . ';';
	}

	/**
	 * @param Column $column
	 * @return string
	 */
	protected function guessFormItemType(Column $column)
	{
		$name = $column->getName();
		if ($this->isImageColumn($name))
		{
			return 'image';
		}
		if ($this->isFileColumn($name))
		{
			return 'file';
		}
		$foreignKey = $this->getForeignKey($name);
		if ( ! is_null($foreignKey))
		{
			return 'select';
		}
		$type = $column->getType()->getName();
		if ($type == 'string' && $this->isEnumColumn($name))
		{
			return 'select';
		}
		$lookup = [
			'string'   => 'text',
			'text'     => 'ckeditor',
			'integer'  => 'text',
			'float'    => 'text',
			'boolean'  => 'checkbox',
			'date'     => 'date',
			'time'     => 'time',
			'datetime' => 'timestamp',
		];
		return Arr::get($lookup, $type, 'text');
	}

	/**
	 * @param $column
	 * @return bool
	 */
	protected function isImageColumn($column)
	{
		return ($this->instance instanceof ModelWithImageFieldsInterface) && $this->instance->hasImageField($column);
	}

	/**
	 * @param $column
	 * @return bool
	 */
	protected function isFileColumn($column)
	{
		return ($this->instance instanceof ModelWithFileFieldsInterface) && $this->instance->hasFileField($column);
	}

	/**
	 * @param $name
	 * @return \Doctrine\DBAL\Schema\ForeignKeyConstraint|null
	 */
	protected function getForeignKey($name)
	{
		$foreignKeys = $this->schemaManager->listTableForeignKeys($this->table);
		foreach ($foreignKeys as $foreignKey)
		{
			foreach ($foreignKey->getLocalColumns() as $localColumn)
			{
				if ($localColumn === $name)
				{
					return $foreignKey;
				}
			}
		}
		return null;
	}

	/**
	 * @param $name
	 * @return null
	 */
	protected function getColumnInfo($name)
	{
		if (is_null($this->columnsInfo))
		{
			$sql = $this->schemaManager->getDatabasePlatform()->getListTableColumnsSQL($this->table);
			$this->columnsInfo = DB::select($sql);
		}
		foreach ($this->columnsInfo as $column)
		{
			if ($column->Field === $name)
			{
				return $column;
			}
		}
		return null;
	}

	/**
	 * @param $name
	 * @return bool
	 */
	protected function isEnumColumn($name)
	{
		if ($column = $this->getColumnInfo($name))
		{
			if (strpos($column->Type, 'enum') !== false)
			{
				return true;
			}
		}
		return false;
	}

	/**
	 * @param $name
	 * @return array
	 */
	protected function getEnumValues($name)
	{
		if ($column = $this->getColumnInfo($name))
		{
			$type = $column->Type;
			$token = '(), ';
			strtok($type, $token);

			$entries = [];
			while ($entry = strtok($token))
			{
				$entries[] = $entry;
			}
			return $entries;
		}
		return [];
	}

	/**
	 * @param $column
	 * @return bool
	 */
	protected function isDateTimeColumn($column)
	{
		return in_array($this->getColumnType($column), [
			'date',
			'time',
			'datetime'
		]);
	}

} 