<?php

namespace SleepingOwl\Admin\Navigation;

use DaveJamesMiller\Breadcrumbs\Manager;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\BreadcrumbsInterface;
use SleepingOwl\Admin\Contracts\NavigationInterface;
use Symfony\Component\Translation\TranslatorInterface;

class Breadcrumbs implements BreadcrumbsInterface
{
    /**
     * @var string
     */
    protected $parentBreadcrumb = 'home';

    /**
     * @var Manager
     */
    protected $breadcrumbs;

    /**
     * Breadcrumbs constructor.
     * @param Manager $manager
     */
    public function __construct(Manager $manager)
    {
        $this->breadcrumbs = $manager;
    }

    /**
     * @param UrlGenerator $urlGenerator
     * @param NavigationInterface $navigation
     * @param Request $request
     * @param TranslatorInterface $translator
     */
    public function boot(UrlGenerator $urlGenerator,
                         NavigationInterface $navigation,
                         Request $request,
                         TranslatorInterface $translator)
    {
        $navigation->setCurrentUrl($request->url());

        $this->breadcrumbs->register('home', function ($breadcrumbs) use ($translator, $urlGenerator) {
            $breadcrumbs->push($translator->trans('sleeping_owl::lang.dashboard'),
                $urlGenerator->route('admin.dashboard'));
        });

        $breadcrumbs = [];
        if ($currentPage = $navigation->getCurrentPage()) {
            foreach ($currentPage->getPathArray() as $page) {
                $breadcrumbs[] = [
                    'id' => $page['id'],
                    'title' => $page['title'],
                    'url' => $page['url'],
                    'parent' => $this->parentBreadcrumb,
                ];

                $this->parentBreadcrumb = $page['id'];
            }
        }

        foreach ($breadcrumbs as $breadcrumb) {
            $this->breadcrumbs->register($breadcrumb['id'], function ($breadcrumbs) use ($breadcrumb) {
                $breadcrumbs->parent($breadcrumb['parent']);
                $breadcrumbs->push($breadcrumb['title'], $breadcrumb['url']);
            });
        }
    }

    /**
     * @param string $title
     * @param string $parent
     */
    public function register($title, $parent)
    {
        $this->breadcrumbs->register('render', function ($breadcrumbs) use ($title, $parent) {
            $breadcrumbs->parent($parent);
            $breadcrumbs->push($title);
        });

        $this->parentBreadcrumb = 'render';
    }

    /**
     * @return string
     */
    public function getParentBreadcrumb()
    {
        return $this->parentBreadcrumb;
    }
}
