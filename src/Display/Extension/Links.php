<?php

namespace SleepingOwl\Admin\Display\Extension;

use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\Placable;

class Links extends Extension implements Placable
{
    use HtmlAttributes;

    /**
     * @var string|\Illuminate\View\View
     */
    protected $view = 'display.extensions.links';

    /**
     * @var string
     */
    protected $placement = 'before.panel';

    /**
     * @var array
     */
    protected $links = [];

    /**
     * @param array $links
     */
    public function set($links)
    {
        $this->links = $links;
    }

    public function getView()
    {
        return $this->view;
    }

    public function getPlacement()
    {
        return $this->placement;
    }

    public function getLinks()
    {
        return $this->links;
    }

    public function setLinks(array $links)
    {
        $this->links = $links;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'links' => $this->getLinks(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }
}
