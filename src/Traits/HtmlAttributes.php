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
        $attribute              = $this->attributeElement($attribute);
        $this->attributes[$key] = $attribute;

        return $this;
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
