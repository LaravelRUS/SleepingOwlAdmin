<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class TailwindTheme implements ThemeInterface
{
    public function viewNamespace(): string
    {
        return 'sleeping_owl_shadcn::default';
    }

    public function assets(): array
    {
        return [
            'shared:icons',
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
            'theme:overrides',
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
                ThemeCapability::TablePresentation,
                ThemeCapability::Tabs,
            ]
        );
    }
}
