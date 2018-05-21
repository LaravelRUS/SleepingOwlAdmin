<?php

namespace SleepingOwl\Admin\Navigation;

class Badge extends \KodiComponents\Navigation\Badge
{
    public $view = null;

    /**
     * @return array
     */
    public function toArray()
    {
        $value = $this->getValue();

        if (! $this->hasClassProperty('label-', 'bg-')) {
            $this->setHtmlAttribute('class', 'label-primary');
        }

        return [
            'value'      => $value,
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
    public function setView($view)
    {
        $this->view = $view;
    }

    /**
     * @param null $view
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render($view = null)
    {
        return app('sleeping_owl.template')->view($this->getView(), $this->toArray());
    }
}
