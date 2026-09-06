<?php

namespace SleepingOwl\Admin\Themes;

use InvalidArgumentException;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeAssetManifest
{
    private const IDENTIFIER_PATTERN = '/\A[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\z/';

    private ?string $themeEntry = null;

    /** @var array<string, string> */
    private array $sharedEntries = [];

    /** @var array<string, string> */
    private array $featureEntries = [];

    /**
     * @param  list<string>  $entries
     */
    public function __construct(private string $themeId, array $entries = [])
    {
        $this->assertIdentifier('theme', $themeId);

        foreach ($entries as $entry) {
            $this->addEntry($entry);
        }
    }

    public static function fromTheme(ThemeInterface $theme): self
    {
        return new self($theme->id(), $theme->assets());
    }

    public function themeId(): string
    {
        return $this->themeId;
    }

    /**
     * @return list<string>
     */
    public function entries(): array
    {
        return array_values(array_filter([
            ...array_values($this->sharedEntries),
            $this->themeEntry,
            ...array_values($this->featureEntries),
        ]));
    }

    /**
     * @param  list<string>  $features
     * @return list<string>
     */
    public function entriesFor(array $features): array
    {
        $entries = array_values($this->sharedEntries);

        if ($this->themeEntry !== null) {
            $entries[] = $this->themeEntry;
        }

        foreach ($this->uniqueFeatureIds($features) as $feature) {
            if (isset($this->featureEntries[$feature])) {
                $entries[] = $this->featureEntries[$feature];
            }
        }

        return $entries;
    }

    public function hasFeatureAdapter(string $feature): bool
    {
        $this->assertIdentifier('feature', $feature);

        return isset($this->featureEntries[$feature]);
    }

    public function featureEntry(string $feature): ?string
    {
        $this->assertIdentifier('feature', $feature);

        return $this->featureEntries[$feature] ?? null;
    }

    private function addEntry(mixed $entry): void
    {
        if (! is_string($entry)) {
            throw new InvalidArgumentException('Theme asset manifest entries must be strings.');
        }

        if ($entry === "theme:{$this->themeId}") {
            $this->addThemeEntry($entry);

            return;
        }

        if (str_starts_with($entry, 'shared:')) {
            $this->addSharedEntry($entry);

            return;
        }

        $this->addFeatureEntry($entry);
    }

    private function addSharedEntry(string $entry): void
    {
        $id = substr($entry, strlen('shared:'));
        $this->assertIdentifier('shared asset', $id);

        if (isset($this->sharedEntries[$id])) {
            throw new InvalidArgumentException("Duplicate shared asset entry [{$entry}].");
        }

        $this->sharedEntries[$id] = $entry;
    }

    private function addThemeEntry(string $entry): void
    {
        if ($this->themeEntry !== null) {
            throw new InvalidArgumentException("Duplicate theme asset entry [{$entry}].");
        }

        $this->themeEntry = $entry;
    }

    private function addFeatureEntry(string $entry): void
    {
        if (! preg_match('/\Afeature:([^:]+):theme:([^:]+)\z/', $entry, $matches)) {
            throw new InvalidArgumentException("Invalid theme asset entry [{$entry}].");
        }

        [$feature, $theme] = [$matches[1], $matches[2]];
        $this->assertIdentifier('feature', $feature);
        $this->assertOwnedByTheme($entry, $theme);

        if (isset($this->featureEntries[$feature])) {
            throw new InvalidArgumentException("Duplicate feature theme asset entry [{$entry}].");
        }

        $this->featureEntries[$feature] = $entry;
    }

    private function assertOwnedByTheme(string $entry, string $theme): void
    {
        if ($theme !== $this->themeId) {
            throw new InvalidArgumentException(
                "Theme asset entry [{$entry}] belongs to [{$theme}], expected [{$this->themeId}]."
            );
        }
    }

    /**
     * @param  list<string>  $features
     * @return list<string>
     */
    private function uniqueFeatureIds(array $features): array
    {
        $unique = [];

        foreach ($features as $feature) {
            $this->assertIdentifier('feature', $feature);
            $unique[$feature] = $feature;
        }

        return array_values($unique);
    }

    private function assertIdentifier(string $type, mixed $identifier): void
    {
        if (! is_string($identifier) || preg_match(self::IDENTIFIER_PATTERN, $identifier) !== 1) {
            $value = is_scalar($identifier) ? (string) $identifier : get_debug_type($identifier);

            throw new InvalidArgumentException("Invalid {$type} identifier [{$value}].");
        }
    }
}
