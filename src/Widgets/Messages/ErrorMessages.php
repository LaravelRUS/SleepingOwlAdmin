<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class ErrorMessages extends Messages
{
    /**
     * @var string
     */
    protected $messageView = '_partials.messages.error';

    /**
     * @return mixed
     */
    protected function getMessage()
    {
        return session('error_message');
    }
}
