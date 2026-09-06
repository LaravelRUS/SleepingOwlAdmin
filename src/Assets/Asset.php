<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;

final class Asset
{
    public const SCRIPT = 'script';

    public const STYLE = 'style';

    /**
     * @param  list<string>  $dependencies
     * @param  array<int|string, mixed>  $attributes
     */
    private function __construct(
        private string $type,
        private string $handle,
        private string $source,
        private array $dependencies,
        private bool $footer,
        private array $attributes
    ) {
        $this->assertNotEmpty('handle', $handle);
        $this->assertNotEmpty('source', $source);
    }

    /**
     * @param  array|string|null  $dependencies
     * @param  array<int|string, mixed>  $attributes
     */
    public static function script(
        string $handle,
        string $source,
        array|string|null $dependencies = null,
        bool $footer = true,
        array $attributes = []
    ): self {
        return new self(
            self::SCRIPT,
            $handle,
            $source,
            self::normalizeDependencies($dependencies),
            $footer,
            $attributes
        );
    }

    /**
     * @param  array|string|null  $dependencies
     * @param  array<int|string, mixed>  $attributes
     */
    public static function style(
        string $handle,
        string $source,
        array|string|null $dependencies = null,
        array $attributes = []
    ): self {
        return new self(
            self::STYLE,
            $handle,
            $source,
            self::normalizeDependencies($dependencies),
            false,
            $attributes
        );
    }

    public function type(): string
    {
        return $this->type;
    }

    public function handle(): string
    {
        return $this->handle;
    }

    public function getHandle(): string
    {
        return $this->handle();
    }

    public function source(): string
    {
        return $this->source;
    }

    public function getSrc(): string
    {
        return $this->source();
    }

    /**
     * @return list<string>
     */
    public function dependencies(): array
    {
        return $this->dependencies;
    }

    /**
     * @return list<string>
     */
    public function getDependency(): array
    {
        return $this->dependencies();
    }

    public function hasDependency(?string $dependency = null): bool
    {
        return $dependency === null
            ? $this->dependencies !== []
            : in_array($dependency, $this->dependencies, true);
    }

    public function footer(): bool
    {
        return $this->footer;
    }

    public function isFooter(): bool
    {
        return $this->footer();
    }

    /**
     * @return array<int|string, mixed>
     */
    public function attributes(): array
    {
        return $this->attributes;
    }

    /**
     * @return array<int|string, mixed>
     */
    public function getAttributes(): array
    {
        return $this->attributes();
    }

    public function isScript(): bool
    {
        return $this->type === self::SCRIPT;
    }

    /**
     * @param  array|string|null  $dependencies
     * @return list<string>
     */
    private static function normalizeDependencies(array|string|null $dependencies): array
    {
        if ($dependencies === null) {
            return [];
        }

        $dependencies = is_array($dependencies) ? $dependencies : [$dependencies];
        $normalized = [];

        foreach ($dependencies as $dependency) {
            if (! is_string($dependency) || trim($dependency) === '') {
                continue;
            }

            $normalized[$dependency] = $dependency;
        }

        return array_values($normalized);
    }

    private function assertNotEmpty(string $field, string $value): void
    {
        if (trim($value) === '') {
            throw new InvalidArgumentException("Asset {$field} cannot be empty.");
        }
    }
}
