<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Display\Element;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\Placable;

class ColumnsTotal extends Extension implements Placable
{
    use HtmlAttributes;

    protected $view = 'display.extensions.columns_total';
    protected $placement = 'table.header';

    /**
     * @var Collection
     */
    protected $elements;

    public function __construct()
    {
        $this->elements = new Collection();
    }

    public function getPlacement()
    {
        return $this->placement;
    }

    public function getView()
    {
        return $this->view;
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
            'tag' => $this->getPlacement() == 'table.header' ? 'thead' : 'tfoot',
        ];
    }
}
