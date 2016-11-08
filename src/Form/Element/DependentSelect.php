<?php

namespace SleepingOwl\Admin\Form\Element;

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
