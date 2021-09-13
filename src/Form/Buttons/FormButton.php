<?php

namespace SleepingOwl\Admin\Form\Buttons;

use Illuminate\Database\Eloquent\Model;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Traits\Renderable;

class FormButton implements FormButtonsInterface, Initializable
{
    use HtmlAttributes, Renderable;
    /**
     * @var string
     */
    protected $view = 'form.button';

    /**
     * @var
     */
    protected $iconClass;

    /**
     * @var Model
     */
    protected $model;
    /**
     * @var
     */
    protected $name;

    /**
     * Show button.
     */
    protected $show = true;

    /**
     * This is URL.
     */
    protected $url;

    /**
     * @var
     */
    protected $text;

    /**
     * @var
     */
    protected $next_action;

    /**
     * @var
     */
    protected $groupElements;

    /**
     * @var ModelConfigurationInterface
     */
    protected $modelConfiguration;

    public function initialize()
    {
        $this->canShow();
    }

    public function canShow()
    {
        return $this->show;
    }

    /**
     * @return mixed
     */
    public function getIconClass()
    {
        return $this->iconClass;
    }

    /**
     * @param $iconClass
     * @return $this
     */
    public function setIconClass($iconClass)
    {
        $this->iconClass = $iconClass;

        return $this;
    }

    /**
     * @param  ModelConfigurationInterface  $modelConfiguration
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $modelConfiguration)
    {
        $this->modelConfiguration = $modelConfiguration;

        return $this;
    }

    /**
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        return $this->modelConfiguration;
    }

    /**
     * @param $text
     * @return $this
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * @return $this
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * @param $next_action
     * @return $this
     */
    public function setNextAction($next_action)
    {
        $this->next_action = $next_action;

        return $this;
    }

    /**
     * @return $this
     */
    public function getNextAction()
    {
        return $this->text;
    }

    /**
     * Show button.
     */
    public function show()
    {
        $this->show = true;
    }

    /**
     * Hide button.
     */
    public function hide()
    {
        $this->show = false;
    }

    /**
     * @param $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param $url
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @return mixed
     */
    public function getGroupElements()
    {
        return $this->groupElements;
    }

    /**
     * @param  array  $elements
     * @return $this
     */
    public function setGroupElements(array $elements)
    {
        $this->groupElements = $elements;

        return $this;
    }

    /**
     * @param $name
     * @param $element
     * @return $this
     */
    public function setGroupElement($name, $element)
    {
        $this->groupElements[$name] = $element;

        return $this;
    }

    /**
     * @return Model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param  Model  $model
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;

        return $this;
    }

    public function getShow()
    {
        return $this->show;
    }

    public function toArray()
    {
        return [
            'attributes' => $this->htmlAttributesToString(),
            'groupElements' => $this->getGroupElements(),
            'text' => $this->getText(),
            'name' => $this->getName(),
            'show' => $this->getShow(),
            'iconClass' => $this->getIconClass(),
            'url' => $this->getUrl(),
        ];
    }

    /**
     * @return bool
     */
    protected function isTrashed()
    {
        return method_exists($this->getModel(), 'trashed') ? $this->getModel()->trashed() : false;
    }
}
