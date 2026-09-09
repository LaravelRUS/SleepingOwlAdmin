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
    protected $messageClasses = 'alert-info alert-message text-white';

    protected $messageIcon = 'fas fa-info';
}
