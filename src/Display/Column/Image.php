<?php

namespace SleepingOwl\Admin\Display\Column;

class Image extends NamedColumn
{
    /**
     * @var string
     */
    protected $imageWidth = '80px';

    /**
     * @var string
     */
    protected $width = '80px';

    /**
     * @var string
     */
    protected $asset = '';

    /**
     * @var bool
     */
    protected $lazy = null;

    /**
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var bool
     */
    protected $isSearchable = false;

    /**
     * @var string
     */
    protected $view = 'column.image';

    /**
     * @return string
     */
    public function getImageWidth()
    {
        return $this->imageWidth;
    }

    /**
     * @param  string  $width
     * @return $this
     */
    public function setImageWidth($width)
    {
        $this->imageWidth = $width;

        return $this;
    }

    /**
     * @param  string  $asset
     * @return $this
     */
    public function setAssetPrefix($asset)
    {
        $this->asset = $asset;

        return $this;
    }

    /**
     * @return bool $lazy
     */
    public function getLazyLoad()
    {
        if ($this->lazy !== null) {
            return (bool) $this->lazy;
        }

        return (bool) config('sleeping_owl.imageLazyLoad');
    }

    /**
     * @param  bool  $lazy
     * @return $this
     */
    public function setLazyLoad($lazy)
    {
        $this->lazy = $lazy;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $value = $this->getModelValue();

        if ($this->asset && $value) {
            $value = $this->asset.$value;
        }

        if (! empty($value) && (strpos($value, '://') === false)) {
            $value = asset($value);
        }

        return parent::toArray() + [
            'value' => $value,
            'lazy' => $this->getLazyLoad(),
            'imageWidth' => $this->getImageWidth(),
        ];
    }
}
