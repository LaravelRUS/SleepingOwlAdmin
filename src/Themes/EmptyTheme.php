<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

/**
 * Diagnostic theme that exposes package markup with shared styles only.
 */
final class EmptyTheme implements ThemeInterface
{
    public function viewNamespace(): string
    {
        return 'sleeping_owl::default';
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
        return ['icons'];
    }
}
