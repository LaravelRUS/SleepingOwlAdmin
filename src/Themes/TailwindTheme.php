<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class TailwindTheme implements ThemeInterface
{
    public function viewNamespace(): string
    {
        return 'sleeping_owl_tailwind::default';
    }

    public function assets(): array
    {
        return [
            'shared:compatibility',
            'shared:modules',
            'shared:vue',
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
            ThemeCapability::cases()
        );
    }
}
