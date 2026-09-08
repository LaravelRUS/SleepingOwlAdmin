<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class TailwindTheme implements ThemeInterface
{
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
        ];
    }

    public function icons(): array
    {
        return [];
    }

    public function capabilities(): array
    {
        return [ThemeCapability::Icons->value];
    }
}
