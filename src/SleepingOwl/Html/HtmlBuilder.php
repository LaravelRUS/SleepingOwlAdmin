<?php namespace SleepingOwl\Html;

use Illuminate\Html\HtmlBuilder as IlluminateHtmlBuilder;

/**
 * Class HtmlBuilder
 */
class HtmlBuilder extends IlluminateHtmlBuilder
{
	/**
	 * @var string[]
	 */
	protected $tagsWithoutContent = [
		'input',
		'img',
		'br',
		'hr'
	];

	/**
	 * @param $tag
	 * @param array $attributes
	 * @param string $content
	 * @return string
	 */
	public function tag($tag, $attributes = [], $content = null)
	{
		return $this->getOpeningTag($tag, $attributes) . $content . $this->getClosingTag($tag);
	}

	/**
	 * @param string $key
	 * @param string $value
	 * @return string
	 */
	protected function attributeElement($key, $value)
	{
		if (is_array($value))
		{
			$value = implode(' ', $value);
		}
		return parent::attributeElement($key, $value);
	}

	/**
	 * @param $tag
	 * @param array $attributes
	 * @return string
	 */
	protected function getOpeningTag($tag, array $attributes)
	{
		$result = '<' . $tag;
		if ( ! empty($attributes))
		{
			$result .= $this->attributes($attributes);
		}
		if ($this->isTagNeedsClosingTag($tag))
		{
			$result .= '>';
		}
		return $result;
	}

	/**
	 * @param $tag
	 * @return string
	 */
	protected function getClosingTag($tag)
	{
		$closingTag = '/>';
		if ($this->isTagNeedsClosingTag($tag))
		{
			$closingTag = '</' . $tag . '>';
		}
		return $closingTag;
	}

	/**
	 * @param $tag
	 * @return bool
	 */
	protected function isTagNeedsClosingTag($tag)
	{
		return ! in_array($tag, $this->tagsWithoutContent);
	}
}