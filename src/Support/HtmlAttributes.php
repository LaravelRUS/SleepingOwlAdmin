<?php

namespace SleepingOwl\Admin\Support;

use Illuminate\Support\Arr;

trait HtmlAttributes
{
    /**
     * @var array
     */
    private $htmlAttributes = [];

    /**
     * @return array
     */
    public function getHtmlAttributes()
    {
        $attributes = [];
        foreach ($this->htmlAttributes as $key => $attribute) {
            $attributes[$key] = $this->prepareHtmlAttributeValue($attribute);
        }

        return $attributes;
    }

    /**
     * @param string $key
     * @param string $default
     *
     * @return string|null
     */
    public function getHtmlAttribute($key, $default = null)
    {
        return Arr::get($this->getHtmlAttributes(), $key, $default);
    }

    /**
     * @param string       $key
     * @param string|array $attribute
     *
     * @return $this
     */
    public function setHtmlAttribute($key, $attribute)
    {
        $attribute = $this->prepareHtmlAttributeValue($attribute);

        if ($key == 'class') {
            $this->htmlAttributes[$key][] = $attribute;
        } else {
            $this->htmlAttributes[$key] = $attribute;
        }

        return $this;
    }

    /**
     * @param array $attributes
     *
     * @return $this
     */
    public function setHtmlAttributes(array $attributes)
    {
        foreach ($attributes as $key => $attribute) {
            if (is_numeric($key)) {
                $key = $attribute;
            }

            $this->setHtmlAttribute($key, $attribute);
        }

        return $this;
    }

    /**
     * @param string       $key
     * @param string|array $attribute
     *
     * @return $this
     */
    public function replaceHtmlAttribute($key, $attribute)
    {
        $attribute                  = $this->prepareHtmlAttributeValue($attribute);
        $this->htmlAttributes[$key] = $attribute;

        return $this;
    }

    /**
     * @param string $class
     *
     * @return bool
     */
    public function hasClassProperty($class)
    {
        if (! is_array($class)) {
            $class = func_get_args();
        }

        if (isset($this->htmlAttributes['class']) && is_array($this->htmlAttributes['class'])) {
            foreach ($this->htmlAttributes['class'] as $i => $string) {
                foreach ($class as $className) {
                    if (strpos($string, $className) !== false) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * @param string $key
     *
     * @return bool
     */
    public function hasHtmlAttribute($key)
    {
        return isset($this->htmlAttributes[$key]);
    }

    /**
     * @param string $key
     *
     * @return $this
     */
    public function removeHtmlAttribute($key)
    {
        unset($this->htmlAttributes[$key]);

        return $this;
    }

    /**
     * @param string $key
     *
     * @return $this
     */
    public function removeHtmlAttributes($key)
    {
        if (! is_array($key)) {
            $key = func_get_args();
        }

        foreach ($key as $k) {
            $this->removeHtmlAttribute($k);
        }

        return $this;
    }

    /**
     * @return $this
     */
    public function clearHtmlAttributes()
    {
        $this->htmlAttributes = [];

        return $this;
    }

    /**
     * @return string
     */
    public function htmlAttributesToString()
    {
        $html = [];

        $prepareAttributeValue = function ($key, $value) {
            if (is_numeric($key)) {
                $key = $value;
            }

            if (! is_null($value)) {
                return $key.'="'.e($value).'"';
            }
        };

        foreach ((array) $this->getHtmlAttributes() as $key => $value) {
            $element = $prepareAttributeValue($key, $value);

            if (! is_null($element)) {
                $html[] = $element;
            }
        }

        return count($html) > 0
            ? ' '.implode(' ', $html)
            : '';
    }

    /**
     * @param string|array $value
     *
     * @return string
     */
    protected function prepareHtmlAttributeValue($value)
    {
        if (is_array($value)) {
            $value = implode(' ', $value);
        }

        return $value;
    }
}
