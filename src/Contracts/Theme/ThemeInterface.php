<?php

namespace SleepingOwl\Admin\Contracts\Theme;

interface ThemeInterface
{
    /**
     * Blade namespace owned by this theme.
     */
    public function viewNamespace(): string;

    /**
     * Unscoped logical asset declarations required by the theme. The selected
     * config/registry name is applied to theme and feature entries by the runtime.
     * Physical paths, URLs and already-scoped theme names are not allowed.
     *
     * @see \SleepingOwl\Admin\Themes\ThemeAssetManifest
     *
     * @return list<string>
     */
    public function assets(): array;

    /**
     * Theme-owned tokens interpreted only by theme views.
     *
     * @see \SleepingOwl\Admin\Themes\ThemeIcons
     *
     * @return array<string, string>
     */
    public function icons(): array;

    /**
     * Standard presentation capability ids.
     *
     * @see \SleepingOwl\Admin\Themes\ThemeCapability
     *
     * @return list<string>
     */
    public function capabilities(): array;
}
