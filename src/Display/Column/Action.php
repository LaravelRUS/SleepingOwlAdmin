<?php

namespace SleepingOwl\Admin\Display\Column;

use Closure;
use SleepingOwl\Admin\Contracts\Display\Extension\ActionInterface;

class Action extends NamedColumn implements ActionInterface
{
    /**
     * Action icon class.
     *
     * @var string|null
     */
    protected ?string $icon = null;

    /**
     * @var string
     */
    protected string $style = 'long';

    /**
     * @var string
     */
    protected string $action;

    /**
     * @var string
     */
    protected string $method = 'post';

    /**
     * @var string
     */
    protected string $title;

    /**
     * @var string
     */
    protected string $view = 'column.action';

    /**
     * @var bool
     */
    protected bool $orderable = false;

    /**
     * @var bool
     */
    protected bool $isSearchable = false;

    /**
     * @var bool
     */
    protected bool $selected = false;

    /**
     * Action constructor.
     *
     * @param  Closure|null|string  $name
     * @param  string|null  $title
     */
    public function __construct($name, $title = null)
    {
        parent::__construct($name);

        $this->setTitle($title);
    }

    public function initialize()
    {
        $this->setHtmlAttributes([
            'class' => 'btn btn-action btn-default',
            'name' => 'action',
            'value' => $this->getName(),
            'data-action' => $this->getAction(),
            'data-method' => $this->getMethod(),
        ]);
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param  string  $title
     * @return $this
     */
    public function setTitle(string $title): Action
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return bool
     */
    public function getSelected(): bool
    {
        return $this->selected;
    }

    /**
     * @param  bool  $selected
     * @return $this
     */
    public function setSelected(bool $selected): Action
    {
        $this->selected = $selected;

        return $this;
    }

    /**
     * @return string
     */
    public function getAction(): string
    {
        return $this->action;
    }

    /**
     * @param  string  $action
     * @return $this
     */
    public function setAction(string $action): Action
    {
        $this->action = $action;

        return $this;
    }

    /**
     * @return string
     */
    public function getMethod(): string
    {
        return $this->method;
    }

    /**
     * @param  string  $method
     * @return $this
     */
    public function setMethod(string $method): Action
    {
        $this->method = $method;

        return $this;
    }

    /**
     * @return $this
     */
    public function useGet(): Action
    {
        $this->method = 'get';

        return $this;
    }

    /**
     * @return $this
     */
    public function usePost(): Action
    {
        $this->method = 'post';

        return $this;
    }

    /**
     * @return $this
     */
    public function usePut(): Action
    {
        $this->method = 'put';

        return $this;
    }

    /**
     * @return $this
     */
    public function useDelete(): Action
    {
        $this->method = 'delete';

        return $this;
    }

    /**
     * @return string|null
     */
    public function getIcon(): ?string
    {
        return $this->icon;
    }

    /**
     * @param  string|null  $icon
     * @return $this
     */
    public function setIcon(?string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return parent::toArray() + [
            'icon' => $this->getIcon(),
            'action' => $this->getAction(),
            'method' => $this->getMethod(),
            'title' => $this->getTitle(),
            'selected' => $this->getSelected(),
        ];
    }
}
