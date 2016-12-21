<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class WarningMessages extends Messages
{
    /**
     * @var string
     */
    protected static $sessionName = 'warning_message';

    /**
     * @var string
     */
    protected $messageView = '_partials.messages.warning';
}
