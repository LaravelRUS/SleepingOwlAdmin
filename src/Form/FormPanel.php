<?php

namespace SleepingOwl\Admin\Form;

use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Http\Request;
use Illuminate\Validation\PresenceVerifierInterface;
use KodiCMS\Assets\Package;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\FormElementInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use SleepingOwl\Admin\Factories\PackageFactory;
use SleepingOwl\Admin\Factories\RepositoryFactory;
use SleepingOwl\Admin\Form\Element\Html;
use SleepingOwl\Admin\Form\Panel\Body;
use SleepingOwl\Admin\Form\Panel\Footer;
use SleepingOwl\Admin\Form\Panel\Header;

class FormPanel extends FormDefault
{
    const POSITION_HEADER = 'header';
    const POSITION_BODY = 'body';
    const POSITION_FOOTER = 'footer';

    const SEPARATOR = '<hr class="panel-wide" />';

    /**
     * @var string
     */
    protected $view = 'form.panel';

    /**
     * @var PackageFactory
     */
    protected $packageFactory;

    /**
     * FormPanel constructor.
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
     * @param PackageFactory $packageFactory
     */
    public function __construct(array $elements,
                                TemplateInterface $template,
                                Package $package,
                                FormButtonsInterface $formButtons,
                                RepositoryFactory $repositoryFactory,
                                Request $request, Factory $validationFactory,
                                AdminInterface $admin,
                                PresenceVerifierInterface $presenceVerifier,
                                UrlGenerator $urlGenerator,
                                PackageFactory $packageFactory)
    {
        $this->packageFactory = $packageFactory;

        parent::__construct($elements, $template, $package, $formButtons, $repositoryFactory,
            $request, $validationFactory, $admin, $presenceVerifier, $urlGenerator);
    }

    /**
     * Initialize form.
     */
    public function initialize()
    {
        $this->getButtons()->setHtmlAttribute('class', 'panel-footer');

        $this->setHtmlAttribute('class', 'panel panel-default');

        parent::initialize();
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function setItems($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->addBody($items);

        return $this;
    }

    /**
     * @param FormElementInterface $item
     *
     * @return $this
     */
    public function addItem($item)
    {
        if ($part = $this->getElements()->last()) {
            $part->addElement($item);
        } else {
            $this->addBody($item);
        }

        return $this;
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function addHeader($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->addElement(new Header($items, $this->template, $this->packageFactory->make(Header::class)));

        return $this;
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function addBody($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        if (get_class($this->getElements()->last()) === Body::class) {
            $this->addElement(new Html('<hr />', $this->template, $this->packageFactory->make(Html::class)));
        }

        $this->addElement(new Body($items, $this->template, $this->packageFactory->make(Body::class)));

        return $this;
    }

    /**
     * @param array|FormElementInterface $items
     *
     * @return $this
     */
    public function addFooter($items)
    {
        if (! is_array($items)) {
            $items = func_get_args();
        }

        $this->addElement(new Footer($items, $this->template, $this->packageFactory->make(Footer::class)));

        return $this;
    }
}
