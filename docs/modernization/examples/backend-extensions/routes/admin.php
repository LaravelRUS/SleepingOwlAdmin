<?php

use Illuminate\Support\Facades\Route;

Route::middleware(config('sleeping_owl.middleware', ['web']))
    ->prefix(config('sleeping_owl.url_prefix', 'admin'))
    ->group(function (): void {
        Route::view('reports/orders', 'admin.orders.report')
            ->name('admin.orders.report');
    });
