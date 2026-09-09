<?php

namespace SleepingOwl\Admin\Themes;

final class ThemeCssVariables
{
    private const SIDEBAR_BACKGROUND = '--soa-sidebar-bg';

    /** @var array<string, string> */
    private array $variables;

    public function __construct(ThemeConfiguration $configuration)
    {
        $this->variables = $this->fromConfiguration($configuration);
    }

    /**
     * @return array<string, string>
     */
    public function all(): array
    {
        return $this->variables;
    }

    /**
     * @return array<string, string>
     */
    private function fromConfiguration(ThemeConfiguration $configuration): array
    {
        $color = $configuration->get('sidebar_background_color');

        if ($color === null) {
            return [];
        }

        return [
            self::SIDEBAR_BACKGROUND => CssColor::from(
                $color,
                'sleeping_owl.ui.sidebar_background_color'
            )->value(),
        ];
    }
}
