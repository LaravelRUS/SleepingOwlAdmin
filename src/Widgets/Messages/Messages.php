<?php

namespace SleepingOwl\Admin\Widgets\Messages;

use SleepingOwl\Admin\Widgets\Widget;
use SleepingOwl\Admin\Contracts\Widgets\MessagesInterface;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

abstract class Messages extends Widget implements MessagesInterface
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
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @param TemplateInterface $template
     */
    public function __construct(TemplateInterface $template)
    {
        $this->template = $template;
    }

    /**
     * Get content as a string of HTML.
     *
     * @return string
     */
    public function toHtml()
    {
        return $this->template->view($this->messageView, [
            'messages' => $this->getMessages(),
        ])->render();
    }

    /**
     * @return string|array
     */
    public function template()
    {
        return $this->template->getViewPath('_layout.inner');
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
     * @param string $messageView
     */
    public function setMessageView($messageView)
    {
        $this->messageView = $messageView;
    }

    /**
     * @return string|null
     */
    protected function getMessages()
    {
        return session(static::$sessionName);
    }

    /**
     * @param string $text
     * @return mixed
     */
    public static function addMessage($text)
    {
        return session()->flash(static::$sessionName, $text);
    }
}
