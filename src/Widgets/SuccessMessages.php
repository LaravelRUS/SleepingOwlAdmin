<?php

namespace SleepingOwl\Admin\Widgets;

use AdminTemplate;

class SuccessMessages extends Widget
{

    /**
     * Get content as a string of HTML.
     *
     * @return string
     */
    public function toHtml()
    {
        return AdminTemplate::view('_partials.messages', [
            'messages' => session('success_message')
        ])->render();
    }

    /**
     * @return string|array
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
}