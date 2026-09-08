<?php

namespace App\Admin\Sections;

use App\Models\Order;
use SleepingOwl\Admin\Contracts\Display\DisplayInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Facades\Display as AdminDisplay;
use SleepingOwl\Admin\Facades\Form as AdminForm;
use SleepingOwl\Admin\Facades\FormElement as AdminFormElement;
use SleepingOwl\Admin\Facades\TableColumn as AdminColumn;
use SleepingOwl\Admin\Facades\TableColumnFilter as AdminColumnFilter;
use SleepingOwl\Admin\Section;

final class OrderSection extends Section
{
    protected $title = 'Orders';

    protected $alias = 'orders';

    public function initialize(): void
    {
        $this->addToNavigation()
            ->setPriority(100)
            ->setIcon('fa-solid fa-cart-shopping');
    }

    public function onDisplay(array $payload = []): DisplayInterface
    {
        $display = AdminDisplay::datatables()
            ->setName('orders')
            ->setMethod('POST')
            ->setOrder([[0, 'desc']])
            ->paginate(25)
            ->setColumns($this->columns())
            ->setHtmlAttribute('class', 'table align-middle');

        $display->setColumnFilters($this->filters());
        $display->getColumnFilters()->setPlacement('card.heading');
        $display->setRowClassCallback(
            static fn (Order $order): string => $order->status === 'cancelled' ? 'opacity-50' : ''
        );

        return $display;
    }

    public function onCreate(array $payload = []): FormInterface
    {
        return $this->form();
    }

    public function onEdit($id = null, array $payload = []): FormInterface
    {
        return $this->form();
    }

    private function columns(): array
    {
        return [
            AdminColumn::text('id', '#')->setWidth('80px'),
            AdminColumn::link('number', 'Number'),
            AdminColumn::text('status', 'Status'),
            AdminColumn::datetime('created_at', 'Created'),
        ];
    }

    private function filters(): array
    {
        return [
            AdminColumnFilter::select($this->statusOptions(), 'Status')
                ->setColumnName('status')
                ->setPlaceholder('All statuses'),
        ];
    }

    private function form(): FormInterface
    {
        return AdminForm::card()->addBody([
            AdminFormElement::text('number', 'Number')->required(),
            AdminFormElement::select('status', 'Status', $this->statusOptions())->required(),
            AdminFormElement::multiselect('tags', 'Tags', []),
            AdminFormElement::date('delivery_date', 'Delivery date'),
            AdminFormElement::image('image', 'Image'),
        ]);
    }

    private function statusOptions(): array
    {
        return [
            'new' => 'New',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];
    }
}
