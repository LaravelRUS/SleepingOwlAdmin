<?php

namespace SleepingOwl\Admin\Form;

use KodiComponents\Support\HtmlAttributes;
use Request;
use SleepingOwl\Admin\Contracts\ColumnInterface;
use Validator;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;

class FormDefault implements DisplayInterface, FormInterface
{
    use HtmlAttributes;

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
     * @var FormButtons
     */
    protected $buttons;

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

    public function __construct()
    {
        $this->setButtons(
            app(FormButtonsInterface::class)
        );
    }

    /**
     * Initialize form.
     */
    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;
        $this->repository = app(RepositoryInterface::class, [$this->class]);

        $this->setModel(app($this->class));
        $this->initializeItems();

        $this->setHtmlAttribute('action', $this->getAction());
        $this->setHtmlAttribute('method', 'POST');

        $this->getButtons()->setModelConfiguration(
            $this->getModelConfiguration()
        );
    }

    /**
     * @return FormButtons
     */
    public function getButtons()
    {
        return $this->buttons;
    }

    /**
     * @param FormButtonsInterface $buttons
     *
     * @return $this
     */
    public function setButtons(FormButtonsInterface $buttons)
    {
        $this->buttons = $buttons;

        return $this;
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
    public function setModelClass($class)
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

            if ($item instanceof ColumnInterface) {
                $item->setModel($this->getModel());
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

        array_walk_recursive($items, function ($item) {
            if ($item instanceof FormElementInterface) {
                $item->afterSave();
            }
        });
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

        $rules = [];
        $messages = [];
        $titles = [];

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
        return [
            'items' => $this->getItems(),
            'instance' => $this->getModel(),
            'attributes' => $this->htmlAttributesToString(),
            'buttons' => $this->getButtons(),
            'backUrl' => session('_redirectBack', url()->previous()),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('form.'.$this->getView(), $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }

    protected function initializeItems()
    {
        $items = $this->getItems();

        array_walk_recursive($items, function ($item) {
            if ($item instanceof Initializable) {
                $item->initialize();
            }
        });
    }
}
