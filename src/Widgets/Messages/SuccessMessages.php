<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class SuccessMessages extends Messages
{
    /**
     * @var string
     */
    protected static $sessionName = 'success_message';

    /**
     * @var string
     */
    protected $messageView = '_partials.messages.success';
}
