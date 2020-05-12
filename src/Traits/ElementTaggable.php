<?php

namespace SleepingOwl\Admin\Traits;

trait ElementTaggable
{
    /**
     * @var bool
     */
    protected $taggable = false;

    /**
     * @return bool
     */
    public function isTaggable()
    {
        return $this->taggable;
    }

    /**
     * @return $this
     */
    public function taggable()
    {
        $this->taggable = true;

        return $this;
    }
}
