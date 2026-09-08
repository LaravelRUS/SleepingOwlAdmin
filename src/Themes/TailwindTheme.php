<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class TailwindTheme implements ThemeInterface
{
    private const FEATURE_ADAPTERS = [
        'dropdown',
        'sidebar',
        'tooltip',
    ];

    public function id(): string
    {
        return 'tailwind';
    }

    public function viewNamespace(): string
    {
        return 'sleeping_owl_tailwind::default';
    }

    public function assets(): array
    {
        return [
            'shared:icons',
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:tailwind',
            ...array_map(
                fn (string $feature): string => "feature:{$feature}:theme:{$this->id()}",
                self::FEATURE_ADAPTERS
            ),
        ];
    }

    public function icons(): array
    {
        return [];
    }

    public function capabilities(): array
    {
        return array_map(
            fn (ThemeCapability $capability): string => $capability->value,
            [
                ThemeCapability::Tooltip,
                ThemeCapability::Dropdown,
                ThemeCapability::Notification,
                ThemeCapability::Icons,
                ThemeCapability::Sidebar,
            ]
        );
    }
}
