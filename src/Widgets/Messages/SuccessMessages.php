<?php

namespace SleepingOwl\Admin\Widgets\Messages;


class SuccessMessages extends Messages
{
    protected $messageView = '_partials.messages.success';
    /**
     * @return mixed
     */
    protected function getMessage()
    {
        return session('success_message');
    }
}
