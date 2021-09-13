<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Validation\ValidationException;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\DisplayInterface;
use SleepingOwl\Admin\Contracts\Form\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\Form\FormException;
use SleepingOwl\Admin\Form\Element\Upload;

class FormDefault extends FormElements implements DisplayInterface, FormInterface
{
    use HtmlAttributes;

    /**
     * View to render.
     *
     * @var string|\Illuminate\View\View
     */
    protected $view = 'form.default';

    /**
     * Form related class.
     *
     * @var string
     */
    protected $class;

    /**
     * @var FormButtons
     */
    protected $buttons;

    /**
     * Form related repository.
     *
     * @var RepositoryInterface
     */
    protected $repository;

    /**
     * Form action url.
     *
     * @var string
     */
    protected $action;

    /**
     * Form related model instance.
     *
     * @var Model
     */
    protected $model;

    /**
     * Currently loaded model id.
     *
     * @var int
     */
    protected $id;

    /**
     * Is form already initialized?
     *
     * @var bool
     */
    protected $initialized = false;

    /**
     * FormDefault constructor.
     *
     * @param  array  $elements
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
     *
     * @throws \SleepingOwl\Admin\Exceptions\RepositoryException
     */
    public function initialize()
    {
        if ($this->initialized) {
            return false;
        }

        $this->initialized = true;
        $this->repository = app(RepositoryInterface::class);
        $this->repository->setClass($this->class);

        $model = $this->makeModel();
        parent::setModel($model);
        $this->getButtons()->setModel($model);

        parent::initialize();

        if (! $this->hasHtmlAttribute('enctype')) {

            // Recursive iterate subset of form elements
            // and if subset contains an upload element then add to for
            $this->recursiveIterateElements(function ($element) {
                if ($element instanceof Upload) {
                    $this->withFiles();

                    return true;
                }
            });
        }

        $this->getButtons()->setModelConfiguration(
            $this->getModelConfiguration()
        );
    }

    /**
     * Set enctype multipart/form-data.
     *
     * @return $this
     */
    public function withFiles()
    {
        $this->setHtmlAttribute('enctype', 'multipart/form-data');

        return $this;
    }

    /**
     * @return FormButtons
     */
    public function getButtons()
    {
        return $this->buttons;
    }

    /**
     * @param  FormButtonsInterface  $buttons
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
     * @param  string  $action
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
     * @param  string  $class
     * @return $this
     *
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
     * @return \SleepingOwl\Admin\Form\FormElementsCollection
     *
     * @see getElements()
     * @deprecated 4.5.0
     */
    public function getItems()
    {
        return $this->getElements();
    }

    /**
     * @param  array|\SleepingOwl\Admin\Contracts\Form\FormElementInterface  $items
     * @return $this
     *
     * @deprecated 4.5.0
     * @see setElements()
     */
    public function setItems($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        return $this->setElements($items);
    }

    /**
     * @param  \SleepingOwl\Admin\Contracts\Form\FormElementInterface  $item
     * @return $this
     *
     * @deprecated 4.5.0
     * @see addElement()
     */
    public function addItem($item)
    {
        return $this->addElement($item);
    }

    /**
     * Set currently loaded model id.
     *
     * @param  int  $id
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     */
    public function setId($id)
    {
        if (is_null($this->id)) {
            /**
             * Get Model from ModelConfiguration.
             */
            $model = null;
            $model_configuration = $this->getModelConfiguration();

            if (method_exists($model_configuration, 'getModelValue')) {
                $model = $model_configuration->getModelValue();
            }

            /*
             * Get Model from Repository
             */
            if (! $model && ! is_null($id)) {
                $model = $this->getRepository()->find($id);
            }

            if ($model) {
                $this->id = $id;

                parent::setModel($model);
                $this->getButtons()->setModel($model);
                $this->setModelClass(get_class($model));
            }
        }
    }

    /**
     * Get related form model configuration.
     *
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        $class = $this->class;

        if (is_null($class) && $this->getModel() instanceof Model) {
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
     * @param  Model  $model
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;

        return $this;
    }

    /**
     * @param  ModelConfigurationInterface  $modelConfiguration
     * @return bool
     */
    public function validModelConfiguration(ModelConfigurationInterface $modelConfiguration = null)
    {
        return is_null($modelConfiguration) || $modelConfiguration === $this->getModelConfiguration();
    }

    /**
     * Save instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  ModelConfigurationInterface  $modelConfiguration
     * @return bool
     */
    public function saveForm(\Illuminate\Http\Request $request, ModelConfigurationInterface $modelConfiguration = null)
    {
        if (! $this->validModelConfiguration($modelConfiguration)) {
            return false;
        }

        $model = $this->getModel();
        $loaded = $model->exists;

        if ($this->getModelConfiguration()->fireEvent($loaded ? 'updating' : 'creating', true, $model) === false) {
            return false;
        }

        if ($this->getModelConfiguration()->fireEvent('saving', true, $model) === false) {
            return false;
        }

        parent::save($request);
        $this->saveBelongsToRelations($model);

        $model->save();

        $this->saveHasOneRelations($model);

        parent::afterSave($request);

        $this->getModelConfiguration()->fireEvent($loaded ? 'updated' : 'created', false, $model);
        $this->getModelConfiguration()->fireEvent('saved', false, $model);

        return true;
    }

    /**
     * @param  Model  $model
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
     * @param  Model  $model
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
     * @param  \Illuminate\Http\Request  $request
     * @param  ModelConfigurationInterface  $modelConfiguration
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
