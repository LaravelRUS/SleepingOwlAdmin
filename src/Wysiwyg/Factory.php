<?php

namespace SleepingOwl\Admin\Wysiwyg;

use KodiCMS\Assets\Contracts\MetaInterface;
use KodiCMS\Assets\Contracts\PackageManagerInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;

class Factory
{
    /**
     * @var PackageManagerInterface
     */
    protected $packageManager;

    /**
     * @var DummyFilter
     */
    protected $defaultFilter;

    /**
     * @var MetaInterface
     */
    protected $meta;

    /**
     * Factory constructor.
     * @param PackageManagerInterface $packageManager
     * @param DummyFilter $filter
     * @param MetaInterface $meta
     */
    public function __construct(PackageManagerInterface $packageManager, DummyFilter $filter, MetaInterface $meta)
    {
        $this->packageManager = $packageManager;
        $this->defaultFilter = $filter;
        $this->meta = $meta;
    }

    /**
     * @param string $id
     * @param string|null $name
     * @param WysiwygFilterInterface|null $filter
     * @param array $config
     * @return Editor
     */
    public function make($id, $name = null, WysiwygFilterInterface $filter = null, array $config = [])
    {
        $name = is_null($name) ? studly_case($id) : $name;
        $filter = is_null($filter) ? $this->loadDefaultFilter() : $filter;
        $package = $this->packageManager->add($id);

        return new Editor($id, $name, $filter, $package, $this->meta, $config);
    }

    /**
     * @return WysiwygFilterInterface
     */
    protected function loadDefaultFilter()
    {
        return $this->defaultFilter;
    }
}
