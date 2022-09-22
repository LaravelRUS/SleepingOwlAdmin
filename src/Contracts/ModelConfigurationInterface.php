<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Translation\Translator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Navigation\Page;

interface ModelConfigurationInterface
{
    /**
     * @return RepositoryInterface
     */
    public function getRepository(): RepositoryInterface;

    /**
     * @return Collection|array|null
     */
    public function getBreadCrumbs(): Collection|array|null;

    /**
     * @param $breadcrumb
     * @return mixed|void
     */
    public function addBreadCrumb($breadcrumb);

    /**
     * @return string
     */
    public function getClass(): string;

    /**
     * @return string
     */
    public function getAlias(): string;

    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return string|null
     */
    public function getIcon(): ?string;

    /**
     * @return Translator|string
     */
    public function getCreateTitle(): Translator|string;

    /**
     * @return Translator|string
     */
    public function getEditTitle(): Translator|string;

    /**
     * @return bool
     */
    public function isDisplayable(): bool;

    /**
     * @return bool
     */
    public function isCreatable(): bool;

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isEditable(Model $model): bool;

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDeletable(Model $model): bool;

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDestroyable(Model $model): bool;

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isRestorable(Model $model): bool;

    /**
     * @return bool
     */
    public function isRestorableModel(): bool;

    /**
     * @param  string  $action
     * @param  Model  $model
     * @return bool
     */
    public function can(string $action, Model $model): bool;

    /**
     * @return mixed
     */
    public function fireDisplay(): mixed;

    /**
     * @return mixed|void
     */
    public function fireCreate();

    /**
     * @param  array  $redirect
     * @return $this
     */
    public function setRedirect(array $redirect): self;

    /**
     * @return Collection
     */
    public function getRedirect(): Collection;

    /**
     * @param $id
     * @return mixed|void
     */
    public function fireEdit($id);

    /**
     * @param  int  $id
     * @return $this
     *
     * @deprecated
     */
    public function fireFullEdit(int $id): self;

    /**
     * @param $id
     * @return mixed
     */
    public function fireDelete($id): mixed;

    /**
     * @param $id
     * @return mixed
     */
    public function fireDestroy($id): mixed;

    /**
     * @param $id
     * @return mixed
     */
    public function fireRestore($id): mixed;

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getDisplayUrl(array $parameters = []): string;

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getCreateUrl(array $parameters = []): string;

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getCancelUrl(array $parameters = []): string;

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getStoreUrl(array $parameters = []): string;

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getEditUrl(int|string $id, array $parameters = []): string;

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getUpdateUrl(int|string $id, array $parameters = []): string;

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getDeleteUrl(int|string $id, array $parameters = []): string;

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getDestroyUrl(int|string $id, array $parameters = []): string;

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getRestoreUrl(int|string $id, array $parameters = []): string;

    /**
     * @return string
     */
    public function getMessageOnCreate(): string;

    /**
     * @return string
     */
    public function getMessageOnUpdate(): string;

    /**
     * @return string
     */
    public function getMessageOnDelete(): string;

    /**
     * @return string
     */
    public function getMessageOnDestroy(): string;

    /**
     * @return string
     */
    public function getMessageOnRestore(): string;

    /**
     * @return bool
     */
    public function hasCustomControllerClass(): bool;

    /**
     * @return null|string
     */
    public function getControllerClass(): ?string;

    /**
     * @return Page
     */
    public function addToNavigation(): Page;

    /**
     * @param  string  $title
     * @param  int  $priority
     * @return Page
     */
    public function addNavigationLabel(string $title, int $priority): Page;

    /**
     * @param  int  $priority
     * @return Page
     */
    public function addNavigationDivider(int $priority): Page;
}
