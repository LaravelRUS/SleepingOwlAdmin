<?php

namespace SleepingOwl\Admin\Display\Column;

class Gravatar extends NamedColumn
{
    /**
     * @var string
     */
    protected $size = '40';

    /** @var string */
    protected $rating = 'pg';

    /**
     * @var string
     */
    protected $width = '50px';

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
    protected $view = 'column.gravatar';

    /**
     * @return string
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * @param  string  $size
     * @return $this
     */
    public function setSize($size)
    {
        $this->size = $size;

        return $this;
    }

    /**
     * @return string
     */
    public function getRating()
    {
        return $this->rating;
    }

    /**
     * @param  string  $rating
     * @return $this
     */
    public function setRating($rating)
    {
        $this->rating = $rating;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $value = $this->getModelValue();
        if (! empty($value)) {
            $value = md5(strtolower(trim($value))).'?';
        } else {
            $value = '205e460b479e2e5b48aec07710c08d50?f=y';
        }

        return parent::toArray() + [
            'value' => sprintf('https://www.gravatar.com/avatar/%s&size=%s&rating=%s', $value, $this->size, $this->rating),
        ];
    }
}
