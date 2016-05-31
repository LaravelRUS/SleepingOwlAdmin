<?php

namespace SleepingOwl\Admin\DataProvider;


/**
 * Class DataProvider
 *
 * The DataProvider model Register.
 *
 * @package SleepingOwl\Admin\DataProvider
 */
class DataProvider
{
    protected $models = [];

    /**
     * @param $cls The model class
     * @return Configuration|null If has be registered, return the
     *                            {@see Configuration} object, otherwise,
     *                            `null`.
     */
    public function get($cls)
    {
        return $this->has($cls) ? $this->models[$cls] : null;
    }

    /**
     * Register a new mode class.
     *
     * if the $callback is not null, call it passing the new
     * {@see Configuration} object for $cls.
     *
     * @param $cls The model class.
     * @param callable|null $callback The callback
     * @return $this
     */
    public function register($cls, $callback = null)
    {
        $this->models[$cls] = $cfg = new Configuration($cls);

        if (! is_null($callback)) {
            $callback($cfg);
        }

        return $this;
    }

    /**
     * Check if the model class has be registered.
     *
     * @param $cls The model class
     * @return bool `true` if is registered, otherwise, `false`.
     */
    public function has($cls)
    {
        return array_key_exists($cls, $this->models);
    }
}