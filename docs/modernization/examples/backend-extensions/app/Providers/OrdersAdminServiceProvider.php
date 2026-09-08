<?php

namespace App\Providers;

use App\Admin\Form\Elements\Money;
use App\Admin\Sections\OrderSection;
use App\Admin\Widgets\PendingOrders;
use App\Models\Order;
use App\Policies\OrderSectionPolicy;
use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Admin;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;
use SleepingOwl\Admin\Contracts\Widgets\WidgetsRegistryInterface;
use SleepingOwl\Admin\Factories\FormElementFactory;

final class OrdersAdminServiceProvider extends ServiceProvider
{
    public function boot(
        Admin $admin,
        Gate $gate,
        FormElementFactory $elements,
        WidgetsRegistryInterface $widgets,
        MetaInterface $meta
    ): void {
        $this->registerSections($admin, $gate);
        $this->registerExtensions($elements, $widgets, $meta);
        $this->loadRoutesFrom(base_path('routes/admin.php'));
    }

    private function registerSections(Admin $admin, Gate $gate): void
    {
        $admin->registerSections([
            Order::class => OrderSection::class,
        ]);
        $gate->policy(OrderSection::class, OrderSectionPolicy::class);
    }

    private function registerExtensions(
        FormElementFactory $elements,
        WidgetsRegistryInterface $widgets,
        MetaInterface $meta
    ): void {
        $elements->bind('money', Money::class);
        $widgets->registerWidget(PendingOrders::class);
        $meta->addCss('orders-admin', asset('css/orders-admin.css'), 'admin-default');
        $meta->addJs('orders-admin', asset('js/orders-admin.js'), 'admin-default');
    }
}
