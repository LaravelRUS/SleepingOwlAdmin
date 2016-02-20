<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Support\Collection;
use URL;
use Input;
use Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Repository\BaseRepository;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormItemInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;

class FormDefault implements Renderable, DisplayInterface, FormInterface
{
    /**
     * View to render.
     * @var string
     */
    protected $view = 'default';

    /**
     * Form related class.
     * @var string
     */
    protected $class;

    /**
     * Form related repository.
     * @var RepositoryInterface
     */
    protected $repository;

    /**
     * Form items.
     * @var FormItemInterface[]
     */
    protected $items = [];

    /**
     * Form action url.
     * @var string
     */
    protected $action;

    /**
     * Form related model instance.
     * @var Model
     */
    protected $modelObject;

    /**
     * Currently loaded model id.
     * @var int
     */
    protected $id;

    /**
     * Is form already initialized?
     * @var bool
     */
    protected $initialized = false;

    /**
     * Initialize form.
     */
    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;
        $this->repository = new BaseRepository($this->class);

        $this->setModelObject(app($this->class));
        $this->initializeItems();
    }

    /**
     * @return RepositoryInterface
     */
    public function getRepository()
    {
        return $this->repository;
    }

    /**
     * @return string
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @return string
     */
    public function getAction()
    {
        return $this->action;
    }

    /**
     * @param string $action
     *
     * @return $this
     */
    public function setAction($action)
    {
        if (is_null($this->action)) {
            $this->action = $action;
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @param string $class
     *
     * @return $this
     */
    public function setClass($class)
    {
        if (is_null($this->class)) {
            $this->class = $class;
        }

        return $this;
    }

    /**
     * @return Collection[]
     */
    public function getItems()
    {
        return $this->items;
    }

    /**
     * @param array|FormItemInterface $items
     *
     * @return $this
     */
    public function setItems($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->items = collect($items);

        return $this;
    }

    /**
     * @return Model
     */
    public function getModelObject()
    {
        return $this->modelObject;
    }

    /**
     * @param Model $modelObject
     *
     * @return $this
     */
    public function setModelObject(Model $modelObject)
    {
        $this->modelObject = $modelObject;

        $this->getItems()->each(function($item) {
            if ($item instanceof FormItemInterface) {
                $item->setModel($this->modelObject);
            }
        });

        return $this;
    }

    /**
     * Set currently loaded model id.
     *
     * @param int $id
     */
    public function setId($id)
    {
        if (is_null($this->id)) {
            $this->id = $id;
            $this->setModelObject($this->getRepository()->find($id));
        }
    }

    /**
     * Get related form model configuration.
     * @return ModelConfiguration
     */
    public function getModel()
    {
        return app('sleeping_owl')->getModel($this->class);
    }

    /**
     * Save instance.
     *
     * @param $model
     */
    public function save(ModelConfiguration $model)
    {
        if ($this->getModel() != $model) {
            return;
        }

        $this->getItems()->each(function($item) {
            if ($item instanceof FormItemInterface) {
                $item->save();
            }
        });

        $this->getModelObject()->save();
    }

    /**
     * @param ModelConfiguration $model
     *
     * @return \Illuminate\Contracts\Validation\Validator|null
     */
    public function validate(ModelConfiguration $model)
    {
        if ($this->getModel() != $model) {
            return;
        }

        $rules = [];

        $this->getItems()->each(function($item) use (&$rules) {
            if ($item instanceof FormItemInterface) {
                $rules += $item->getValidationRules();
            }
        });

        $data = Input::all();
        $verifier = app('validation.presence');
        $verifier->setConnection($this->getModelObject()->getConnectionName());
        $validator = Validator::make($data, $rules);
        $validator->setPresenceVerifier($verifier);

        if ($validator->fails()) {
            return $validator;
        }

        return;
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('form.'.$this->getView(), $this->getParams());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return $this->getParams();
    }

    /**
     * @return array
     */
    public function getParams()
    {
        return [
            'items'    => $this->getItems(),
            'instance' => $this->getModelObject(),
            'action'   => $this->action,
            'backUrl'  => session('_redirectBack', URL::previous()),
        ];
    }

    protected function initializeItems()
    {
        $items = $this->getItems();

        $this->getItems()->each(function($item) {
            if ($item instanceof FormItemInterface) {
                $item->initialize();
            }
        });
    }
}
