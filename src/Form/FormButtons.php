<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;

class FormButtons implements FormButtonsInterface
{
    use HtmlAttributes;

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
    protected $showDeleteButton;

    /**
     * @var bool|null
     */
    protected $showDestroyButton;

    /**
     * @var bool|null
     */
    protected $showRestoreButton;

    /**
     * @var ModelConfigurationInterface
     */
    protected $modelConfiguration;

    /**
     * Current editable model id
     * @var int|mixed
     */
    protected $id;

    /**
     * FormButtons constructor.
     * @param int|mixed $currentId
     */
    public function __construct($currentId)
    {
        $this->id = $currentId;
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
        if (is_null($this->destroyButtonText)) {
            $this->destroyButtonText = trans('sleeping_owl::lang.table.restore');
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
        return $this->showDeleteButton;
    }

    /**
     * @param bool $bool
     * @return $this
     */
    public function showDeleteButton($bool)
    {
        $this->showDeleteButton = (bool) $bool;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function isShowDestroyButton()
    {
        return $this->showDestroyButton;
    }

    /**
     * @param bool $bool
     * @return $this
     */
    public function showDestroyButton($bool)
    {
        $this->showDestroyButton = (bool) $bool;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function isShowRestoreButton()
    {
        return $this->showRestoreButton;
    }

    /**
     * @param bool $bool
     * @return $this
     */
    public function showRestoreButton($bool)
    {
        $this->showRestoreButton = (bool) $bool;
        
        return $this;
    }

    /**
     * @return mixed
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('form.buttons', $this->toArray());
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'attributes'              => $this->htmlAttributesToString(),
            'backUrl'                 => $this->getModelConfiguration()->getDisplayUrl(),
            'deleteUrl'               => $this->getModelConfiguration()->getDeleteUrl($this->id),
            'destroyUrl'              => $this->getModelConfiguration()->getDestroyUrl($this->id),
            'restoreUrl'              => $this->getModelConfiguration()->getRestoreUrl($this->id),
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
}
