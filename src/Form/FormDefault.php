<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\DatabasePresenceVerifier;
use Illuminate\Validation\PresenceVerifierInterface;
use Illuminate\Validation\Validator;
use KodiCMS\Assets\Package;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Factories\RepositoryFactory;
use SleepingOwl\Admin\Form\Element\Upload;
use Illuminate\Contracts\Validation\Factory;

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
     * @var Request
     */
    protected $request;

    /**
     * @var RepositoryFactory
     */
    protected $repositoryFactory;

    /**
     * @var Factory
     */
    protected $validationFactory;

    /**
     * @var AdminInterface
     */
    protected $admin;

    /**
     * @var PresenceVerifierInterface|DatabasePresenceVerifier
     */
    protected $presenceVerifier;

    /**
     * @var UrlGenerator|\Illuminate\Routing\UrlGenerator
     */
    protected $urlGenerator;

    /**
     * FormDefault constructor.
     *
     * @param array $elements
     * @param TemplateInterface $template
     * @param Package $package
     * @param FormButtonsInterface $formButtons
     * @param RepositoryFactory $repositoryFactory
     * @param Request $request
     * @param Factory $validationFactory
     * @param AdminInterface $admin
     * @param PresenceVerifierInterface $presenceVerifier
     * @param UrlGenerator $urlGenerator
     */
    public function __construct(array $elements,
                                TemplateInterface $template,
                                Package $package,
                                FormButtonsInterface $formButtons,
                                RepositoryFactory $repositoryFactory,
                                Request $request,
                                Factory $validationFactory,
                                AdminInterface $admin,
                                PresenceVerifierInterface $presenceVerifier,
                                UrlGenerator $urlGenerator)
    {
        parent::__construct($elements, $template, $package);

        $this->request = $request;
        $this->validationFactory = $validationFactory;
        $this->repositoryFactory = $repositoryFactory;
        $this->admin = $admin;
        $this->presenceVerifier = $presenceVerifier;
        $this->urlGenerator = $urlGenerator;

        $this->setButtons($formButtons);
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
        $this->repository = $this->repositoryFactory->make($this->class);

        $this->setModel($this->repository->getModel());

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
        return $this->admin->getModel($this->class);
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
     */
    public function saveForm(ModelConfigurationInterface $modelConfiguration)
    {
        if ($modelConfiguration !== $this->getModelConfiguration()) {
            return;
        }

        parent::save();

        $this->saveBelongsToRelations();

        $this->getModel()->save();

        $this->saveHasOneRelations();

        parent::afterSave();
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

        $data = $this->request->all();

        $this->presenceVerifier->setConnection($this->getModel()->getConnectionName());

        /** @var Validator $validator */
        $validator = $this->validationFactory->make($data,
            $this->getValidationRules(),
            $this->getValidationMessages(),
            $this->getValidationLabels());

        $validator->setPresenceVerifier($this->presenceVerifier);

        if ($validator->fails()) {
            return $validator;
        }
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
            'backUrl' => $this->request->session()->set('_redirectBack', $this->urlGenerator->previous()),
        ];
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return $this->template->view($this->getView(), $this->toArray());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
