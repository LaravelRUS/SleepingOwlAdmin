<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Templates\TemplateDefault;

final class AdminLTETheme extends TemplateDefault implements ThemeInterface
{
    private const LEGACY_HANDLES = [
        'shared:vue' => 'admin-vue-init',
        'shared:features' => 'admin-default',
        'shared:modules' => 'admin-modules-load',
    ];

    public function initialize(): void
    {
        $selection = $this->app->make(ThemeSelection::class);
        $this->app->make(ThemeRuntimeAssets::class)->register(
            $selection->name(),
            $this,
            self::LEGACY_HANDLES
        );
    }

    public function viewNamespace(): string
    {
        return $this->getViewNamespace();
    }

    public function assets(): array
    {
        return [
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
            ThemeCapability::cases()
        );
    }
}
