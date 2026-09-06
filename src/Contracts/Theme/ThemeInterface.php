<?php

namespace SleepingOwl\Admin\Contracts\Theme;

interface ThemeInterface
{
    public function id(): string;

    public function viewNamespace(): string;

    /**
     * Logical asset entries required by the theme. Physical paths and URLs are not allowed.
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
