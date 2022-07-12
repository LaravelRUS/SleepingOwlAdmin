<?php

namespace SleepingOwl\Admin\Model;

use Closure;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Translation\Translator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use SleepingOwl\Admin\Contracts\Display\DisplayInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;

class ModelConfiguration extends ModelConfigurationManager
{
    /**
     * @var string|Translator
     */
    protected Translator|string $createTitle;

    /**
     * @var string|Translator
     */
    protected Translator|string $editTitle;

    /**
     * @var Closure|null
     */
    protected ?Closure $display;

    /**
     * @var Closure|null
     */
    protected ?Closure $create;

    /**
     * @var bool
     */
    protected bool $displayable = true;

    /**
     * @var bool
     */
    protected bool $creatable = true;

    /**
     * @var bool
     */
    protected bool $editable = true;

    /**
     * @var bool
     */
    protected bool $restorable = true;

    /**
     * @var bool
     */
    protected bool $deletable = true;

    /**
     * @var bool
     */
    protected bool $destroyable = true;

    /**
     * @var Closure|null
     */
    protected ?Closure $edit;

    /**
     * @var Closure|bool|null
     */
    protected Closure|bool|null $delete = true;

    /**
     * @var Closure|bool|null
     */
    protected Closure|bool|null $destroy = true;

    /**
     * @var Closure|bool|null
     */
    protected Closure|bool|null $restore = true;

    /**
     * @var string
     */
    protected string $messageOnCreate;

    /**
     * @var string
     */
    protected string $messageOnUpdate;

    /**
     * @var string
     */
    protected string $messageOnDelete;

    /**
     * @var string
     */
    protected string $messageOnDestroy;

    /**
     * @var string
     */
    protected string $messageOnRestore;

    /**
     * @var Collection|null
     */
    protected ?Collection $breadcrumbs = null;

    public function __construct(Application $app, $class)
    {
        parent::__construct($app, $class);
        $this->breadcrumbs = collect();
    }

    /**
     * @return Collection
     * @TODO Daan test
     */
    public function getBreadCrumbs(): Collection
    {
        return $this->breadcrumbs;
//        return $this->breadcrumbs->toArray();
    }

    /**
     * @param $breadcrumb
     * @return void
     */
    public function addBreadCrumb($breadcrumb)
    {
        $this->breadcrumbs->push($breadcrumb);
    }

    /**
     * @param  string  $alias
     * @return $this
     */
    public function setAlias($alias)
    {
        $this->alias = $alias;

        return $this;
    }

    /**
     * @param  string  $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Translator
     */
    public function getCreateTitle(): Translator
    {
        if (is_null($this->createTitle)) {
            return parent::getCreateTitle();
        }

        return $this->createTitle;
    }

    /**
     * @param  string  $title
     * @return ModelConfiguration
     */
    public function setCreateTitle(string $title): ModelConfiguration
    {
        $this->createTitle = $title;

        return $this;
    }

    /**
     * @return Translator
     */
    public function getEditTitle(): Translator
    {
        if (is_null($this->editTitle)) {
            return parent::getEditTitle();
        }

        return $this->editTitle;
    }

    /**
     * @param  string  $title
     * @return ModelConfiguration
     */
    public function setEditTitle(string $title): ModelConfiguration
    {
        $this->editTitle = $title;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDisplayable(): bool
    {
        return $this->displayable && parent::isDisplayable();
    }

    /**
     * @return ModelConfiguration
     */
    public function disableDisplay(): ModelConfiguration
    {
        $this->displayable = false;

        return $this;
    }

    /**
     * @param  string  $action
     * @param  Model  $model
     * @return bool
     */
    public function can(string $action, Model $model): bool
    {
        if (! $this->checkAccess) {
            return true;
        }

        return Gate::allows($action, $model);
    }

    /**
     * @return bool
     */
    public function isCreatable(): bool
    {
        if (! is_callable($this->getCreate())) {
            return false;
        }

        return $this->creatable && parent::isCreatable($this->getModel());
    }

    /**
     * @return ModelConfiguration
     */
    public function disableCreating(): ModelConfiguration
    {
        $this->creatable = false;

        return $this;
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isEditable(Model $model): bool
    {
        if (! is_callable($this->getEdit())) {
            return false;
        }

        return $this->editable && parent::isEditable($model);
    }

    /**
     * @return ModelConfiguration
     */
    public function disableEditing(): ModelConfiguration
    {
        $this->editable = false;

        return $this;
    }

    /**
     * @param  bool  $deletable
     * @return ModelConfiguration
     */
    public function setDeletable($deletable): ModelConfiguration
    {
        $this->deletable = (bool) $deletable;

        return $this;
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDeletable(Model $model): bool
    {
        return $this->deletable && parent::isDeletable($model);
    }

    /**
     * @return ModelConfiguration
     */
    public function disableDeleting(): ModelConfiguration
    {
        $this->setDeletable(false);

        return $this;
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDestroyable(Model $model): bool
    {
        return $this->destroyable && parent::isDestroyable($model);
    }

    /**
     * @return ModelConfiguration
     */
    public function disableDestroying(): ModelConfiguration
    {
        $this->destroyable = false;

        return $this;
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isRestorable(Model $model): bool
    {
        return $this->restorable && parent::isRestorable($model);
    }

    /**
     * @return bool
     */
    public function isRestorableModel(): bool
    {
        return $this->restorable && parent::isRestorableModel();
    }

    /**
     * @return ModelConfiguration
     */
    public function disableRestoring(): ModelConfiguration
    {
        $this->restorable = false;

        return $this;
    }

    /**
     * @return Closure|null
     */
    public function getDisplay(): ?Closure
    {
        return $this->display;
    }

    /**
     * @param  Closure  $callback
     * @return ModelConfiguration
     */
    public function onDisplay(Closure $callback): ModelConfiguration
    {
        $this->display = $callback;

        return $this;
    }

    /**
     * @param  mixed  $payload
     * @return mixed
     */
    public function fireDisplay($payload = []): mixed
    {
        if (! is_callable($this->getDisplay())) {
            return null;
        }

        $display = $this->app->call($this->getDisplay(), ['payload' => $payload]);

        if ($display instanceof DisplayDatatablesAsync) {
            $display->setPayload($payload);
        }

        if ($display instanceof DisplayInterface) {
            $display->setModelClass($this->getClass());
        }

        if ($display instanceof Initializable) {
            $display->initialize();
        }

        return $display;
    }

    /**
     * @return Closure|null
     */
    public function getCreate()
    {
        return $this->create;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onCreate(Closure $callback = null)
    {
        $this->create = $callback;

        return $this;
    }

    /**
     * @param  mixed  $payload
     * @return mixed
     */
    public function fireCreate($payload = []): mixed
    {
        if (! is_callable($this->getCreate())) {
            return null;
        }

        $form = $this->app->call($this->getCreate(), ['payload' => $payload]);

        if ($form instanceof DisplayInterface) {
            $form->setModelClass($this->getClass());
        }

        if ($form instanceof FormInterface) {
            $form->setAction($this->getStoreUrl());
        }

        if ($form instanceof Initializable) {
            $form->initialize();
        }

        return $form;
    }

    /**
     * @return Closure|null
     */
    public function getEdit(): ?Closure
    {
        return $this->edit;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onEdit(Closure $callback = null)
    {
        $this->edit = $callback;

        return $this;
    }

    /**
     * @param  int|string  $id
     * @param  mixed  $payload
     * @return mixed|void
     */
    public function fireEdit($id, $payload = []): mixed
    {
        if (! is_callable($this->getEdit())) {
            return null;
        }

        $payload = array_merge(['id' => $id], ['payload' => $payload]);

        $form = $this->app->call($this->getEdit(), $payload);

        if ($form instanceof DisplayInterface) {
            $form->setModelClass($this->getClass());
        }

        if ($form instanceof FormInterface) {
            $form->setAction($this->getUpdateUrl($id));
        }

        if ($form instanceof Initializable) {
            $form->initialize();
        }

        if ($form instanceof FormInterface) {
            $form->setId($id);
        }

        return $form;
    }

    /**
     * @param  int  $id
     * @return ModelConfigurationInterface
     * @TODO Все Fire переделать под один стандарт
     */
    public function fireFullEdit(int $id): ModelConfigurationInterface
    {
        return $this->fireEdit($id);
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onCreateAndEdit(Closure $callback = null)
    {
        $this->onCreate($callback);
        $this->onEdit($callback);

        return $this;
    }

    /**
     * @return Closure|null
     */
    public function getDelete()
    {
        return $this->delete;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onDelete(Closure $callback = null)
    {
        $this->delete = $callback;

        return $this;
    }

    /**
     * @param  int|string  $id
     * @return mixed
     */
    public function fireDelete($id): mixed
    {
        if (is_callable($this->getDelete())) {
            return $this->app->call($this->getDelete(), [$id]);
        }

        return null;
    }

    /**
     * @return Closure|null
     */
    public function getDestroy()
    {
        return $this->destroy;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onDestroy(Closure $callback = null)
    {
        $this->destroy = $callback;

        return $this;
    }

    /**
     * @param  int|string  $id
     * @return mixed
     */
    public function fireDestroy($id): mixed
    {
        if (is_callable($this->getDestroy())) {
            return $this->app->call($this->getDestroy(), [$id]);
        }

        return null;
    }

    /**
     * @return Closure|null
     */
    public function getRestore()
    {
        return $this->restore;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onRestore(Closure $callback = null)
    {
        $this->restore = $callback;

        return $this;
    }

    /**
     * @param  int|string  $id
     * @return bool|mixed
     */
    public function fireRestore($id): mixed
    {
        if (is_callable($this->getRestore())) {
            return $this->app->call($this->getRestore(), [$id]);
        }

        return null;
    }

    /**
     * @return string
     */
    public function getMessageOnCreate(): string
    {
        if (is_null($this->messageOnCreate)) {
            $this->messageOnCreate = parent::getMessageOnCreate();
        }

        return $this->messageOnCreate;
    }

    /**
     * @param  string  $messageOnCreate
     * @return $this
     */
    public function setMessageOnCreate($messageOnCreate)
    {
        $this->messageOnCreate = $messageOnCreate;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessageOnUpdate(): string
    {
        if (is_null($this->messageOnUpdate)) {
            $this->messageOnUpdate = parent::getMessageOnUpdate();
        }

        return $this->messageOnUpdate;
    }

    /**
     * @param  string  $messageOnUpdate
     * @return $this
     */
    public function setMessageOnUpdate($messageOnUpdate)
    {
        $this->messageOnUpdate = $messageOnUpdate;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessageOnDelete(): string
    {
        if (is_null($this->messageOnDelete)) {
            $this->messageOnDelete = parent::getMessageOnDelete();
        }

        return $this->messageOnDelete;
    }

    /**
     * @param  string  $messageOnDelete
     * @return $this
     */
    public function setMessageOnDelete($messageOnDelete)
    {
        $this->messageOnDelete = $messageOnDelete;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessageOnDestroy(): string
    {
        if (is_null($this->messageOnDestroy)) {
            $this->messageOnDestroy = parent::getMessageOnDestroy();
        }

        return $this->messageOnDestroy;
    }

    /**
     * @param  string  $messageOnDestroy
     * @return $this
     */
    public function setMessageOnDestroy($messageOnDestroy)
    {
        $this->messageOnDestroy = $messageOnDestroy;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessageOnRestore(): string
    {
        if (is_null($this->messageOnRestore)) {
            $this->messageOnRestore = parent::getMessageOnRestore();
        }

        return $this->messageOnRestore;
    }

    /**
     * @param  string  $messageOnRestore
     * @return $this
     */
    public function setMessageOnRestore($messageOnRestore)
    {
        $this->messageOnRestore = $messageOnRestore;

        return $this;
    }
}
