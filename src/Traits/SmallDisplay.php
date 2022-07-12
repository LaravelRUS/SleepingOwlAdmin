<?php

namespace SleepingOwl\Admin\Traits;

use Closure;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

trait SmallDisplay
{
    /**
     * @var string|Closure|null
     */
    protected string|Closure|null $small = '';

    /**
     * @var bool
     */
    protected bool $smallString = false;

    /**
     * @var bool
     */
    protected bool $isolated = true;

    /**
     * @return string|null
     */
    public function getSmall(): ?string
    {
        if ($this->smallString) {
            return $this->small;
        }

        return $this->getValueFromObject($this->getModel(), $this->small);
    }

    /**
     * @param Closure|string $small
     * @param bool $asString
     * @return $this
     */
    public function setSmall(Closure|string $small, bool $asString = false): self
    {
        $this->small = $small;
        $this->smallString = $asString;

        return $this;
    }

    /**
     * @param bool $isolatedHTML
     * @return $this
     */
    public function setIsolated(bool $isolatedHTML): self
    {
        $this->isolated = $isolatedHTML;

        return $this;
    }

    /**
     * @return bool
     */
    public function getIsolated(): bool
    {
        return $this->isolated;
    }
}
