<?php

namespace SleepingOwl\Admin\Traits;

trait CardControl
{
    /**
     * @var string|null
     */
    protected ?string $cardClass = null;

    /**
     * @return string|null
     */
    public function getCardClass(): ?string
    {
        return $this->cardClass;
    }

    /**
     * @param  string  $class
     * @return $this
     */
    public function setCardClass(string $class): self
    {
        $this->cardClass = $class;

        return $this;
    }
}
