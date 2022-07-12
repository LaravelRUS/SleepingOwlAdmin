<?php

namespace SleepingOwl\Admin\Display\Column;

class Image extends NamedColumn
{
    /**
     * @var string
     */
    protected string $imageWidth = '80px';

    /**
     * @var string|null
     */
    protected ?string $width = '80px';

    /**
     * @var string
     */
    protected string $asset = '';

    /**
     * @var bool
     */
    protected ?bool $lazy = null;

    /**
     * @var bool
     */
    protected bool $orderable = false;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * @var string
     */
    protected string $view = 'column.image';

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
    public function getLazyLoad(): bool
    {
        if ($this->lazy !== null) {
            return (bool) $this->lazy;
        }

        return (bool) config('sleeping_owl.imageLazyLoad');
    }

    /**
     * @param bool $lazy
     * @return $this
     */
    public function setLazyLoad(bool $lazy): self
    {
        $this->lazy = $lazy;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        $value = $this->getModelValue();

        if ($this->asset && $value) {
            $value = $this->asset.$value;
        }

        if (! empty($value) && (!str_contains($value, '://'))) {
            $value = asset($value);
        }

        return parent::toArray() + [
            'value' => $value,
            'lazy' => $this->getLazyLoad(),
            'imageWidth' => $this->getImageWidth(),
        ];
    }
}
