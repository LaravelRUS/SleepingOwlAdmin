<?php

namespace SleepingOwl\Admin\Wysiwyg;

use Meta;
use Illuminate\Contracts\Support\Arrayable;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygEditorInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;

final class Editor implements WysiwygEditorInterface, Arrayable
{
    /**
     * @var string
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var WysiwygFilterInterface
     */
    private $filter;

    /**
     * @var array
     */
    private $config = [];

    /**
     * @var bool
     */
    private $used = false;

    /**
     * @param string                      $id
     * @param string|null                 $name
     * @param WysiwygFilterInterface|null $filter
     * @param array                       $config
     */
    public function __construct($id, $name = null, WysiwygFilterInterface $filter = null, array $config = [])
    {
        $this->id = $id;
        $this->name = is_null($name) ? studly_case($id) : $name;
        $this->filter = is_null($filter) ? $this->loadDefaultFilter() : $filter;
        $this->config = $config;
    }

    /**
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return WysiwygFilterInterface
     */
    public function getFilter()
    {
        return $this->filter;
    }

    /**
     * @return bool
     */
    public function isUsed()
    {
        return $this->used;
    }

    /**
     * @param string $text
     *
     * @return string
     */
    public function applyFilter($text)
    {
        return $this->getFilter()->apply($text);
    }

    public function load()
    {
        Meta::loadPackage($this->getId());

        $this->used = true;
    }

    public function unload()
    {
        $this->used = false;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'id'   => $this->getId(),
            'name' => $this->getName(),
        ];
    }

    /**
     * @return WysiwygFilterInterface
     */
    protected function loadDefaultFilter()
    {
        return app()->make(DummyFilter::class);
    }
}
