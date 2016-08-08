<?php

namespace SleepingOwl\Admin\Model;

use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\NavigationInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\PackageManager;
use Symfony\Component\Translation\TranslatorInterface;

class SectionModelConfiguration extends ModelConfigurationManager
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * @var PackageManager
     */
    protected $packageManager;

    /**
     * ModelConfigurationManager constructor.
     *
     * @param Dispatcher $dispatcher
     * @param TranslatorInterface $translator
     * @param UrlGenerator $urlGenerator
     * @param RepositoryInterface $repository
     * @param NavigationInterface $navigation
     * @param Gate $gate
     * @param Container $container
     * @param PackageManager $packageManager
     */
    public function __construct(Dispatcher $dispatcher,
                                TranslatorInterface $translator,
                                UrlGenerator $urlGenerator,
                                RepositoryInterface $repository,
                                NavigationInterface $navigation,
                                Gate $gate,
                                Container $container,
                                PackageManager $packageManager)
    {
        parent::__construct($dispatcher, $translator, $urlGenerator, $repository, $navigation, $gate);

        $this->container = $container;
        $this->packageManager = $packageManager;
    }

    /**
     * @return bool
     */
    public function isCreatable()
    {
        return method_exists($this, 'onCreate') && parent::isCreatable();
    }

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function isEditable(Model $model)
    {
        return method_exists($this, 'onEdit') && parent::isEditable($model);
    }

    /**
     * @return DisplayInterface|mixed
     */
    public function fireDisplay()
    {
        if (! method_exists($this, 'onDisplay')) {
            return;
        }

        $display = $this->container->call([$this, 'onDisplay']);

        if ($display instanceof DisplayInterface) {
            $display->setModelClass($this->getClass());
            $display->initialize();
        }

        $this->packageManager->initialize();

        return $display;
    }

    /**
     * @return mixed|void
     */
    public function fireCreate()
    {
        if (! method_exists($this, 'onCreate')) {
            return;
        }

        $form = $this->container->call([$this, 'onCreate']);
        if ($form instanceof DisplayInterface) {
            $form->setModelClass($this->getClass());
        }

        if ($form instanceof Initializable) {
            $form->initialize();
        }

        if ($form instanceof FormInterface) {
            $form->setAction($this->getStoreUrl());
        }

        $this->packageManager->initialize();

        return $form;
    }

    /**
     * @param $id
     *
     * @return mixed|void
     */
    public function fireEdit($id)
    {
        if (! method_exists($this, 'onEdit')) {
            return;
        }

        $form = $this->container->call([$this, 'onEdit'], ['id' => $id]);
        if ($form instanceof DisplayInterface) {
            $form->setModelClass($this->getClass());
        }

        if ($form instanceof Initializable) {
            $form->initialize();
        }

        if ($form instanceof FormInterface) {
            $form->setAction($this->getUpdateUrl($id));
            $form->setId($id);
        }

        $this->packageManager->initialize();

        return $form;
    }

    /**
     * @param $id
     *
     * @return mixed
     */
    public function fireDelete($id)
    {
        if (method_exists($this, 'onDelete')) {
            return $this->container->call([$this, 'onDelete'], ['id' => $id]);
        }
    }

    /**
     * @param $id
     *
     * @return mixed
     */
    public function fireDestroy($id)
    {
        if (method_exists($this, 'onDestroy')) {
            return $this->container->call([$this, 'onDestroy'], ['id' => $id]);
        }
    }

    /**
     * @param $id
     *
     * @return bool|mixed
     */
    public function fireRestore($id)
    {
        if (method_exists($this, 'onRestore')) {
            return $this->container->call([$this, 'onRestore'], ['id' => $id]);
        }
    }
}
