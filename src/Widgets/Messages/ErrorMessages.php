<?php

namespace SleepingOwl\Admin\Widgets\Messages;

class ErrorMessages extends Messages
{
    /**
     * @var string
     */
    protected static $sessionName = 'error_message';

    /**
     * @var string
     */
    protected $messageClasses = 'alert-error alert-danger alert-message text-white';

    protected $messageIcon = 'fas fa-times';

    protected $messageRole = 'alert';
}
