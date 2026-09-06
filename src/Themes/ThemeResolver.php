<?php

namespace SleepingOwl\Admin\Themes;

use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Exceptions\TemplateException;

final class ThemeResolver
{
    public function __construct(private Application $app)
    {
    }

    public function resolve(mixed $configuredClass): ThemeSelection
    {
        $implementation = $this->makeImplementation($configuredClass);

        if ($implementation instanceof TemplateInterface && $implementation instanceof ThemeInterface) {
            $this->validateTheme($implementation);

            return new ThemeSelection($implementation, $implementation);
        }

        if ($implementation instanceof TemplateInterface) {
            return $this->fromLegacyTemplate($implementation);
        }

        if ($implementation instanceof ThemeInterface) {
            return $this->fromTheme($implementation);
        }

        throw new TemplateException(
            "Configured theme [{$configuredClass}] must implement ThemeInterface or TemplateInterface."
        );
    }

    private function makeImplementation(mixed $configuredClass): object
    {
        if (! is_string($configuredClass) || ! class_exists($configuredClass)) {
            $value = is_scalar($configuredClass) ? (string) $configuredClass : get_debug_type($configuredClass);

            throw new TemplateException("Template class [{$value}] not found in config file");
        }

        return $this->app->make($configuredClass);
    }

    private function fromLegacyTemplate(TemplateInterface $template): ThemeSelection
    {
        $theme = new LegacyTemplateThemeAdapter(
            $template,
            'legacy-adminlte',
            ['shared:icons', 'theme:legacy-adminlte'],
            [],
            $this->allCapabilityIds()
        );

        return new ThemeSelection($template, $theme);
    }

    private function fromTheme(ThemeInterface $theme): ThemeSelection
    {
        $this->validateTheme($theme);

        $template = $this->app->make(ThemeTemplateAdapter::class, [
            'theme' => $theme,
        ]);

        return new ThemeSelection($template, $theme);
    }

    private function validateTheme(ThemeInterface $theme): void
    {
        ThemeAssetManifest::fromTheme($theme);
        ThemeCapabilities::fromTheme($theme);
        ThemeIcons::fromTheme($theme);
    }

    /**
     * @return list<string>
     */
    private function allCapabilityIds(): array
    {
        return array_map(
            fn (ThemeCapability $capability) => $capability->value,
            ThemeCapability::cases()
        );
    }
}
