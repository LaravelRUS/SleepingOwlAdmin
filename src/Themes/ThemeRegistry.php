<?php

namespace SleepingOwl\Admin\Themes;

use Illuminate\Contracts\Foundation\Application;
use InvalidArgumentException;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestRegistry;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeRegistry
{
    /** @var array<class-string, string> */
    private array $registered = [];

    /** @var array<class-string, class-string<ThemeInterface>> */
    private array $replacements = [];

    public function __construct(
        private Application $app,
        private AssetManifestLoader $loader,
        private AssetManifestRegistry $assets,
        private ExternalThemeAssets $validator
    ) {
    }

    /**
     * @param  class-string<ThemeInterface>  $themeClass
     */
    public function register(string $themeClass, string $manifestPath, string $publicRoot): self
    {
        $theme = $this->makeTheme($themeClass);
        $manifest = $this->loader->loadFragment($manifestPath);
        $this->validator->validate($theme, $manifest);
        $this->assets->register($theme->id(), $manifest, $publicRoot);
        $this->registered[$themeClass] = $theme->id();

        return $this;
    }

    /**
     * @param  class-string  $configuredClass
     * @param  class-string<ThemeInterface>  $themeClass
     */
    public function replace(string $configuredClass, string $themeClass): self
    {
        if (! isset($this->registered[$themeClass])) {
            throw new InvalidArgumentException(
                "Theme [{$themeClass}] must be registered before it can replace another theme."
            );
        }

        $this->replacements[$configuredClass] = $themeClass;

        return $this;
    }

    /**
     * @param  class-string  $configuredClass
     * @return class-string
     */
    public function implementationClass(string $configuredClass): string
    {
        return $this->replacements[$configuredClass] ?? $configuredClass;
    }

    /**
     * @param  class-string<ThemeInterface>  $themeClass
     */
    private function makeTheme(string $themeClass): ThemeInterface
    {
        if (! is_a($themeClass, ThemeInterface::class, true)) {
            throw new InvalidArgumentException("External theme [{$themeClass}] must implement ThemeInterface.");
        }

        return $this->app->make($themeClass);
    }
}
