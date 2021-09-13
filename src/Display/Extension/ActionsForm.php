<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\Extension\ActionInterface;
use SleepingOwl\Admin\Contracts\Display\Placable;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Form\FormElement;

class ActionsForm extends Extension implements Initializable, Placable
{
    use HtmlAttributes;

    /**
     * @var ActionInterface[]|Collection
     */
    protected $action_form;

    /**
     * @var string|\Illuminate\View\View
     */
    protected $view = 'display.extensions.actions_form';

    /**
     * @var string
     */
    protected $placement = 'card.heading.actions';

    public function __construct()
    {
        $this->clear();
    }

    /**
     * @return $this
     */
    public function clear()
    {
        $this->action_form = new Collection();

        return $this;
    }

    /**
     * @param  Collection|array  $actions
     * @return \SleepingOwl\Admin\Contracts\Display\DisplayInterface
     */
    public function set($action_form)
    {
        if (! is_array($action_form)) {
            $action_form = func_get_args();
        }

        $this->clear();

        foreach ($action_form as $action) {
            $this->push($action);
        }

        return $this->getDisplay();
    }

    /**
     * @return ActionInterface[]|Collection
     */
    public function all()
    {
        return $this->action_form;
    }

    /**
     * @param  FormElement  $action
     * @return $this
     */
    public function push(FormElement $action)
    {
        $this->action_form->push($action);

        return $this;
    }

    /**
     * @return string|\Illuminate\View\View
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param  string|\Illuminate\View\View  $view
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

        return $this;
    }

    /**
     * @return string
     */
    public function getPlacement()
    {
        return $this->placement;
    }

    /**
     * @param  string  $placement
     * @return $this
     */
    public function setPlacement($placement)
    {
        $this->placement = $placement;

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        $this->all()->each(function ($action) {
            $action->initialize();
        });

        return [
            'action_form' => $this->action_form,
            'placement' => $this->getPlacement(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        if ($this->all()->count() < 1) {
            return;
        }

        $this->all()->each(function ($action) {
            $action->initialize();
        });

        $this->setHtmlAttribute('class', 'display-actions-form-wrapper');
    }
}
