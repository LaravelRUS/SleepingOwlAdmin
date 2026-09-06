<?php

namespace SleepingOwl\Admin\Assets;

final class AssetPackageRegistry
{
    /** @var array<string, AssetPackage> */
    private array $packages = [];

    public function add(string|AssetPackage $package): AssetPackage
    {
        $package = is_string($package) ? AssetPackage::create($package) : $package;
        $this->packages[$package->getName()] = $package;

        return $package;
    }

    public function load(string $name): ?AssetPackage
    {
        return $this->packages[$name] ?? null;
    }

    /**
     * @param  array|string  $names
     * @return list<AssetPackage>
     */
    public function resolve(array|string $names): array
    {
        $resolved = [];
        $visiting = [];

        foreach ((array) $names as $name) {
            if (is_string($name)) {
                $this->resolvePackage($name, $resolved, $visiting);
            }
        }

        return array_values($resolved);
    }

    /**
     * @param  array<string, AssetPackage>  $resolved
     * @param  array<string, true>  $visiting
     */
    private function resolvePackage(string $name, array &$resolved, array &$visiting): void
    {
        if (isset($resolved[$name]) || isset($visiting[$name])) {
            return;
        }

        $package = $this->load($name);
        if ($package === null) {
            return;
        }

        $visiting[$name] = true;
        foreach ($package->getDependencies() as $dependency) {
            $this->resolvePackage($dependency, $resolved, $visiting);
        }

        unset($visiting[$name]);
        $resolved[$name] = $package;
    }
}
