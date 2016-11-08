<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\Form\Element\SelectException;

class DependentSelect extends Select
{
    /**
     * @var string
     */
    protected $dataUrl = '';

    /**
     * @var array
     */
    protected $dataDepends = [];

    /**
     * @return string
     */
    public function getDataUrl()
    {
        return $this->dataUrl;
    }

    /**
     * @return string
     */
    public function getDataDepends()
    {
        return json_encode($this->dataDepends);
    }

    /**
     * @param array $depends
     *
     * @return $this
     */
    public function setDataDepends($depends)
    {
        $this->dataDepends = $depends;

        return $this;
    }

    /**
     * @param string $dataUrl
     *
     * @return $this
     */
    public function setDataUrl($dataUrl)
    {
        $this->dataUrl = $dataUrl;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'class' => 'form-control input-select depdrop',
            'data-url' =>  $this->getDataUrl(),
            'data-depends' =>  $this->getDataDepends(),
        ];
    }
}
