<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;

final class AssetPackage
{
    /** @var array<string, string> */
    private array $dependencies = [];

    private AssetRegistry $assets;

    private function __construct(private string $name)
    {
        if (trim($name) === '') {
            throw new InvalidArgumentException('Asset package name cannot be empty.');
        }

        $this->assets = new AssetRegistry(new AssetDependencySorter());
    }

    public static function create(string $name): self
    {
        return new self($name);
    }

    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param  array|string  $packages
     */
    public function with(array|string $packages, string ...$additional): self
    {
        $this->dependencies = [];

        return $this->addDependency($this->mergePackages($packages, $additional));
    }

    /**
     * @param  array|string  $packages
     */
    public function addDependency(array|string $packages, string ...$additional): self
    {
        foreach ($this->mergePackages($packages, $additional) as $package) {
            if (is_string($package) && trim($package) !== '') {
                $this->dependencies[$package] = $package;
            }
        }

        return $this;
    }

    /**
     * @return list<string>
     */
    public function getDependencies(): array
    {
        return array_values($this->dependencies);
    }

    public function hasDependencies(): bool
    {
        return $this->dependencies !== [];
    }

    /**
     * @param  array|string|null  $dependency
     * @param  array<int|string, mixed>  $attributes
     */
    public function js(
        ?string $handle,
        string $source,
        array|string|null $dependency = null,
        bool $footer = false,
        array $attributes = []
    ): self {
        $this->assets->register(Asset::script(
            $handle ?? $this->name,
            $source,
            $dependency,
            $footer,
            $attributes
        ));

        return $this;
    }

    /**
     * @param  array|string|null  $dependency
     * @param  array<int|string, mixed>  $attributes
     */
    public function css(
        ?string $handle,
        string $source,
        array|string|null $dependency = null,
        array $attributes = []
    ): self {
        $attributes += ['media' => 'all'];
        $this->assets->register(Asset::style(
            $handle ?? $this->name,
            $source,
            $dependency,
            $attributes
        ));

        return $this;
    }

    /**
     * @return list<Asset>
     */
    public function scripts(): array
    {
        return $this->assets->registeredScripts();
    }

    /**
     * @return list<Asset>
     */
    public function styles(): array
    {
        return $this->assets->registeredStyles();
    }

    /**
     * @param  array|string  $packages
     * @param  list<string>  $additional
     * @return list<mixed>
     */
    private function mergePackages(array|string $packages, array $additional): array
    {
        return array_merge((array) $packages, $additional);
    }
}
