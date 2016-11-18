<?php

namespace SleepingOwl\Admin\Widgets\Messages;


class InfoMessages extends Messages
{
    /**
     * @var string
     */
    protected $messageView = '_partials.messages.info';

    /**
     * @return mixed
     */
    protected function getMessage()
    {
        return session('info_message');
    }
}
