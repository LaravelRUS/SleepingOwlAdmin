<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Support\Collection;
use Illuminate\View\View;
use SleepingOwl\Admin\Contracts\Display\Placable;
use SleepingOwl\Admin\Display\Element;
use SleepingOwl\Admin\Support\HtmlAttributes;
use SleepingOwl\Admin\Traits\ElementPlacementTrait;
use SleepingOwl\Admin\Traits\ElementViewTrait;

class ColumnsTotal extends Extension implements Placable
{
    use HtmlAttributes, ElementPlacementTrait, ElementViewTrait;

    /**
     * @var string|View
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

    public function toArray(): array
    {
        $elements = $this->elements;
        $display = $this->getDisplay();
        if ($display instanceof \SleepingOwl\Admin\Display\DisplayTable
            && ! $display instanceof \SleepingOwl\Admin\Display\DisplayDatatables) {
            $elements = $elements->filter(function ($element, $index) use ($display) {
                $column = $display->getColumns()->all()->get($index);

                return $column === null || $column->isVisible();
            });
        }

        return [
            'elements' => $elements,
            'attributes' => $this->htmlAttributesToString(),
            'attributesArray' => $this->getHtmlAttributes(),
            'tag' => $this->getTag(),
        ];
    }
}
