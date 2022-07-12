<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class SuccessMessages extends Messages
{
    /**
     * @var string
     */
    protected static string $sessionName = 'success_message';

    /**
     * @var string
     */
    protected string $messageView = '_partials.messages.success';
}
