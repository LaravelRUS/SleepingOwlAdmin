<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Database\Eloquent\Model;
use Illuminate\View\View;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Form\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Form\Buttons\Cancel;
use SleepingOwl\Admin\Form\Buttons\Delete;
use SleepingOwl\Admin\Form\Buttons\FormButton;
use SleepingOwl\Admin\Form\Buttons\Save;
use SleepingOwl\Admin\Form\Buttons\SaveAndClose;
use SleepingOwl\Admin\Form\Buttons\SaveAndCreate;
use SleepingOwl\Admin\Traits\Renderable;

class FormButtons implements FormButtonsInterface
{
    use HtmlAttributes, Renderable;

    /**
     * @var
     */
    protected $placements;

    /**
     * @var string|null|array
     */
    protected $cancelButtonText;

    /**
     * @var string|null|array
     */
    protected $saveButtonText;

    /**
     * @var string|null|array
     */
    protected $saveAndCloseButtonText;

    /**
     * @var string|null|array
     */
    protected $saveAndCreateButtonText;

    /**
     * @var string|null|array
     */
    protected $deleteButtonText;

    /**
     * @var string|null|array
     */
    protected $destroyButtonText;

    /**
     * @var string|null|array
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

    protected $buttons;

    /**
     * FormButtons constructor.
     */
    public function __construct()
    {
        $this->setHtmlAttribute('class', 'form-buttons');
        $this->setButtonsOnConstruct();
    }

    /**
     * @return array
     */
    protected function getButtons()
    {
        foreach ($this->buttons as $button) {
            if ($button instanceof FormButton) {
                $button->setModelConfiguration($this->getModelConfiguration());
                $button->setModel($this->getModel());
                if ($button->getGroupElements()) {
                    foreach ($button->getGroupElements() as $groupButton) {
                        if ($groupButton instanceof FormButton) {
                            $groupButton->setModelConfiguration($this->getModelConfiguration());
                            $groupButton->setModel($this->getModel());
                            $groupButton->initialize();
                        }
                    }
                }
                $button->initialize();
            }
        }

        return $this->buttons;
    }

    /**
     * @param $buttons
     * @return $this
     */
    public function setButtons($buttons)
    {
        $this->buttons = $buttons;

        return $this;
    }

    /**
     * @param $buttons
     * @return $this
     */
    public function replaceButtons($buttons)
    {
        foreach ($buttons as $tempName => $tempButton) {
            foreach ($this->buttons as $name => $button) {
                if ($tempName == $name) {
                    $this->buttons[$name] = $tempButton;
                }

                if ($button instanceof FormButton) {
                    if ($button->getGroupElements()) {
                        foreach ($button->getGroupElements() as $groupName => $groupButton) {
                            if ($groupName == $tempName) {
                                $button->setGroupElement($groupName, $tempButton);
                            }
                        }
                    }
                }
            }
        }

        return $this;
    }

    /**
     * @param $placements
     * @return $this
     */
    public function setPlacements($placements)
    {
        $this->placements = $placements;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getPlacements()
    {
        return $this->placements;
    }

    /**
     * Set start buttons. Default logic.
     */
    protected function setButtonsOnConstruct()
    {
        $this->buttons = [
            'save' => (new Save())->setGroupElements([
                'save_and_create' => new SaveAndCreate(),
                'save_and_close' => new SaveAndClose(),
            ]),
            'delete' => new Delete(),
            'cancel' => new Cancel(),
        ];
    }

    /**
     * @return bool|\Illuminate\Database\Eloquent\Builder
     */
    protected function isTrashed()
    {
        return method_exists($this->getModel(), 'trashed') ? $this->getModel()->trashed() : false;
    }

    /**
     * @return null|string|array
     * @deprecated new version available
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
     * @return $this
     * @deprecated new version available
     */
    public function setCancelButtonText($cancelButtonText)
    {
        $this->cancelButtonText = $cancelButtonText;

        return $this;
    }

    /**
     * @return string|array
     * @deprecated new version available
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
     * @return $this
     * @deprecated
     */
    public function setSaveButtonText($saveButtonText)
    {
        $this->saveButtonText = $saveButtonText;

        return $this;
    }

    /**
     * @return string|array
     * @deprecated new version available
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
     * @deprecated new version available
     */
    public function setSaveAndCloseButtonText($saveAndCloseButtonText)
    {
        $this->saveAndCloseButtonText = $saveAndCloseButtonText;

        return $this;
    }

    /**
     * @return string|array
     * @deprecated new version available
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
     * @deprecated new version available
     */
    public function setSaveAndCreateButtonText($saveAndCreateButtonText)
    {
        $this->saveAndCreateButtonText = $saveAndCreateButtonText;

        return $this;
    }

    /**
     * @return string|array
     * @deprecated new version available
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
     * @return $this
     * @deprecated new version available
     */
    public function setDeleteButtonText($deleteButtonText)
    {
        $this->deleteButtonText = $deleteButtonText;

        return $this;
    }

    /**
     * @return null|string|array
     * @deprecated new version available
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
     * @deprecated new version available
     */
    public function setDestroyButtonText($destroyButtonText)
    {
        $this->destroyButtonText = $destroyButtonText;
    }

    /**
     * @return string
     * @deprecated new version available
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
     * @deprecated new version available
     */
    public function setRestoreButtonText($restoreButtonText)
    {
        $this->restoreButtonText = $restoreButtonText;
    }

    /**
     * @return bool
     * @deprecated new version available
     */
    public function isShowCancelButton()
    {
        return $this->showCancelButton;
    }

    /**
     * @return $this
     * @deprecated new version available
     */
    public function hideCancelButton()
    {
        $this->showCancelButton = false;

        return $this;
    }

    /**
     * @return bool
     * @deprecated new version available
     */
    public function isShowSaveAndCloseButton()
    {
        return $this->showSaveAndCloseButton;
    }

    /**
     * @return $this
     * @deprecated new version available
     */
    public function hideSaveAndCloseButton()
    {
        $this->showSaveAndCloseButton = false;

        return $this;
    }

    /**
     * @return bool
     * @deprecated new version available
     */
    public function isShowSaveAndCreateButton()
    {
        return $this->showSaveAndCreateButton;
    }

    /**
     * @return $this
     * @deprecated new version available
     */
    public function hideSaveAndCreateButton()
    {
        $this->showSaveAndCreateButton = false;

        return $this;
    }

    /**
     * @return bool|null
     * @deprecated new version available
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
     * @deprecated new version available
     */
    public function hideDeleteButton()
    {
        $this->showDeleteButton = false;

        return $this;
    }

    /**
     * @return bool|null
     * @deprecated new version available
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
     * @deprecated new version available
     */
    public function hideDestroyButton()
    {
        $this->showDestroyButton = false;

        return $this;
    }

    /**
     * @return bool|null
     * @deprecated new version available
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
     * @deprecated new version available
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
            'attributes' => $this->htmlAttributesToString(),
            'backUrl' => $this->getModelConfiguration()->getCancelUrl(),
            'editUrl' => $this->getModelConfiguration()->getEditUrl($this->getModel()->getKey()),
            'deleteUrl' => $this->getModelConfiguration()->getDeleteUrl($this->getModel()->getKey()),
            'destroyUrl' => $this->getModelConfiguration()->getDestroyUrl($this->getModel()->getKey()),
            'restoreUrl' => $this->getModelConfiguration()->getRestoreUrl($this->getModel()->getKey()),
            'saveButtonText' => $this->getSaveButtonText(),
            'saveAndCloseButtonText' => $this->getSaveAndCloseButtonText(),
            'saveAndCreateButtonText' => $this->getSaveAndCreateButtonText(),
            'cancelButtonText' => $this->getCancelButtonText(),
            'deleteButtonText' => $this->getDeleteButtonText(),
            'destroyButtonText' => $this->getDestroyButtonText(),
            'restoreButtonText' => $this->getRestoreButtonText(),
            'showCancelButton' => $this->isShowCancelButton(),
            'showSaveAndCloseButton' => $this->isShowSaveAndCloseButton(),
            'showSaveAndCreateButton' => $this->isShowSaveAndCreateButton(),
            'showDeleteButton' => $this->isShowDeleteButton(),
            'showDestroyButton' => $this->isShowDestroyButton(),
            'showRestoreButton' => $this->isShowRestoreButton(),
            'buttons' => $this->getButtons(),
            'placements' => $this->getPlacements(),
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
}
