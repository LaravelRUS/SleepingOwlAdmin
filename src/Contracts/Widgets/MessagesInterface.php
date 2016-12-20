<?php

namespace SleepingOwl\Admin\Contracts\Widgets;

interface MessagesInterface
{
    /**
     * @return string
     */
    public function getMessageView();

    /**
     * @param string $messageView
     *
     * @return void
     */
    public function setMessageView($messageView);

    /**
     * @param string $text
     *
     * @return mixed
     */
    public static function addMessage($text);
}
