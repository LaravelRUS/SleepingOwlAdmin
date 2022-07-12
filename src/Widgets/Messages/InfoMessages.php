<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class InfoMessages extends Messages
{
    /**
     * @var string
     */
    protected static string $sessionName = 'info_message';

    /**
     * @var string
     */
    protected string $messageView = '_partials.messages.info';
}
