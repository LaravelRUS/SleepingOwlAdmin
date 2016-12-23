<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;

interface ModelConfigurationInterface
{
    /**
     * @return RepositoryInterface
     */
    public function getRepository();

    /**
     * @return string
     */
    public function getClass();

    /**
     * @return string
     */
    public function getAlias();

    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return string
     */
    public function getIcon();

    /**
     * @return string|\Symfony\Component\Translation\TranslatorInterface
     */
    public function getCreateTitle();

    /**
     * @return string|\Symfony\Component\Translation\TranslatorInterface
     */
    public function getEditTitle();

    /**
     * @return bool
     */
    public function isDisplayable();

    /**
     * @return bool
     */
    public function isCreatable();

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function isEditable(Model $model);

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function isDeletable(Model $model);

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function isDestroyable(Model $model);

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function isRestorable(Model $model);

    /**
     * @return bool
     */
    public function isRestorableModel();

    /**
     * @param string $action
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function can($action, Model $model);

    /**
     * @return DisplayInterface|mixed
     */
    public function fireDisplay();

    /**
     * @return mixed|void
     */
    public function fireCreate();

    /**
     * @param array $redirect
     * @return $this
     */
    public function setRedirect(array $redirect);

    /**
     * @return Collection
     */
    public function getRedirect();

    /**
     * @param $id
     *
     * @return mixed|void
     */
    public function fireEdit($id);

    /**
     * @deprecated
     * @param int $id
     *
     * @return $this
     */
    public function fireFullEdit($id);

    /**
     * @param $id
     *
     * @return mixed
     */
    public function fireDelete($id);

    /**
     * @param $id
     *
     * @return mixed
     */
    public function fireDestroy($id);

    /**
     * @param $id
     *
     * @return bool|mixed
     */
    public function fireRestore($id);

    /**
     * @param array $parameters
     *
     * @return string
     */
    public function getDisplayUrl(array $parameters = []);

    /**
     * @param array $parameters
     *
     * @return string
     */
    public function getCreateUrl(array $parameters = []);

    /**
     * @return string
     */
    public function getStoreUrl();

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getEditUrl($id);

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getUpdateUrl($id);

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getDeleteUrl($id);

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getDestroyUrl($id);

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getRestoreUrl($id);

    /**
     * @return string
     */
    public function getMessageOnCreate();

    /**
     * @return string
     */
    public function getMessageOnUpdate();

    /**
     * @return string
     */
    public function getMessageOnDelete();

    /**
     * @return string
     */
    public function getMessageOnDestroy();

    /**
     * @return string
     */
    public function getMessageOnRestore();

    /**
     * @return bool
     */
    public function hasCustomControllerClass();

    /**
     * @return null|string
     */
    public function getControllerClass();
}
