<?php

namespace SleepingOwl\Admin\Traits;

trait Accessor
{
    /**
     * @param string $name
     * @param mixed  $default
     *
     * @return mixed|null
     */
    public function getAttribute($name, $default = null)
    {
        return array_get($this->attributes, $name, $default);
    }

    /**
     * @param string $name
     * @param mixed  $value
     *
     * @return $this
     */
    public function setAttribute($name, $value = null)
    {
        if (is_array($name)) {
            foreach ($name as $key => $value) {
                $this->setAttribute($key, $value);
            }
        } else {
            $method = 'set'.ucfirst($name);
            if (method_exists($this, 'set'.ucfirst($name))) {
                $this->attributes[$name] = $this->{$method}($value);
            } else {
                $this->attributes[$name] = $value;
            }
        }

        return $this;
    }

    /**
     * @param string $name
     *
     * @return mixed
     */
    public function __get($name)
    {
        return $this->getAttribute($name);
    }

    /**
     * @param string $name
     * @param mixed  $value
     *
     * @return void
     */
    public function __set($name, $value)
    {
        $this->setAttribute($name, $value);
    }

    /**
     * @param string $name
     *
     * @return bool
     */
    public function __isset($name)
    {
        return isset($this->attributes[$name]);
    }

    /**
     * @param $name
     */
    public function __unset($name)
    {
        unset($this->attributes[$name]);
    }
}
