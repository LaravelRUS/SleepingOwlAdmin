<?php

namespace SleepingOwl\Admin\Widgets\Messages;

use BadMethodCallException;
use Illuminate\Support\Str;
use InvalidArgumentException;

class MessageStack
{
    /**
     * @var array
     */
    protected $types;

    /**
     * @param  null|array  $types
     */
    public function __construct(array $types = null)
    {
        $this->types = $types;
    }

    /**
     * @param  string  $name
     * @param  array  $arguments
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        $type = strtolower(substr($name, 3));

        if (Str::startsWith($name, 'add') && array_key_exists($type, $this->types)) {
            if (isset($arguments[0])) {
                return call_user_func("{$this->types[$type]}::addMessage", $arguments[0]);
            }

            throw new InvalidArgumentException("Method [{$name}] expected parameter");
        }

        throw new BadMethodCallException("Call to undefined method [{$name}]");
    }
}
