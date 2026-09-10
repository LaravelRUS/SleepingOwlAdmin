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
        [$name, $configuredClass] = $this->configuredTheme($configuration);
        $implementation = $this->makeImplementation($name, $configuredClass);

        if ($implementation instanceof TemplateInterface && $implementation instanceof ThemeInterface) {
            $name ??= $this->legacyName($configuredClass, $implementation);
            $this->validateTheme($name, $implementation);

            return new ThemeSelection($name, $implementation, $implementation);
        }

        if ($implementation instanceof TemplateInterface) {
            $name ??= $this->legacyName($configuredClass, $implementation);
            return $this->fromLegacyTemplate($name, $implementation);
        }

        if ($implementation instanceof ThemeInterface) {
            $name ??= $this->legacyName($configuredClass, $implementation);
            return $this->fromTheme($name, $implementation);
        }

        throw new TemplateException(
            "Configured theme [{$configuredClass}] must implement ThemeInterface or TemplateInterface."
        );
    }

    /**
     * @return class-string
     */
    private function configuredTheme(mixed $configuration): array
    {
        if (is_string($configuration)) {
            return [null, $configuration];
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

        if (! array_key_exists($default, $themes) && ! $this->themes->has($default)) {
            throw new TemplateException(
                "Default theme [{$default}] is neither configured nor registered."
            );
        }

        return [$default, $themes[$default] ?? null];
    }

    private function makeImplementation(?string $name, ?string $configuredClass): object
    {
        try {
            $implementationClass = $name === null
                ? $configuredClass
                : $this->themes->implementationClass($name, $configuredClass);
        } catch (\InvalidArgumentException $exception) {
            throw new TemplateException($exception->getMessage(), 0, $exception);
        }

        if (! is_string($implementationClass)) {
            throw new TemplateException('Configured theme class must be a non-empty class-string.');
        }

        if (! class_exists($implementationClass)) {
            throw new TemplateException("Template class [{$configuredClass}] not found in config file");
        }

        return $this->app->make($implementationClass);
    }

    private function fromLegacyTemplate(string $name, TemplateInterface $template): ThemeSelection
    {
        $theme = new LegacyTemplateThemeAdapter(
            $template,
            [],
            [],
            $this->allCapabilityIds()
        );

        return new ThemeSelection($name, $template, $theme);
    }

    private function fromTheme(string $name, ThemeInterface $theme): ThemeSelection
    {
        $this->validateTheme($name, $theme);

        $template = $this->app->make(ThemeTemplateAdapter::class, [
            'themeName' => $name,
            'theme' => $theme,
        ]);

        return new ThemeSelection($name, $template, $theme);
    }

    private function validateTheme(string $name, ThemeInterface $theme): void
    {
        ThemeAssetManifest::fromTheme($name, $theme);
        ThemeCapabilities::fromTheme($theme);
        ThemeIcons::fromTheme($theme);
    }

    /**
     * Resolve a canonical name only for the legacy class-string config shape.
     */
    private function legacyName(string $configuredClass, object $implementation): string
    {
        if (($registered = $this->themes->nameForClass($configuredClass)) !== null) {
            return $registered;
        }

        $configuredThemes = $this->app['config']->get('sleeping_owl.template.themes', []);
        if (is_array($configuredThemes)) {
            $name = array_search($configuredClass, $configuredThemes, true);
            if (is_string($name)) {
                return $name;
            }
        }

        if ($implementation instanceof TemplateInterface) {
            return 'adminlte';
        }

        throw new TemplateException(
            "Legacy class-string theme [{$configuredClass}] has no canonical name; configure it in [sleeping_owl.template.themes]."
        );
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
