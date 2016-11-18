<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class WarningMessages extends Messages
{
    /**
     * @var string
     */
    protected $messageView = '_partials.messages.warning';

    /**
     * @return mixed
     */
    protected function getMessage()
    {
        return session('warning_message');
    }
}
