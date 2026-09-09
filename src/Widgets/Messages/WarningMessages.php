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
    protected $messageClasses = 'alert-warning alert-message';

    protected $messageIcon = 'fas fa-exclamation-triangle';

    protected $messageRole = 'alert';
}
