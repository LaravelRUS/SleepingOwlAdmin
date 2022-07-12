<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class ErrorMessages extends Messages
{
    /**
     * @var string
     */
    protected static string $sessionName = 'error_message';

    /**
     * @var string
     */
    protected string $messageView = '_partials.messages.error';
}
