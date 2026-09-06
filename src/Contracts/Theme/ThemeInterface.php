<?php

namespace SleepingOwl\Admin\Contracts\Theme;

interface ThemeInterface
{
    public function id(): string;

    public function viewNamespace(): string;

    /**
     * Logical asset entries owned by the theme.
     *
     * @return list<string>
     */
    public function assets(): array;

    /**
     * @return array<string, string>
     */
    public function icons(): array;

    /**
     * @return list<string>
     */
    public function capabilities(): array;
}
