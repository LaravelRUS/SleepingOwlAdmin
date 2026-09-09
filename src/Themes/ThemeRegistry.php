<?php

namespace SleepingOwl\Admin\Themes;

use Illuminate\Contracts\Foundation\Application;
use InvalidArgumentException;
use SleepingOwl\Admin\Assets\AssetManifestLoader;
use SleepingOwl\Admin\Assets\AssetManifestRegistry;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeRegistry
{
    /** @var array<string, class-string<ThemeInterface>> */
    private array $registered = [];

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
    public function register(
        string $name,
        string $themeClass,
        string $manifestPath,
        string $publicRoot
    ): self
    {
        $this->assertName($name);
        if (isset($this->registered[$name])) {
            throw new InvalidArgumentException("Theme name [{$name}] is already registered.");
        }

        $theme = $this->makeTheme($themeClass);
        $manifest = $this->loader->loadFragment($manifestPath);
        $this->validator->validate($name, $theme, $manifest);
        $this->assets->register($name, $manifest, $publicRoot);
        $this->registered[$name] = $themeClass;

        return $this;
    }

    /**
     * Register a self-contained Composer theme root with a ready manifest.
     *
     * Expected root layout: asset-manifest.json, resources/ and public/.
     *
     * @param  class-string<ThemeInterface>  $themeClass
     */
    public function registerPackage(
        string $name,
        string $themeClass,
        string $themeRoot,
        string $publicRoot
    ): self {
        $themeRoot = rtrim($themeRoot, '/\\');
        if ($themeRoot === '') {
            throw new InvalidArgumentException('Theme package root must be a non-empty path.');
        }

        return $this->register(
            $name,
            $themeClass,
            $themeRoot.DIRECTORY_SEPARATOR.'asset-manifest.json',
            $publicRoot
        );
    }

    public function has(string $name): bool
    {
        return isset($this->registered[$name]);
    }

    /**
     * @param  class-string  $configuredClass
     * @return class-string
     */
    public function implementationClass(string $name, ?string $configuredClass = null): string
    {
        $registeredClass = $this->registered[$name] ?? null;
        if ($registeredClass !== null && $configuredClass !== null && $registeredClass !== $configuredClass) {
            throw new InvalidArgumentException(
                "Theme name [{$name}] is configured for [{$configuredClass}] and registered for [{$registeredClass}]."
            );
        }

        return $registeredClass ?? $configuredClass
            ?? throw new InvalidArgumentException("Theme name [{$name}] is not registered.");
    }

    public function nameForClass(string $themeClass): ?string
    {
        $name = array_search($themeClass, $this->registered, true);

        return is_string($name) ? $name : null;
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

    private function assertName(string $name): void
    {
        if (preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $name) !== 1) {
            throw new InvalidArgumentException('Theme names must use lower-kebab format.');
        }
    }
}
