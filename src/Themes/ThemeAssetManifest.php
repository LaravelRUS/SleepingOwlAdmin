<?php

namespace SleepingOwl\Admin\Themes;

use InvalidArgumentException;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ThemeAssetManifest
{
    private const IDENTIFIER_PATTERN = '/\A[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\z/';

    private string $themeEntry;

    private ?string $overrideEntry = null;

    /** @var array<string, string> */
    private array $sharedEntries = [];

    /** @var array<string, string> */
    private array $featureEntries = [];

    /**
     * @param  list<string>  $entries
     */
    public function __construct(private string $themeName, array $entries = [])
    {
        $this->assertIdentifier('theme', $themeName);
        $this->themeEntry = "theme:{$themeName}";

        foreach ($entries as $entry) {
            $this->addEntry($entry);
        }
    }

    public static function fromTheme(string $themeName, ThemeInterface $theme): self
    {
        return new self($themeName, $theme->assets());
    }

    public function themeName(): string
    {
        return $this->themeName;
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
            $this->overrideEntry,
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

        if ($this->overrideEntry !== null) {
            $entries[] = $this->overrideEntry;
        }

        return $entries;
    }

    /**
     * @return list<string>
     */
    public function sharedEntries(): array
    {
        return array_values($this->sharedEntries);
    }

    public function themeEntry(): string
    {
        return $this->themeEntry;
    }

    /**
     * @return list<string>
     */
    public function featureEntries(): array
    {
        return array_values($this->featureEntries);
    }

    public function overrideEntry(): ?string
    {
        return $this->overrideEntry;
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

        if (str_starts_with($entry, 'shared:')) {
            $this->addSharedEntry($entry);

            return;
        }

        if ($entry === 'theme:overrides') {
            if ($this->overrideEntry !== null) {
                throw new InvalidArgumentException('Duplicate theme override declaration.');
            }

            $this->overrideEntry = "theme:{$this->themeName}:overrides";

            return;
        }

        if (str_starts_with($entry, 'feature:')) {
            $this->addFeatureEntry($entry);

            return;
        }

        throw new InvalidArgumentException("Invalid theme asset declaration [{$entry}].");
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

    private function addFeatureEntry(string $entry): void
    {
        if (! preg_match('/\Afeature:([^:]+)\z/', $entry, $matches)) {
            throw new InvalidArgumentException(
                "Theme asset declaration [{$entry}] must not contain a theme name."
            );
        }

        $feature = $matches[1];
        $this->assertIdentifier('feature', $feature);

        if (isset($this->featureEntries[$feature])) {
            throw new InvalidArgumentException("Duplicate feature asset declaration [{$entry}].");
        }

        $this->featureEntries[$feature] = "feature:{$feature}:theme:{$this->themeName}";
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
