<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class ErrorMessages extends Messages
{
    /**
     * @var string
     */
    protected static $sessionName = 'error_message';

    /**
     * @var string
     */
    protected $messageView = '_partials.messages.error';
}
