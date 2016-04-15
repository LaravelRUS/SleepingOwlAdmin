<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Contracts\FormElementInterface;

class FormPanel extends FormDefault
{
    const POSITION_HEADER = 'header';
    const POSITION_BODY = 'body';
    const POSITION_FOOTER = 'footer';

    const SEPARATOR = '<hr class="panel-wide" />';

    /**
     * @var string
     */
    protected $view = 'panel';

    public function __construct()
    {
        parent::__construct();

        $this->items = [
            static::POSITION_HEADER => [],
            static::POSITION_BODY => [],
            static::POSITION_FOOTER => [],
        ];
    }

    /**
     * Initialize form.
     */
    public function initialize()
    {
        $this->getButtons()->setHtmlAttribute('class', 'panel-footer');

        $this->setHtmlAttribute('class', 'panel panel-default');

        parent::initialize();
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function setItems($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->placeItemsTo(static::POSITION_BODY, $items);

        return $this;
    }

    /**
     * @param FormElementInterface $item
     *
     * @return $this
     */
    public function addItem(FormElementInterface $item)
    {
        $this->items[static::POSITION_BODY][] = $item;

        return $this;
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function addHeader($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->placeItemsTo(static::POSITION_HEADER, $items);

        return $this;
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function addBody($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->placeItemsTo(static::POSITION_BODY, $items);

        return $this;
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function addFooter($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->placeItemsTo(static::POSITION_FOOTER, $items);

        return $this;
    }

    /**
     * @param       $place
     * @param array $items
     */
    protected function placeItemsTo($place, array $items)
    {
        if (! isset($this->items[$place])) {
            return;
        }

        if (count($this->items[$place]) > 0) {
            $this->items[$place][] = static::SEPARATOR;
        }

        foreach ($items as $item) {
            $this->items[$place][] = $item;
        }
    }
}
