<?php

namespace SleepingOwl\Admin\Wysiwyg;

use Illuminate\Config\Repository;
use Illuminate\Support\Str;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygEditorInterface;
use SleepingOwl\Admin\Contracts\Wysiwyg\WysiwygFilterInterface;

final class Editor implements WysiwygEditorInterface
{
    /**
     * @var string
     */
    private string $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var WysiwygFilterInterface
     */
    private $filter;

    /**
     * @var Repository
     */
    private $config;

    /**
     * @var bool
     */
    private $used = false;

    /**
     * @var Package
     */
    private $package;

    /**
     * @param  string  $id
     * @param  string|null  $name
     * @param  WysiwygFilterInterface|null  $filter
     * @param  array  $config
     */
    public function __construct($id, $name = null, WysiwygFilterInterface $filter = null, array $config = [])
    {
        $this->id = $id;
        $this->name = is_null($name) ? Str::studly($id) : $name;
        $this->filter = is_null($filter) ? $this->loadDefaultFilter() : $filter;
        $this->config = new Repository($config);

        $this->package = app('assets.packages')->add($id);
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return WysiwygFilterInterface
     */
    public function getFilter(): WysiwygFilterInterface
    {
        return $this->filter;
    }

    /**
     * @return Package
     */
    public function getPackage()
    {
        return $this->package;
    }

    /**
     * @return Repository
     */
    public function getConfig(): Repository
    {
        return $this->config;
    }

    /**
     * @return bool
     */
    public function isUsed(): bool
    {
        return $this->used;
    }

    /**
     * @param  string  $text
     * @return string
     */
    public function applyFilter(string $text): string
    {
        return $this->getFilter()->apply($text);
    }

    /**
     * @return bool
     */
    public function load(): bool
    {
        $load = app('sleeping_owl.meta')->loadPackage($this->getId());

        $this->used = true;

        return true;
    }

    public function unload(): bool
    {
        $this->used = false;

        return false;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
        ];
    }

    public function __call($method, $arguments)
    {
        if (in_array($method, ['js', 'css'])) {
            call_user_func_array([$this->getPackage(), $method], $arguments);

            return $this;
        }

        throw new \BadMethodCallException("Call to undefined method [{$method}]");
    }

    /**
     * @return WysiwygFilterInterface
     */
    protected function loadDefaultFilter()
    {
        return app()->make(DummyFilter::class);
    }
}
