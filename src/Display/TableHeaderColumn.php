<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\View\View;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;
use SleepingOwl\Admin\Traits\Renderable;

class TableHeaderColumn implements TableHeaderColumnInterface
{
    use HtmlAttributes, Renderable;

    /**
     * Header title.
     *
     * @var null|string
     */
    protected $title;

    /**
     * Is column orderable?
     *
     * @var bool
     */
    protected $orderable = false;

    /**
     * @var string|View
     */
    protected View|string $view = 'column.header';

    public function __construct()
    {
        $this->setHtmlAttribute('class', 'row-header');
    }

    /**
     * @return string|null
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param  null|string  $title
     * @return $this
     */
    public function setTitle($title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return bool
     */
    public function isOrderable(): bool
    {
        return $this->orderable;
    }

    /**
     * @param  bool  $orderable
     * @return $this
     */
    public function setOrderable(bool $orderable): self
    {
        $this->orderable = (bool) $orderable;

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray(): array
    {
        $this->setHtmlAttribute('data-orderable', $this->isOrderable() ? 'true' : 'false');

        return [
            'attributes' => $this->htmlAttributesToString(),
            'title' => $this->getTitle(),
            'isOrderable' => $this->isOrderable(),
        ];
    }
}
