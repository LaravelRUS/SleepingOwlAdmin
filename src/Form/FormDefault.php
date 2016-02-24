<?php

namespace SleepingOwl\Admin\Form;

use URL;
use Request;
use Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Repository\BaseRepository;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use Illuminate\Database\Eloquent\Relations\HasOne;
use SleepingOwl\Admin\Form\Element\NamedFormElement;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
    protected $model;

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

        $this->setModel(app($this->class));
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

        $this->items = $items;

        return $this;
    }

    /**
     * @param FormElementInterface $item
     *
     * @return $this
     */
    public function addItem(FormElementInterface $item)
    {
        $this->items[] = $item;

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
     * Set currently loaded model id.
     *
     * @param int $id
     */
    public function setId($id)
    {
        if (is_null($this->id)) {
            $this->id = $id;
            $this->setModel($this->getRepository()->find($id));
        }
    }

    /**
     * Get related form model configuration.
     * @return ModelConfiguration
     */
    public function getModelConfiguration()
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
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;

        $items = $this->getItems();

        array_walk_recursive($items, function ($item) {
            if ($item instanceof FormElementInterface) {
                $item->setModel($this->model);
            }
        });

        return $this;
    }

    /**
     * Save instance.
     *
     * @param $model
     */
    public function save(ModelConfiguration $model)
    {
        if ($this->getModelConfiguration() != $model) {
            return;
        }

        $items = $this->getItems();

        array_walk_recursive($items, function ($item) {
            if ($item instanceof FormElementInterface) {
                $item->save();
            }
        });

        $this->saveBelongsToRelations();

        $this->getModel()->save();

        $this->saveHasOneRelations();
    }

    protected function saveBelongsToRelations()
    {
        $model = $this->getModel();

        foreach ($model->getRelations() as $name => $relation) {
            if ($model->{$name}() instanceof BelongsTo) {
                $relation->save();
                $model->{$name}()->associate($relation);
            }
        }
    }

    protected function saveHasOneRelations()
    {
        $model = $this->getModel();

        foreach ($model->getRelations() as $name => $relation) {
            if ($model->{$name}() instanceof HasOneOrMany) {
                if (is_array($relation)) {
                    $model->{$name}()->saveMany($relation);
                } else {
                    $model->{$name}()->save($relation);
                }
            }
        }
    }

    /**
     * @param ModelConfiguration $model
     *
     * @return \Illuminate\Contracts\Validation\Validator|null
     */
    public function validate(ModelConfiguration $model)
    {
        if ($this->getModelConfiguration() != $model) {
            return;
        }

        $rules    = [];
        $messages = [];
        $titles   = [];

        $items = $this->getItems();

        array_walk_recursive($items, function ($item) use (&$rules, &$messages, &$titles) {
            if ($item instanceof FormElementInterface) {
                $rules += $item->getValidationRules();
                $messages += $item->getValidationMessages();
                $titles += $item->getValidationLabels();
            }
        });

        $data = Request::all();

        $verifier = app('validation.presence');
        $verifier->setConnection($this->getModel()->getConnectionName());

        $validator = Validator::make($data, $rules, $messages, $titles);
        $validator->setPresenceVerifier($verifier);

        if ($validator->fails()) {
            return $validator;
        }

        return true;
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
            'instance' => $this->getModel(),
            'action'   => $this->getAction(),
            'buttons'  => app('sleeping_owl.template')->view('form.buttons', [
                'backUrl'                 => $this->getModelConfiguration()->getDisplayUrl(),
                'saveButtonText'          => $this->getSaveButtonText(),
                'saveAndCloseButtonText'  => $this->getSaveAndCloseButtonText(),
                'saveAndCreateButtonText' => $this->getSaveAndCreateButtonText(),
                'cancelButtonText'        => $this->getCancelButtonText(),
                'showCancelButton'        => $this->isShowCancelButton(),
                'showSaveAndCloseButton'  => $this->isShowSaveAndCloseButton(),
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
        $items = $this->getItems();

        array_walk_recursive($items, function ($item) {
            if ($item instanceof FormElementInterface) {
                $item->initialize();
            }
        });
    }
}
