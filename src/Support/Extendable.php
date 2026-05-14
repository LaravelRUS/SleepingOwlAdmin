<?php

namespace SleepingOwl\Admin\Support;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Support\Contracts\ExtensionInterface;

trait Extendable
{
    /**
     * @var ExtensionInterface[]|Collection
     */
    protected $extensions;

    /**
     * @param  string  $name
     * @param  ExtensionInterface  $extension
     * @return ExtensionInterface
     */
    public function extend($name, ExtensionInterface $extension)
    {
        $this->getExtensions()->put($name, $extension);

        $extension->set($this);

        return $extension;
    }

    /**
     * @return Collection|ExtensionInterface[]
     */
    public function getExtensions()
    {
        if (is_null($this->extensions)) {
            $this->extensions = new Collection();
        }

        return $this->extensions;
    }
}
