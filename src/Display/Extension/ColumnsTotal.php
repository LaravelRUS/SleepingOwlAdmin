<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Display\Element;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Traits\ElementViewTrait;
use SleepingOwl\Admin\Contracts\Display\Placable;
use SleepingOwl\Admin\Traits\ElementPlacementTrait;

class ColumnsTotal extends Extension implements Placable
{
    use HtmlAttributes, ElementPlacementTrait, ElementViewTrait;

    /**
     * @var string|\Illuminate\View\View
     */
    protected $view = 'display.extensions.columns_total';

    /**
     * @var string
     */
    protected $placement = 'table.header';

    /**
     * @var string
     */
    protected $tag = 'thead';

    /**
     * @var Collection
     */
    protected $elements;

    public function __construct()
    {
        $this->elements = new Collection();
    }

    public function set(array $elements, $columnsNumber = 0)
    {
        array_map(function ($element) {
            if (! is_object($element)) {
                $element = Element::create($element);
            }
            $this->elements->push($element);
        },
            array_pad($elements, max($columnsNumber, count($elements)), '')
        );

        return $this;
    }

    public function toArray()
    {
        $this->setHtmlAttribute('class', 'table table-striped');

        return [
            'elements' => $this->elements,
            'attributes' => $this->htmlAttributesToString(),
            'tag' => $this->getTag(),
        ];
    }
}
