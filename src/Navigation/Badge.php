<?php

namespace SleepingOwl\Admin\Navigation;

use KodiComponents\Support\HtmlAttributes;

class Badge extends \KodiComponents\Navigation\Badge
{
    // fix KodiComponents for bootstrap 4
    // http://bootstrap-4.ru/docs/4.0/migration/#labels-and-badges
    use HtmlAttributes;

    public function __construct($value = null, $priority = 0)
    {
        if (! is_null($value)) {
            $this->setValue($value);
        }

        $this->setPriority($priority);

        $this->setHtmlAttribute('class', 'badge');
    }

    // end fix

    /**
     * @param  null  $view
     */
    public $view;

    /**
     * @return array
     */
    public function toArray()
    {
        $value = $this->getValue();

        if (! $this->hasClassProperty('badge-', 'bg-')) {
            $this->setHtmlAttribute('class', 'badge-primary');
        }

        return [
            'value' => $value,
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * @return null|string
     */
    public function getView()
    {
        if ($this->view) {
            return $this->view;
        }

        return '_partials.navigation.badge';
    }

    /**
     * @param $view
     */
    public function setView($view = null)
    {
        $this->view = $view;
    }

    /**
     * @param  null  $view
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render($view = null)
    {
        return app('sleeping_owl.template')->view($this->getView(), $this->toArray());
    }
}
