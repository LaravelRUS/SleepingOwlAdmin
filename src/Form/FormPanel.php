<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Form\Panel\Body;
use SleepingOwl\Admin\Form\Element\Html;
use SleepingOwl\Admin\Form\Panel\Footer;
use SleepingOwl\Admin\Form\Panel\Header;
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
    protected $view = 'form.panel';

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

        $this->addBody($items);

        return $this;
    }

    /**
     * @param FormElementInterface $item
     *
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
     * @param array|FormElementInterface $items
     *
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
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function addBody($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        if (get_class($this->getElements()->last()) === Body::class) {
            $this->addElement(new Html('<hr />'));
        }

        $this->addElement(new Body($items));

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

        $this->addElement(new Footer($items));

        return $this;
    }
}
