<?php
namespace SleepingOwl\Admin\Structures;

use Illuminate\Support\Collection;
use Serafim\Properties\Getters;

/**
 * @property-read string $name
 * @property-read Collection $js
 * @property-read Collection $css
 * @property-read Collection $with
 */
class AssetPackage
{
    use Getters;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var Collection
     */
    protected $js;

    /**
     * @var Collection
     */
    protected $css;

    /**
     * @var Collection
     */
    protected $with;

    /**
     * AssetPackage constructor.
     * @param string $name
     */
    public function __construct($name)
    {
        $this->name = $name;
        $this->js = new Collection();
        $this->css = new Collection();
        $this->with = new Collection();
    }
}