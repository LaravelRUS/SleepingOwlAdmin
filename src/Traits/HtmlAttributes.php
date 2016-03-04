<?php

namespace SleepingOwl\Admin\Traits;

trait HtmlAttributes
{
    /**
     * @var array
     */
    private $attributes = [];

    /**
     * @return array
     */
    public function getAttributes()
    {
        $attributes = [];
        foreach ($this->attributes as $key => $attribute) {
            $attributes[$key] = $this->attributeElement($attribute);
        }

        return $attributes;
    }

    /**
     * @param string $key
     * @param string $default
     *
     * @return string|null
     */
    public function getAttribute($key, $default = null)
    {
        return array_get($this->getAttributes(), $key, $default);
    }

    /**
     * @param string       $key
     * @param string|array $attribute
     *
     * @return $this
     */
    public function setAttribute($key, $attribute)
    {
        $attribute = $this->attributeElement($attribute);

        if ($key == 'class') {
            $this->attributes[$key][] = $attribute;
        } else {
            $this->attributes[$key] = $attribute;
        }

        return $this;
    }

    /**
     * @param array $attributes
     *
     * @return $this
     */
    public function setAttributes(array $attributes)
    {
        foreach ($attributes as $key => $attribute) {
            if (is_numeric($key)) {
                $key = $attribute;
            }

            $this->setAttribute($key, $attribute);
        }

        return $this;
    }

    /**
     * @param string       $key
     * @param string|array $attribute
     *
     * @return $this
     */
    public function replaceAttribute($key, $attribute)
    {
        $attribute = $this->attributeElement($attribute);
        $this->attributes[$key] = $attribute;

        return $this;
    }

    /**
     * @param string $class
     *
     * @return bool
     */
    public function hasClass($class)
    {
        $has = false;

        if (! is_array($class)) {
            $class = func_get_args();
        }

        if (isset($this->attributes['class']) && is_array($this->attributes['class'])) {
            foreach ($this->attributes['class'] as $i => $string) {
                foreach ($class as $className) {
                    if (strpos($string, $className) !== false) {
                        $has = true;
                    }
                }
            }
        }

        return $has;
    }

    /**
     * @param srtring $key
     *
     * @return bool
     */
    public function hasAttribute($key)
    {
        return isset($this->attributes[$key]);
    }

    /**
     * @param string $key
     *
     * @return $this
     */
    public function removeAttribute($key)
    {
        unset($this->attributes[$key]);

        return $this;
    }

    /**
     * @return $this
     */
    public function clearAttributes()
    {
        $this->attributes = [];

        return $this;
    }

    /**
     * @param string|array $value
     *
     * @return string
     */
    protected function attributeElement($value)
    {
        if (is_array($value)) {
            $value = implode(' ', $value);
        }

        return $value;
    }
}
