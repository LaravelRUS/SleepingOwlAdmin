<?php

namespace SleepingOwl\Admin\Form;

use URL;
use Request;
use Validator;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Repository\BaseRepository;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
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
     * @var FormElementInterface[]
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
     * @var string|null
     */
    protected $cancelButtonText;

    /**
     * @var string|null
     */
    protected $saveButtonText;

    /**
     * @var string|null
     */
    protected $saveAndCloseButtonText;

    /**
     * @var string|null
     */
    protected $saveAndCreateButtonText;

    /**
     * @var bool
     */
    protected $showCancelButton = true;

    /**
     * @var bool
     */
    protected $showSaveAndCloseButton = true;

    /**
     * @var bool
     */
    protected $showSaveAndCreateButton = true;

    /**
     * Initialize form.
     */
    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;
        $this->repository  = new BaseRepository($this->class);

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
     * @param array|FormElementInterface $items
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

        $this->getItems()->each(function ($item) {
            if ($item instanceof FormElementInterface) {
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
     * @return null|string
     */
    public function getCancelButtonText()
    {
        if (is_null($this->cancelButtonText)) {
            $this->cancelButtonText = trans('sleeping_owl::lang.table.cancel');
        }

        return $this->cancelButtonText;
    }

    /**
     * @param string $cancelButtonText
     *
     * @return $this
     */
    public function setCancelButtonText($cancelButtonText)
    {
        $this->cancelButtonText = $cancelButtonText;

        return $this;
    }

    /**
     * @return string
     */
    public function getSaveButtonText()
    {
        if (is_null($this->saveButtonText)) {
            $this->saveButtonText = trans('sleeping_owl::lang.table.save');
        }

        return $this->saveButtonText;
    }

    /**
     * @param string $saveButtonText
     *
     * @return $this
     */
    public function setSaveButtonText($saveButtonText)
    {
        $this->saveButtonText = $saveButtonText;

        return $this;
    }

    /**
     * @return string
     */
    public function getSaveAndCloseButtonText()
    {
        if (is_null($this->saveAndCloseButtonText)) {
            $this->saveAndCloseButtonText = trans('sleeping_owl::lang.table.save_and_close');
        }

        return $this->saveAndCloseButtonText;
    }

    /**
     * @param string $saveAndCloseButtonText
     *
     * @return $this
     */
    public function setSaveAndCloseButtonText($saveAndCloseButtonText)
    {
        $this->saveAndCloseButtonText = $saveAndCloseButtonText;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getSaveAndCreateButtonText()
    {
        if (is_null($this->saveAndCreateButtonText)) {
            $this->saveAndCreateButtonText = trans('sleeping_owl::lang.table.save_and_create');
        }

        return $this->saveAndCreateButtonText;
    }

    /**
     * @param null|string $saveAndCreateButtonText
     *
     * @return $this
     */
    public function setSaveAndCreateButtonText($saveAndCreateButtonText)
    {
        $this->saveAndCreateButtonText = $saveAndCreateButtonText;

        return $this;
    }

    /**
     * @return boolean
     */
    public function isShowCancelButton()
    {
        return $this->showCancelButton;
    }

    /**
     * @return $this
     */
    public function hideCancelButton()
    {
        $this->showCancelButton = false;

        return $this;
    }

    /**
     * @return boolean
     */
    public function isShowSaveAndCloseButton()
    {
        return $this->showSaveAndCloseButton;
    }

    /**
     * @return $this
     */
    public function hideSaveAndCloseButton()
    {
        $this->showSaveAndCloseButton = false;

        return $this;
    }


    /**
     * @return boolean
     */
    public function isShowSaveAndCreateButton()
    {
        return $this->showSaveAndCreateButton;
    }

    /**
     * @return $this
     */
    public function hideSaveAndCreateButton()
    {
        $this->showSaveAndCreateButton = false;

        return $this;
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

        $this->getItems()->each(function ($item) {
            if ($item instanceof FormElementInterface) {
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
        $messages = [];

        $this->getItems()->each(function ($item) use (&$rules, &$messages) {
            if ($item instanceof FormElementInterface) {
                $rules += $item->getValidationRules();
                $messages += $item->getValidationMessages();
            }
        });

        $data     = Request::all();

        $verifier = app('validation.presence');
        $verifier->setConnection($this->getModelObject()->getConnectionName());

        $validator = Validator::make($data, $rules, $messages);
        $validator->setPresenceVerifier($verifier);

        if ($validator->fails()) {
            return $validator;
        }

        return;
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
            'action'   => $this->getAction(),
            'buttons'  => app('sleeping_owl.template')->view('form.buttons', [
                'backUrl'                => $this->getModel()->getDisplayUrl(),
                'saveButtonText'         => $this->getSaveButtonText(),
                'saveAndCloseButtonText' => $this->getSaveAndCloseButtonText(),
                'saveAndCreateButtonText' => $this->getSaveAndCreateButtonText(),
                'cancelButtonText'       => $this->getCancelButtonText(),
                'showCancelButton'       => $this->isShowCancelButton(),
                'showSaveAndCloseButton' => $this->isShowSaveAndCloseButton(),
                'showSaveAndCreateButton' => $this->isShowSaveAndCreateButton()
            ])
        ];
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
        return (string)$this->render();
    }

    protected function initializeItems()
    {
        $this->getItems()->each(function ($item) {
            if ($item instanceof FormElementInterface) {
                $item->initialize();
            }
        });
    }
}
