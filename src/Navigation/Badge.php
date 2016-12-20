<?php

namespace SleepingOwl\Admin\Navigation;

class Badge extends \KodiComponents\Navigation\Badge
{
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
            'value' => $value,
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('_partials.navigation.badge', $this->toArray());
    }
}
