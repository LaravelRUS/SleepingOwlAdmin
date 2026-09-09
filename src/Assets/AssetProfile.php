<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;

final class AssetProfile
{
    private const IDENTIFIER_PATTERN = '[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?';

    /** @var array<string, AssetBundle> */
    private array $entries;

    private function __construct(array $entries)
    {
        $this->entries = $entries;
    }

    public static function fromArray(mixed $profile, bool $requiresCore = true): self
    {
        if (! is_array($profile) || ! is_array($profile['entries'] ?? null)) {
            throw new InvalidArgumentException('Manifest profile must contain entries.');
        }

        $entries = [];
        foreach ($profile['entries'] as $logicalId => $bundle) {
            self::assertLogicalId($logicalId);
            $entries[$logicalId] = AssetBundle::fromArray($bundle);
        }

        if ($requiresCore && ! isset($entries['core'])) {
            throw new InvalidArgumentException('Manifest profile must contain the [core] entry.');
        }

        if (! $requiresCore && $entries === []) {
            throw new InvalidArgumentException('Manifest fragment profile must contain entries.');
        }

        return new self($entries);
    }

    /**
     * @return list<string>
     */
    public function entryIds(): array
    {
        return array_keys($this->entries);
    }

    public function has(string $logicalId): bool
    {
        self::assertLogicalId($logicalId);

        return isset($this->entries[$logicalId]);
    }

    public function bundle(string $logicalId): AssetBundle
    {
        self::assertLogicalId($logicalId);

        if (! isset($this->entries[$logicalId])) {
            throw new InvalidArgumentException("Unknown manifest entry [{$logicalId}].");
        }

        return $this->entries[$logicalId];
    }

    private static function assertLogicalId(mixed $logicalId): void
    {
        $pattern = '/\A(?:core|(?:feature|shared|theme):'.self::IDENTIFIER_PATTERN
            .'|feature:'.self::IDENTIFIER_PATTERN.':theme:'.self::IDENTIFIER_PATTERN
            .'|theme:'.self::IDENTIFIER_PATTERN.':overrides)\z/';

        if (! is_string($logicalId) || preg_match($pattern, $logicalId) !== 1) {
            $value = is_scalar($logicalId) ? (string) $logicalId : get_debug_type($logicalId);

            throw new InvalidArgumentException("Invalid manifest logical id [{$value}].");
        }
    }
}
