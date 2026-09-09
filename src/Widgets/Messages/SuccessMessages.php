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
    protected $messageClasses = 'alert-success alert-message text-white';

    protected $messageIcon = 'fas fa-check-circle';
}
