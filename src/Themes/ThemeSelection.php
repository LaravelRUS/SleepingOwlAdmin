<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeSelection
{
    public function __construct(
        private TemplateInterface $template,
        private ThemeInterface $theme
    ) {
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
