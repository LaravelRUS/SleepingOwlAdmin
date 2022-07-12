<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class WarningMessages extends Messages
{
    /**
     * @var string
     */
    protected static string $sessionName = 'warning_message';

    /**
     * @var string
     */
    protected string $messageView = '_partials.messages.warning';
}
