<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Contracts\Form\FormElementInterface;
use SleepingOwl\Admin\Form\Card\Body;
use SleepingOwl\Admin\Form\Card\Footer;
use SleepingOwl\Admin\Form\Card\Header;
use SleepingOwl\Admin\Form\Element\Html;
use SleepingOwl\Admin\Traits\CardControl;

class FormCard extends FormDefault
{
    use CardControl;

    const POSITION_HEADER = 'header';
    const POSITION_BODY = 'body';
    const POSITION_FOOTER = 'footer';

    const SEPARATOR = '';

    /**
     * @var string
     */
    protected $view = 'form.card';

    /**
     * FormCard constructor.
     *
     * @param  array  $elements
     */
    public function __construct(array $elements = [])
    {
        parent::__construct($elements);

        $this->setCardClass('card');
    }

    /**
     * Initialize form.
     */
    public function initialize()
    {
        $this->getButtons()->setHtmlAttribute('class', 'card-footer');

        $this->setHtmlAttribute('class', 'card '.$this->getCardClass());

        parent::initialize();
    }

    /**
     * @param  array|FormElementInterface  $items
     * @return $this
     */
    public function setItems($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->addBody($items);

        return $this;
    }

    /**
     * @param  FormElementInterface  $item
     * @return $this
     */
    public function addItem($item)
    {
        if ($part = $this->getElements()->last()) {
            $part->addElement($item);
        } else {
            $this->addBody($item);
        }

        return $this;
    }

    /**
     * @param  array|FormElementInterface  $items
     * @return $this
     */
    public function addHeader($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->addElement(new Header($items));

        return $this;
    }

    /**
     * @param  array|FormElementInterface  $items
     * @return $this
     */
    public function addBody($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $class = $this->getElements()->last();
        if (is_object($class) && get_class($class) === Body::class) {
            $this->addElement(new Html('<hr />'));
        }

        $this->addElement(new Body($items));

        return $this;
    }

    /**
     * @param  array|FormElementInterface  $items
     * @return $this
     */
    public function addFooter($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->addElement(new Footer($items));

        return $this;
    }
}
