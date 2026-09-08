<?php

use App\Models\Order;

return [
    [
        'title' => 'Sales',
        'icon' => 'fa-solid fa-cart-shopping',
        'pages' => [
            Order::class,
        ],
    ],
];
