<?php

namespace SleepingOwl\Admin\Widgets\Messages;

use AdminTemplate;
use SleepingOwl\Admin\Widgets\Widget;

abstract class Messages extends Widget
{
    /**
     * @var string
     */
    protected static $sessionName;

    /**
     * @var string
     */
    protected $messageView;

    /**
     * Get content as a string of HTML.
     *
     * @return string
     */
    public function toHtml()
    {
        return AdminTemplate::view($this->messageView, [
            'messages' => $this->getMessage(),
        ])->render();
    }

    /**
     * @return string|array|\SleepingOwl\Admin\Templates\Template
     */
    public function template()
    {
        return AdminTemplate::getViewPath('_layout.inner');
    }

    /**
     * @return string
     */
    public function block()
    {
        return 'content.top';
    }

    /**
     * @return string
     */
    public function getMessageView()
    {
        return $this->messageView;
    }

    /**
     * @param  string  $messageView
     */
    public function setMessageView($messageView)
    {
        $this->messageView = $messageView;
    }

    /**
     * @return mixed
     */
    protected function getMessage()
    {
        return session(static::$sessionName);
    }

    /**
     * @param  string  $text
     * @return mixed
     */
    public static function addMessage($text)
    {
        return session()->flash(static::$sessionName, $text);
    }
}
