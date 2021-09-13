<?php

namespace SleepingOwl\Admin\Traits;

trait ElementPlacementTrait
{
    /**
     * @return string
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * @param  string  $tag
     * @return $this
     */
    public function setTag($tag)
    {
        $this->tag = $tag;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlacement()
    {
        return $this->placement;
    }

    /**
     * @param  string  $placement
     * @return $this
     */
    public function setPlacement($placement)
    {
        $this->setTag($placement == 'table.header' ? 'thead' : 'tfoot');

        return $this;
    }

    /**
     * @return string
     *
     * @deprecated use getPlacement()
     */
    public function getPosition()
    {
        return $this->getPlacement();
    }

    /**
     * @param  string  $position
     * @return $this
     *
     * @deprecated use setPlacement(string $placement)
     */
    public function setPosition($position)
    {
        return $this->setPlacement($position);
    }
}
