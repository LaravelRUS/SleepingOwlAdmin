<?php

namespace SleepingOwl\Admin\Assets;

final class AssetRegistry
{
    /** @var array<string, Asset> */
    private array $scripts = [];

    /** @var array<string, Asset> */
    private array $styles = [];

    public function __construct(private AssetDependencySorter $sorter)
    {
    }

    public function register(Asset $asset): Asset
    {
        if ($asset->isScript()) {
            $this->scripts[$asset->handle()] = $asset;
        } else {
            $this->styles[$asset->handle()] = $asset;
        }

        return $asset;
    }

    /**
     * @param  iterable<Asset>  $assets
     */
    public function registerMany(iterable $assets): self
    {
        foreach ($assets as $asset) {
            $this->register($asset);
        }

        return $this;
    }

    public function findScript(string $handle): ?Asset
    {
        return $this->scripts[$handle] ?? null;
    }

    public function findStyle(string $handle): ?Asset
    {
        return $this->styles[$handle] ?? null;
    }

    /**
     * @return list<Asset>
     */
    public function scripts(bool $footer): array
    {
        $scripts = array_filter(
            $this->scripts,
            static fn (Asset $asset): bool => $asset->footer() === $footer
        );

        return $this->sorter->sort($scripts);
    }

    /**
     * @return list<Asset>
     */
    public function styles(): array
    {
        return $this->sorter->sort($this->styles);
    }

    /**
     * @return list<Asset>
     */
    public function registeredScripts(): array
    {
        return array_values($this->scripts);
    }

    /**
     * @return list<Asset>
     */
    public function registeredStyles(): array
    {
        return array_values($this->styles);
    }

    public function removeScripts(?string $handle = null, ?bool $footer = null): self
    {
        if ($handle !== null) {
            unset($this->scripts[$handle]);

            return $this;
        }

        if ($footer === null) {
            $this->scripts = [];

            return $this;
        }

        $this->scripts = array_filter(
            $this->scripts,
            static fn (Asset $asset): bool => $asset->footer() !== $footer
        );

        return $this;
    }

    public function removeStyles(?string $handle = null): self
    {
        if ($handle === null) {
            $this->styles = [];
        } else {
            unset($this->styles[$handle]);
        }

        return $this;
    }

    public function clear(): self
    {
        $this->scripts = [];
        $this->styles = [];

        return $this;
    }
}
