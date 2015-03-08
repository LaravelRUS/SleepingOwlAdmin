<?php namespace SleepingOwl\Html;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Html\FormBuilder as IlluminateFormBuilder;
use Illuminate\Support\ViewErrorBag;
use Lang;
use SleepingOwl\DateFormatter\DateFormatter;
use SleepingOwl\Models\Interfaces\ModelWithFileFieldsInterface;
use SleepingOwl\Models\Interfaces\ModelWithImageFieldsInterface;

/**
 * Class FormBuilder
 */
class FormBuilder extends IlluminateFormBuilder
{
	/**
	 * @var ViewErrorBag
	 */
	protected $errors;

	/**
	 * @param array $options
	 * @return string
	 */
	public function open(array $options = [])
	{
		$this->errors = array_get($options, 'errors');
		array_forget($options, 'errors');
		array_set($options, 'files', true);
		return parent::open($options);
	}

	/**
	 * Append element label and error label to form element and wrap it with div
	 *
	 * @param string $name
	 * @param string $label
	 * @param string $formElement
	 * @return string
	 */
	protected function makeGroup($name, $label, $formElement)
	{
		$content = '';
		$content .= $this->label($name, $label);
		$content .= $formElement;
		return $this->wrapContent($name, $content);
	}

	/**
	 * Append error label to element and wrap it with div
	 *
	 * @param string $name
	 * @param string $content
	 * @return string
	 */
	protected function wrapContent($name, $content)
	{
		$content .= $this->errors->first($name, $this->getErrorTemplate());
		$class = $this->getErrorClass($name);
		return $this->wrapGroup($content, compact('class'));
	}

	/**
	 * Wrap content with div
	 *
	 * @param string $content
	 * @param array $options
	 * @return string
	 */
	protected function wrapGroup($content, array $options = [])
	{
		$options = $this->addClassToOptions($this->getFormGroupClass(), $options);
		return $this->html->tag('div', $options, $content);
	}

	/**
	 * Add class to attributes array
	 *
	 * @param string $classToAdd
	 * @param array $options
	 * @return array
	 */
	protected function addClassToOptions($classToAdd, array $options = [])
	{
		$class = array_get($options, 'class', '');
		if (is_array($class))
		{
			$class[] = $classToAdd;
		} elseif ( ! empty($class))
		{
			$class .= ' ' . $classToAdd;
		} else
		{
			$class = $classToAdd;
		}
		array_set($options, 'class', $class);
		return $options;
	}

	/**
	 * @param $name
	 * @param null $value
	 * @param string $addon
	 * @param string $placement
	 * @param array $options
	 * @param array $wrapperOptions
	 * @return mixed
	 */
	public function textAddon($name, $value = null, $addon = '', $placement = 'before', $options = [],
							  $wrapperOptions = [])
	{
		$addonElement = $this->html->tag('span', ['class' => 'input-group-addon'], $addon);
		$inputElement = $this->text($name, $value, $options);
		if ($placement === 'before')
		{
			$content = $addonElement . $inputElement;
		} else
		{
			$content = $inputElement . $addonElement;
		}
		$wrapperOptions = $this->addClassToOptions('form-group input-group', $wrapperOptions);
		return $this->html->tag('div', $wrapperOptions, $content);
	}

	/**
	 * @param $name
	 * @param $label
	 * @param null $value
	 * @param array $options
	 * @param int $dateFormat
	 * @param int $timeFormat
	 * @return string
	 */
	public function datetime($name, $label, $value = null, array $options = [], $dateFormat = DateFormatter::SHORT,
							 $timeFormat = DateFormatter::NONE)
	{
		$value = $this->getValueAttribute($name, $value);
		if ( ! is_null($value))
		{
			$value = DateFormatter::format($value, $dateFormat, $timeFormat);
		}

		$options = $this->addClassToOptions('form-control', $options);
		$content = $this->textAddon($name, $value, '<span></span>', 'after', $options, ['class' => 'datepicker']);
		return $this->makeGroup($name, $label, $content);
	}

	/**
	 * @param $name
	 * @param $label
	 * @param null $value
	 * @param array $options
	 * @return mixed
	 */
	public function textGroup($name, $label, $value = null, array $options = [])
	{
		$options = $this->updateOptions($options);
		return $this->makeGroup($name, $label, $this->text($name, $value, $options));
	}

	/**
	 * @param $name
	 * @param $label
	 * @param bool $showSeconds
	 * @param null $value
	 * @param array $options
	 * @return string
	 */
	public function timeGroup($name, $label, $showSeconds = false, $value = null, array $options = [])
	{
		$options = $this->updateOptions($options);

		$value = $this->getValueAttribute($name, $value);
		$value = DateFormatter::format($value, DateFormatter::NONE, $showSeconds ? DateFormatter::MEDIUM : DateFormatter::SHORT);

		$content = $this->text($name, $value, $options);
		$content .= $this->html->tag('span', ['class' => 'input-group-addon'], '<span></span>');
		$content = $this->html->tag('div', ['class' => 'form-group input-group timepicker'], $content);
		return $this->makeGroup($name, $label, $content);
	}

	/**
	 * @param $name
	 * @param $label
	 * @param array $options
	 * @return mixed
	 */
	public function passwordGroup($name, $label, array $options = [])
	{
		$options = $this->updateOptions($options);
		return $this->makeGroup($name, $label, $this->password($name, $options));
	}

	/**
	 * @param $name
	 * @param $label
	 * @param string $addon
	 * @param string $placement
	 * @param null $value
	 * @param array $options
	 * @param array $wrapperAttributes
	 * @return mixed
	 */
	public function textAddonGroup($name, $label, $addon = '', $placement = 'before', $value = null,
								   array $options = [], array $wrapperAttributes = [])
	{
		$options = $this->updateOptions($options);
		return $this->makeGroup($name, $label, $this->textAddon($name, $value, $addon, $placement, $options, $wrapperAttributes));
	}

	/**
	 * @param $name
	 * @param $label
	 * @param null $value
	 * @param array $options
	 * @return mixed
	 */
	public function checkboxGroup($name, $label, $value = null, array $options = [])
	{
		$content = $this->hidden($name, 0, ['type' => 'hidden']);
		$content .= $this->labelWithoutEscaping($name, $this->checkbox($name, 1, $value, $options) . $label);
		$content = $this->html->tag('div', ['class' => 'checkbox'], $content);
		return $this->wrapContent($name, $content);
	}

	/**
	 * @param $name
	 * @param null $value
	 * @param array $options
	 * @return string
	 */
	public function labelWithoutEscaping($name, $value = null, $options = [])
	{
		$this->labels[] = $name;

		$options = $this->html->attributes($options);

		$value = $this->formatLabel($name, $value);

		return '<label for="' . $name . '"' . $options . '>' . $value . '</label>';
	}

	/**
	 * @param $name
	 * @param $label
	 * @param array $list
	 * @param null $value
	 * @param array $options
	 * @return mixed
	 */
	public function selectGroup($name, $label, array $list = [], $value = null, array $options = [])
	{
		$options = $this->updateOptions($options);
		return $this->makeGroup($name, $label, $this->html->tag('div', [], $this->select($name, $list, $value, $options)));
	}

	/**
	 * @param $name
	 * @param $label
	 * @param null $value
	 * @param array $options
	 * @return mixed
	 */
	public function textareaGroup($name, $label, $value = null, array $options = [])
	{
		$options = $this->updateOptions($options);
		return $this->makeGroup($name, $label, $this->textarea($name, $value, $options));
	}

	/**
	 * @param $name
	 * @param $label
	 * @param $model
	 * @param array $options
	 * @return mixed
	 */
	public function imageGroup($name, $label, ModelWithImageFieldsInterface $model, array $options = [])
	{
		$options = $this->updateOptions($options);
		$content = '';
		if ($model->$name->exists())
		{
			$img = $this->html->tag('img', [
				'class'       => 'thumbnail',
				'src'         => $model->$name->thumbnail('admin_preview'),
				'width'       => '80px',
				'data-toggle' => 'tooltip',
				'title'       => $model->$name->info()
			]);
			$innerContent = $this->html->tag('a', [
				'href'        => $model->$name->thumbnail('original'),
				'data-toggle' => 'lightbox'
			], $img);
			$innerContent .= $this->html->tag('a', [
				'href'      => '#',
				'class'     => 'img-delete',
				'data-name' => $name,
			], '<i class="fa fa-times"></i> ' . Lang::get('admin::lang.table.delete'));
			$innerContent .= '<div class="clearfix"></div>';
			$content .= $this->html->tag('div', ['class' => 'img-container'], $innerContent);
		}
		$content .= $this->file($name, null, $options);
		return $this->makeGroup($name, $label, $content);
	}

	/**
	 * @param $name
	 * @param $label
	 * @param ModelWithFileFieldsInterface $model
	 * @param array $options
	 * @return mixed
	 */
	public function fileGroup($name, $label, ModelWithFileFieldsInterface $model, array $options = [])
	{
		$options = $this->updateOptions($options);
		$content = '';
		if ($model->$name->exists())
		{
			$link = $this->html->tag('a', [
				'href'        => $model->$name->link(),
				'title'       => Lang::get('admin::lang.table.download'),
				'data-toggle' => 'tooltip'
			], '<i class="fa fa-fw fa-file-o"></i> ' . $model->$name->info());
			$file = $this->html->tag('div', ['class' => 'thumbnail file-info'], $link);
			$content .= $this->html->tag('div', [], $file);
		}
		$content .= $this->file($name, null, $options);
		return $this->makeGroup($name, $label, $content);
	}

	/**
	 * @param $cancelUrl
	 * @return mixed
	 */
	public function submitGroup($cancelUrl)
	{
		$content = $this->submit(Lang::get('admin::lang.table.save'), ['class' => 'btn btn-primary']);
		$content .= ' ';
		$content .= $this->html->link($cancelUrl, Lang::get('admin::lang.table.cancel'), ['class' => 'btn btn-default']);
		return $this->wrapGroup($content);
	}

	/**
	 * @param string $name
	 * @param array $attributes
	 * @return null|string
	 */
	public function getIdAttribute($name, $attributes)
	{
		if ($id = parent::getIdAttribute($name, $attributes))
		{
			return $id;
		}
		if (Arr::get($attributes, 'type') !== 'hidden')
		{
			return $name;
		}
		return null;
	}

	/**
	 * @return mixed
	 */
	public function getModel()
	{
		return $this->model;
	}

	/**
	 * @return string
	 */
	protected function getFormGroupClass()
	{
		return 'form-group';
	}

	/**
	 * @param array $options
	 * @return array
	 */
	protected function updateOptions($options = [])
	{
		return $this->addClassToOptions('form-control', $options);
	}

	/**
	 * @return string
	 */
	protected function getErrorTemplate()
	{
		return '<p class="help-block">:message</p>';
	}

	/**
	 * @param $name
	 * @return array
	 */
	protected function getErrorClass($name)
	{
		$class = [];
		if ($this->errors->has($name))
		{
			$class[] = 'has-error';
		}
		return $class;
	}

}