<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeSelection
{
    public function __construct(
        private string $name,
        private TemplateInterface $template,
        private ThemeInterface $theme
    ) {
        if (preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $name) !== 1) {
            throw new \InvalidArgumentException('Theme names must use lower-kebab format.');
        }
    }

    public function name(): string
    {
        return $this->name;
    }

    public function template(): TemplateInterface
    {
        return $this->template;
    }

    public function theme(): ThemeInterface
    {
        return $this->theme;
    }
}
