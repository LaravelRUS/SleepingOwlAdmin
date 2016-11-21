<?php

namespace SleepingOwl\Admin\Widgets\Messages;

/**
 * Class MessageStack.
 */
class MessageStack
{
    /**
     * @var array
     */
    protected $messageTypes;

    /**
     * MessageStack constructor.
     * @param null|array $messageTypes
     */
    public function __construct($messageTypes = null)
    {
        $this->messageTypes = $messageTypes;
    }

    /**
     * @param string $name
     * @param array $arguments
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        $type = strtolower(substr($name, 3));

        if (starts_with($name, 'add') && array_key_exists($type, $this->messageTypes)) {
            if (isset($arguments[0])) {
                return $this->messageTypes[$type]::addMessage($arguments[0]);
            } else {
                throw new \InvalidArgumentException("Method $name expected parameter");
            }
        }

        throw new \BadMethodCallException("Call to undefined method [{$name}]");
    }
}
