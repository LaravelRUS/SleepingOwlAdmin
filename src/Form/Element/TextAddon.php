<?php

namespace SleepingOwl\Admin\Form\Element;

class TextAddon extends NamedFormElement
{
    /**
     * @var string
     */
    protected $placement = 'before';

    /**
     * @var string
     */
    protected $addon;

    /**
     * @return string
     */
    public function getPlacement()
    {
        return $this->placement;
    }

    /**
     * @param string $placement
     *
     * @return $this
     */
    public function setPlacement($placement)
    {
        $this->placement = $placement;

        return $this;
    }

    /**
     * @return $this
     */
    public function placeBefore()
    {
        $this->placement = 'before';

        return $this;
    }

    /**
     * @return $this
     */
    public function placeAfter()
    {
        $this->placement = 'after';

        return $this;
    }

    /**
     * @return string
     */
    public function getAddon()
    {
        return $this->addon;
    }

    /**
     * @param string $addon
     *
     * @return $this
     */
    public function setAddon($addon)
    {
        $this->addon = $addon;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'placement' => $this->getPlacement(),
            'addon'     => $this->getAddon(),
        ];
    }
}
