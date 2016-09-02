<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use Request;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Form\Element\Upload;
use Validator;

class FormDefault extends FormElements implements DisplayInterface, FormInterface
{
    use HtmlAttributes;

    /**
     * View to render.
     * @var string|\Illuminate\View\View
     */
    protected $view = 'form.default';

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
     * FormDefault constructor.
     *
     * @param array $elements
     */
    public function __construct(array $elements = [])
    {
        parent::__construct($elements);

        $this->setButtons(
            app(FormButtonsInterface::class)
        );

        $this->initializePackage();
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

        parent::initialize();

        $this->getElements()->each(function ($element) {
            if ($element instanceof Upload and ! $this->hasHtmlAttribute('enctype')) {
                $this->setHtmlAttribute('enctype', 'multipart/form-data');
            }
        });

        $this->setHtmlAttribute('method', 'POST');

        $this->getButtons()->setModelConfiguration(
            $this->getModelConfiguration()
        );

        $this->includePackage();
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
     * @return string|\Illuminate\View\View
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param \Illuminate\View\View|string $view
     *
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

        $this->setHtmlAttribute('action', $this->action);

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
     * @deprecated 4.5.0
     * @see getElements()
     *
     * @return Collection[]
     */
    public function getItems()
    {
        return $this->getElements();
    }

    /**
     * @deprecated 4.5.0
     * @see setElements()
     *
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function setItems($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        return $this->setElements($items);
    }

    /**
     * @deprecated 4.5.0
     * @see addElement()
     *
     * @param FormElementInterface $item
     *
     * @return $this
     */
    public function addItem($item)
    {
        return $this->addElement($item);
    }

    /**
     * Set currently loaded model id.
     *
     * @param int $id
     */
    public function setId($id)
    {
        if (is_null($this->id) and ! is_null($id) and ($model = $this->getRepository()->find($id))) {
            $this->id = $id;
            $this->setModel($model);
        }
    }

    /**
     * Get related form model configuration.
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        return app('sleeping_owl')->getModel($this->class);
    }

    /**
     * @return Model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;

        parent::setModel($model);

        $this->getButtons()->setModel($this->getModel());

        return $this;
    }

    /**
     * Save instance.
     *
     * @param ModelConfigurationInterface $modelConfiguration
     *
     * @return bool
     */
    public function saveForm(ModelConfigurationInterface $modelConfiguration)
    {
        if ($modelConfiguration !== $this->getModelConfiguration()) {
            return;
        }

        parent::save();

        $this->saveBelongsToRelations();

        $loaded = $this->getModel()->exists;

        if ($modelConfiguration->fireEvent($loaded ? 'updating' : 'creating', true, $this->getModel()) === false) {
            return false;
        }

        if ($modelConfiguration->fireEvent('saving', true, $this->getModel()) === false) {
            return false;
        }


        $this->getModel()->save();

        $this->saveHasOneRelations();

        parent::afterSave();

        $modelConfiguration->fireEvent($loaded ? 'updated' : 'created', false, $this->getModel());
        $modelConfiguration->fireEvent('saved', false, $this->getModel());

        return true;
    }

    protected function saveBelongsToRelations()
    {
        $model = $this->getModel();

        foreach ($model->getRelations() as $name => $relation) {
            if ($model->{$name}() instanceof BelongsTo && ! is_null($relation)) {
                $relation->save();
                $model->{$name}()->associate($relation);
            }
        }
    }

    protected function saveHasOneRelations()
    {
        $model = $this->getModel();

        foreach ($model->getRelations() as $name => $relation) {
            if ($model->{$name}() instanceof HasOneOrMany && ! is_null($relation)) {
                if (is_array($relation) || $relation instanceof \Traversable) {
                    $model->{$name}()->saveMany($relation);
                } else {
                    $model->{$name}()->save($relation);
                }
            }
        }
    }

    /**
     * @param ModelConfigurationInterface $modelConfiguration
     *
     * @return \Illuminate\Contracts\Validation\Validator|null
     */
    public function validateForm(ModelConfigurationInterface $modelConfiguration)
    {
        if ($modelConfiguration !== $this->getModelConfiguration()) {
            return;
        }

        $data = Request::all();

        $verifier = app('validation.presence');
        $verifier->setConnection($this->getModel()->getConnectionName());

        $validator = Validator::make(
            $data,
            $this->getValidationRules(),
            $this->getValidationMessages(),
            $this->getValidationLabels()
        );

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
            'items' => $this->getElements(),
            'instance' => $this->getModel(),
            'attributes' => $this->htmlAttributesToString(),
            'buttons' => $this->getButtons(),
            'backUrl' => session('_redirectBack', \URL::previous()),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view($this->getView(), $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
