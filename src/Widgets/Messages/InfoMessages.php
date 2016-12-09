<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class InfoMessages extends Messages
{
    /**
     * @var string
     */
    protected static $sessionName = 'info_message';

    /**
     * @var string
     */
    protected $messageView = '_partials.messages.info';
}
