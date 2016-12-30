<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\View\View;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Traits\Renderable;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class FormButtons implements FormButtonsInterface
{
    use HtmlAttributes, Renderable;

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
     * @var string|null
     */
    protected $deleteButtonText;

    /**
     * @var string|null
     */
    protected $destroyButtonText;

    /**
     * @var string|null
     */
    protected $restoreButtonText;

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
     * @var bool|null
     */
    protected $showDeleteButton = true;

    /**
     * @var bool|null
     */
    protected $showDestroyButton = true;

    /**
     * @var bool|null
     */
    protected $showRestoreButton = true;

    /**
     * @var ModelConfigurationInterface
     */
    protected $modelConfiguration;

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var string|View
     */
    protected $view = 'form.buttons';

    /**
     * FormButtons constructor.
     */
    public function __construct()
    {
        $this->setHtmlAttribute('class', 'form-buttons');
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
     * @return string
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
     * @return string
     */
    public function getDeleteButtonText()
    {
        if (is_null($this->deleteButtonText)) {
            $this->deleteButtonText = trans('sleeping_owl::lang.table.delete');
        }

        return $this->deleteButtonText;
    }

    /**
     * @param null|string $deleteButtonText
     *
     * @return $this
     */
    public function setDeleteButtonText($deleteButtonText)
    {
        $this->deleteButtonText = $deleteButtonText;

        return $this;
    }

    /**
     * @return null
     */
    public function getDestroyButtonText()
    {
        if (is_null($this->destroyButtonText)) {
            $this->destroyButtonText = trans('sleeping_owl::lang.table.destroy');
        }

        return $this->destroyButtonText;
    }

    /**
     * @param null|string $destroyButtonText
     */
    public function setDestroyButtonText($destroyButtonText)
    {
        $this->destroyButtonText = $destroyButtonText;
    }

    /**
     * @return string
     */
    public function getRestoreButtonText()
    {
        if (is_null($this->restoreButtonText)) {
            $this->restoreButtonText = trans('sleeping_owl::lang.table.restore');
        }

        return $this->restoreButtonText;
    }

    /**
     * @param null|string $restoreButtonText
     */
    public function setRestoreButtonText($restoreButtonText)
    {
        $this->restoreButtonText = $restoreButtonText;
    }

    /**
     * @return bool
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
     * @return bool
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
     * @return bool
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
     * @return bool|null
     */
    public function isShowDeleteButton()
    {
        if (is_null($this->getModel()->getKey()) || ! $this->showDeleteButton) {
            return false;
        }

        $this->showDeleteButton = ! $this->isTrashed() && $this->getModelConfiguration()->isDeletable($this->getModel());

        return $this->showDeleteButton;
    }

    /**
     * @return $this
     */
    public function hideDeleteButton()
    {
        $this->showDeleteButton = false;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function isShowDestroyButton()
    {
        if (is_null($this->getModel()->getKey()) || ! $this->showDestroyButton) {
            return false;
        }

        $this->showDestroyButton = $this->isTrashed() &&
            $this->getModelConfiguration()->isDestroyable($this->getModel());

        return $this->showDestroyButton;
    }

    /**
     * @return $this
     */
    public function hideDestroyButton()
    {
        $this->showDestroyButton = false;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function isShowRestoreButton()
    {
        if (is_null($this->getModel()->getKey()) || ! $this->showRestoreButton) {
            return false;
        }

        $this->showRestoreButton = $this->isTrashed() &&
            $this->getModelConfiguration()->isRestorable($this->getModel());

        return $this->showRestoreButton;
    }

    /**
     * @return $this
     */
    public function hideRestoreButton()
    {
        $this->showRestoreButton = false;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'attributes'              => $this->htmlAttributesToString(),
            'backUrl'                 => $this->getModelConfiguration()->getDisplayUrl(),
            'editUrl'                 => $this->getModelConfiguration()->getEditUrl($this->getModel()->getKey()),
            'deleteUrl'               => $this->getModelConfiguration()->getDeleteUrl($this->getModel()->getKey()),
            'destroyUrl'              => $this->getModelConfiguration()->getDestroyUrl($this->getModel()->getKey()),
            'restoreUrl'              => $this->getModelConfiguration()->getRestoreUrl($this->getModel()->getKey()),
            'saveButtonText'          => $this->getSaveButtonText(),
            'saveAndCloseButtonText'  => $this->getSaveAndCloseButtonText(),
            'saveAndCreateButtonText' => $this->getSaveAndCreateButtonText(),
            'cancelButtonText'        => $this->getCancelButtonText(),
            'deleteButtonText'        => $this->getDeleteButtonText(),
            'destroyButtonText'       => $this->getDestroyButtonText(),
            'restoreButtonText'       => $this->getRestoreButtonText(),
            'showCancelButton'        => $this->isShowCancelButton(),
            'showSaveAndCloseButton'  => $this->isShowSaveAndCloseButton(),
            'showSaveAndCreateButton' => $this->isShowSaveAndCreateButton(),
            'showDeleteButton'        => $this->isShowDeleteButton(),
            'showDestroyButton'       => $this->isShowDestroyButton(),
            'showRestoreButton'       => $this->isShowRestoreButton(),
        ];
    }

    /**
     * @param ModelConfigurationInterface $modelConfiguration
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $modelConfiguration)
    {
        $this->modelConfiguration = $modelConfiguration;

        return $this;
    }

    /**
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        return $this->modelConfiguration;
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

        return $this;
    }

    /**
     * @return bool
     */
    protected function isTrashed()
    {
        return method_exists($this->getModel(), 'trashed') ? $this->getModel()->trashed() : false;
    }
}
