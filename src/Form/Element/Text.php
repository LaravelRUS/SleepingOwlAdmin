<?php

namespace SleepingOwl\Admin\Form\Element;

class Text extends NamedFormElement
{
    /**
     * @var string
     */
    protected $view = 'form.element.text';

    /**
     * @var bool
     */
    protected $dataList = false;

    /**
     * Generate text.
     *
     * @var bool
     */
    protected $canGenerate = false;
    protected $generateLength = 8;
    protected $generateChars = null;

    /**
     * @var array
     */
    protected $options = [];

    public function __construct($path, $label = null)
    {
        parent::__construct($path, $label);

        $this->setHtmlAttributes([
            'class' => 'form-control text-element',
            'type' => 'text',
        ]);
    }

    /**
     * @param array
     * @return $this
     */
    public function setOptions(array $options): Text
    {
        $this->options = $options;
        $this->dataList = true;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        $columns = [
            'canGenerate' => $this->canGenerate,
            'generateLength' => $this->generateLength,
            'generateChars' => $this->generateChars,
        ];

        if ($this->dataList) {
            $this->setHtmlAttributes([
                'list' => $this->getId().'Datalist',
            ]);

            $columns['datalistOptions'] = $this->options;
        }

        return parent::toArray() + $columns;
    }

    /**
     * Добавляет возможность генерировать текст.
     * Длина может задаваться параметром.
     *
     * @param  null  $length
     * @return $this
     */
    public function canGenerate($length = null): self
    {
        $this->canGenerate = true;

        if ($length) {
            $this->generateLength = (int) $length;
        }

        return $this;
    }

    /**
     * Подставляет юзерские символы для генерации.
     *
     * @param  string  $chars
     * @return $this
     */
    public function setCharsGenerate(string $chars): self
    {
        $this->generateChars = $chars;

        return $this;
    }
}
