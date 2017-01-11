<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Form\Element\Upload;
use Illuminate\Validation\ValidationException;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\Form\FormException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

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
        $this->setModel(
            $this->makeModel()
        );

        parent::initialize();

        if (! $this->hasHtmlAttribute('enctype')) {
            // Try to find upload element
            $this->getElements()->each(function ($element) {

                // TODO: this not works withs nested elements
                if ($element instanceof Upload and ! $this->hasHtmlAttribute('enctype')) {
                    $this->setHtmlAttribute('enctype', 'multipart/form-data');
                }
            });
        }

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
        $this->action = $action;

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
     * @throws FormException
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
        $class = $this->class;

        if (is_null($class) and $this->getModel() instanceof Model) {
            $class = $this->getModel();
        }

        return app('sleeping_owl')->getModel($class);
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
        parent::setModel($model);
        $this->getButtons()->setModel($model);

        if (is_null($this->class)) {
            $this->setModelClass(get_class($model));
        }

        return $this;
    }

    /**
     * @param ModelConfigurationInterface $modelConfiguration
     *
     * @return bool
     */
    public function validModelConfiguration(ModelConfigurationInterface $modelConfiguration = null)
    {
        return is_null($modelConfiguration) || $modelConfiguration === $this->getModelConfiguration();
    }

    /**
     * Save instance.
     *
     * @param \Illuminate\Http\Request $request
     * @param ModelConfigurationInterface $modelConfiguration
     *
     * @return bool
     */
    public function saveForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $modelConfiguration = null)
    {
        if (! $this->validModelConfiguration($modelConfiguration)) {
            return false;
        }

        parent::save($request);

        $model = $this->getModel();

        $this->saveBelongsToRelations($model);

        $loaded = $model->exists;

        if ($this->getModelConfiguration()->fireEvent($loaded ? 'updating' : 'creating', true, $model) === false) {
            return false;
        }

        if ($this->getModelConfiguration()->fireEvent('saving', true, $model) === false) {
            return false;
        }

        $model->save();

        $this->saveHasOneRelations($model);

        parent::afterSave($request);

        $this->getModelConfiguration()->fireEvent($loaded ? 'updated' : 'created', false, $model);
        $this->getModelConfiguration()->fireEvent('saved', false, $model);

        return true;
    }

    /**
     * @param Model $model
     *
     * @return void
     */
    protected function saveBelongsToRelations(Model $model)
    {
        foreach ($model->getRelations() as $name => $relation) {
            if ($model->{$name}() instanceof BelongsTo && ! is_null($relation)) {
                $relation->save();
                $model->{$name}()->associate($relation);
            }
        }
    }

    /**
     * @param Model $model
     *
     * @return void
     */
    protected function saveHasOneRelations(Model $model)
    {
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
     * @param \Illuminate\Http\Request $request
     * @param ModelConfigurationInterface $modelConfiguration
     *
     * @throws ValidationException
     */
    public function validateForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $modelConfiguration = null)
    {
        if (! $this->validModelConfiguration($modelConfiguration)) {
            return;
        }

        $verifier = app('validation.presence');
        $verifier->setConnection($this->getModel()->getConnectionName());

        $validator = \Validator::make(
            $request->all(),
            $this->getValidationRules(),
            $this->getValidationMessages(),
            $this->getValidationLabels()
        );

        $validator->setPresenceVerifier($verifier);

        $this->getModelConfiguration()->fireEvent('validate', false, $this->getModel(), $validator);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        // This element needs only in template
        $this->setHtmlAttribute('method', 'POST');
        $this->setHtmlAttribute('action', $this->getAction());

        return [
            'items' => $this->getElements()->onlyVisible(),
            'instance' => $this->getModel(),
            'attributes' => $this->htmlAttributesToString(),
            'buttons' => $this->getButtons(),
            'backUrl' => session('_redirectBack', \URL::previous()),
        ];
    }

    /**
     * @return Model
     */
    protected function makeModel()
    {
        $class = $this->getClass();

        return new $class();
    }
}
