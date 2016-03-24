<?php

namespace SleepingOwl\Admin\Form;

use SleepingOwl\Admin\Model\ModelConfiguration;
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
     * @var ModelConfiguration
     */
    protected $modelConfiguration;

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
     * @return null|string
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
            'saveButtonText'          => $this->getSaveButtonText(),
            'saveAndCloseButtonText'  => $this->getSaveAndCloseButtonText(),
            'saveAndCreateButtonText' => $this->getSaveAndCreateButtonText(),
            'cancelButtonText'        => $this->getCancelButtonText(),
            'showCancelButton'        => $this->isShowCancelButton(),
            'showSaveAndCloseButton'  => $this->isShowSaveAndCloseButton(),
            'showSaveAndCreateButton' => $this->isShowSaveAndCreateButton(),
        ];
    }

    /**
     * @param ModelConfiguration $modelConfiguration
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfiguration $modelConfiguration)
    {
        $this->modelConfiguration = $modelConfiguration;

        return $this;
    }

    /**
     * @return ModelConfiguration
     */
    public function getModelConfiguration()
    {
        return $this->modelConfiguration;
    }
}
