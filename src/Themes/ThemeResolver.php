<?php

namespace SleepingOwl\Admin\Themes;

use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Exceptions\TemplateException;

final class ThemeResolver
{
    private ThemeRegistry $themes;

    public function __construct(private Application $app, ?ThemeRegistry $themes = null)
    {
        $this->themes = $themes ?? $app->make(ThemeRegistry::class);
    }

    public function resolve(mixed $configuration): ThemeSelection
    {
        $configuredClass = $this->configuredClass($configuration);
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

    /**
     * @return class-string
     */
    private function configuredClass(mixed $configuration): string
    {
        if (is_string($configuration)) {
            return $configuration;
        }

        if (! is_array($configuration)) {
            $value = is_scalar($configuration) ? (string) $configuration : get_debug_type($configuration);

            throw new TemplateException("Template class [{$value}] not found in config file");
        }

        $default = $configuration['default'] ?? null;
        if (! is_string($default) || $default === '') {
            throw new TemplateException(
                'Theme config [sleeping_owl.template.default] must be a non-empty theme name.'
            );
        }

        $themes = $configuration['themes'] ?? null;
        if (! is_array($themes) || $themes === []) {
            throw new TemplateException(
                'Theme config [sleeping_owl.template.themes] must be a non-empty theme map.'
            );
        }

        foreach ($themes as $name => $class) {
            if (! is_string($name) || preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $name) !== 1) {
                throw new TemplateException(
                    'Theme names in [sleeping_owl.template.themes] must use lower-kebab format.'
                );
            }

            if (! is_string($class) || $class === '') {
                throw new TemplateException(
                    "Configured class for theme [{$name}] must be a non-empty class-string."
                );
            }
        }

        if (! array_key_exists($default, $themes)) {
            throw new TemplateException(
                "Default theme [{$default}] is not defined in [sleeping_owl.template.themes]."
            );
        }

        return $themes[$default];
    }

    private function makeImplementation(string $configuredClass): object
    {
        $implementationClass = $this->themes->implementationClass($configuredClass);
        if (! class_exists($implementationClass)) {
            throw new TemplateException("Template class [{$configuredClass}] not found in config file");
        }

        return $this->app->make($implementationClass);
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
