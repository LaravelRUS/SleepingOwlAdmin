<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnFactoryInterface;
use SleepingOwl\Admin\Factories\RepositoryFactory;
use Symfony\Component\Translation\TranslatorInterface;

class DisplayDatatables extends DisplayTable
{
    const FILTER_POSITION_TOP = 0;
    const FILTER_POSITION_BOTTOM = 2;
    const FILTER_POSITION_BOTH = 2;

    /**
     * @var array
     */
    protected $order = [[0, 'asc']];

    /**
     * @var array
     */
    protected $datatableAttributes = [];

    /**
     * @var int
     */
    protected $filterPosition = self::FILTER_POSITION_BOTH;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * DisplayDatatables constructor.
     * @param RepositoryFactory $repositoryFactory
     * @param AdminInterface $admin
     * @param Factory $viewFactory
     * @param Request $request
     * @param DisplayColumnFactoryInterface $displayColumnFactory
     * @param TranslatorInterface $translator
     */
    public function __construct(RepositoryFactory $repositoryFactory,
                                AdminInterface $admin,
                                Factory $viewFactory,
                                Request $request,
                                DisplayColumnFactoryInterface $displayColumnFactory,
                                TranslatorInterface $translator)
    {
        parent::__construct($repositoryFactory, $admin, $viewFactory, $request, $displayColumnFactory);

        $this->translator = $translator;
    }

    /**
     * Initialize display.
     */
    public function initialize()
    {
        parent::initialize();

        $id = str_random(10);

        $this->setHtmlAttribute('class', 'datatables');
        $this->setHtmlAttribute('data-id', $id);
        $this->getColumnFilters()->setHtmlAttribute('data-datatables-id', $id);

        $this->setHtmlAttribute('data-order', json_encode($this->getOrder()));

        $attributes = $this->getDatatableAttributes();
        $attributes['pageLength'] = $this->paginate;

        $attributes['language'] = $this->translator->trans('sleeping_owl::lang.table');

        foreach ($this->getColumns()->all() as $column) {
            $attributes['columns'][] = [
                'orderDataType' => class_basename($column),
            ];
        }

        $this->setHtmlAttribute('data-attributes', json_encode($attributes));
    }

    /**
     * @return array
     */
    public function getDatatableAttributes()
    {
        return array_merge(config('sleeping_owl.datatables', []), (array) $this->datatableAttributes);
    }

    /**
     * @param array $datatableAttributes
     *
     * @return $this
     */
    public function setDatatableAttributes(array $datatableAttributes)
    {
        $this->datatableAttributes = $datatableAttributes;

        return $this;
    }

    /**
     * @return array
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * @param array $order
     *
     * @return $this
     */
    public function setOrder($order)
    {
        if (! is_array($order)) {
            $order = func_get_args();
        }

        $this->order = $order;

        return $this;
    }

    /**
     * @return bool
     */
    public function usePagination()
    {
        return false;
    }

    /**
     * @return $this
     */
    public function disablePagination()
    {
        $this->paginate = -1;

        return $this;
    }

    /**
     * Get view render parameters.
     * @return array
     */
    public function toArray()
    {
        $params = parent::toArray();

        $params['order'] = $this->getOrder();

        return $params;
    }
}
