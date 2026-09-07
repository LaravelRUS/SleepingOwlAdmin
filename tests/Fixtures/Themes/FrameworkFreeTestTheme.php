<?php

namespace SleepingOwl\Tests\Fixtures\Themes;

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class FrameworkFreeTestTheme implements ThemeInterface
{
    public function id(): string
    {
        return 'framework-free-test';
    }

    public function viewNamespace(): string
    {
        return 'framework-free-test::contract';
    }

    public function assets(): array
    {
        return [
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:framework-free-test',
            'feature:dropdown:theme:framework-free-test',
            'feature:sidebar:theme:framework-free-test',
            'feature:table:theme:framework-free-test',
            'feature:tabs:theme:framework-free-test',
            'feature:tooltip:theme:framework-free-test',
        ];
    }

    public function icons(): array
    {
        return [];
    }

    public function capabilities(): array
    {
        return [
            'dropdown',
            'notification',
            'sidebar',
            'table-presentation',
            'tabs',
            'tooltip',
        ];
    }
}
