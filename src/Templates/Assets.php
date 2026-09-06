<?php

namespace SleepingOwl\Admin\Templates;

use InvalidArgumentException;
use JsonException;
use SleepingOwl\Admin\Assets\Asset;
use SleepingOwl\Admin\Assets\AssetPackage;
use SleepingOwl\Admin\Assets\AssetPackageRegistry;
use SleepingOwl\Admin\Assets\AssetRegistry;
use SleepingOwl\Admin\Assets\AssetRenderer;
use SleepingOwl\Admin\Contracts\Template\AssetsInterface;

class Assets implements AssetsInterface
{
    /** @var array<string, AssetPackage> */
    private array $loadedPackages = [];

    /** @var array<string, mixed> */
    private array $globalVars = [];

    public function __construct(
        private AssetPackageRegistry $packages,
        private AssetRegistry $registry,
        private AssetRenderer $renderer
    ) {
    }

    public function packageManager(): AssetPackageRegistry
    {
        return $this->packages;
    }

    public function clear(): self
    {
        $this->registry->clear();
        $this->loadedPackages = [];
        $this->globalVars = [];

        return $this;
    }

    public function addJs(
        $handle = false,
        $src = null,
        $dependency = null,
        $footer = true,
        array $attributes = []
    ): Asset {
        $source = $this->source($src);

        return $this->registry->register(Asset::script(
            $this->handle($handle, $source),
            $source,
            $this->dependencies($dependency),
            (bool) $footer,
            $attributes
        ));
    }

    public function addCss(
        $handle = null,
        $src = null,
        $dependency = null,
        array $attributes = []
    ): Asset {
        $source = $this->source($src);
        $attributes += ['media' => 'all'];

        return $this->registry->register(Asset::style(
            $this->handle($handle, $source),
            $source,
            $this->dependencies($dependency),
            $attributes
        ));
    }

    public function getJs(string $handle): string
    {
        return $this->renderAsset($this->registry->findScript($handle));
    }

    public function getCss(string $handle): string
    {
        return $this->renderAsset($this->registry->findStyle($handle));
    }

    public function removeJs(string|bool|null $handle = null): self
    {
        if (is_bool($handle)) {
            $this->registry->removeScripts(null, $handle);
        } else {
            $this->registry->removeScripts($handle);
        }

        return $this;
    }

    public function removeCss(?string $handle = null): self
    {
        $this->registry->removeStyles($handle);

        return $this;
    }

    public function loadPackage($names): self
    {
        $names = is_array($names) ? $names : func_get_args();

        foreach ($this->packages->resolve($names) as $package) {
            $this->loadedPackages[$package->getName()] = $package;
        }

        return $this;
    }

    /**
     * @return list<string>
     */
    public function loadedPackages(): array
    {
        return array_keys($this->loadedPackages);
    }

    public function removePackages(): self
    {
        $this->loadedPackages = [];

        return $this;
    }

    public function putGlobalVar($key, $value): self
    {
        $this->globalVars[(string) $key] = $value;

        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function globalVars(): array
    {
        return $this->globalVars;
    }

    public function renderScripts($footer = false): string
    {
        $this->registerLoadedPackages();

        return $this->renderer->renderMany($this->registry->scripts((bool) $footer));
    }

    public function renderStyles(): string
    {
        $this->registerLoadedPackages();

        return $this->renderer->renderMany($this->registry->styles());
    }

    /**
     * @throws JsonException
     */
    public function renderGlobalVars(): string
    {
        $json = json_encode($this->globalVars, JSON_THROW_ON_ERROR);

        return "<script>window.GlobalConfig = {$json};</script>";
    }

    /**
     * @throws JsonException
     */
    public function render(): string
    {
        return implode(PHP_EOL, [
            $this->renderGlobalVars(),
            $this->renderStyles(),
            $this->renderScripts(false),
        ]);
    }

    private function registerLoadedPackages(): void
    {
        foreach ($this->loadedPackages as $package) {
            $this->registry->registerMany($package->styles());
            $this->registry->registerMany($package->scripts());
        }
    }

    private function renderAsset(?Asset $asset): string
    {
        return $asset === null ? '' : $this->renderer->render($asset);
    }

    private function source(mixed $source): string
    {
        if ($source instanceof \Stringable) {
            $source = (string) $source;
        }

        if (! is_string($source) || trim($source) === '') {
            throw new InvalidArgumentException('Asset source must be a non-empty string.');
        }

        return $source;
    }

    private function handle(mixed $handle, string $source): string
    {
        return is_string($handle) && trim($handle) !== '' ? $handle : $source;
    }

    /**
     * @return array|string|null
     */
    private function dependencies(mixed $dependencies): array|string|null
    {
        if ($dependencies === null || is_array($dependencies) || is_string($dependencies)) {
            return $dependencies;
        }

        throw new InvalidArgumentException('Asset dependencies must be strings or arrays.');
    }
}
