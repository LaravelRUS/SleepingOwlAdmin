<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;

final class AssetManifest
{
    public const SCHEMA_VERSION = 1;

    private const BUILD_ID_PATTERN = '/\Asha256:[a-f0-9]{64}\z/';

    /** @var array<string, AssetProfile> */
    private array $profiles;

    private function __construct(
        private string $packageVersion,
        private string $buildId,
        array $profiles
    ) {
        $this->profiles = $profiles;
    }

    public static function fromArray(array $manifest): self
    {
        return self::create($manifest, true);
    }

    public static function fromFragment(array $manifest): self
    {
        return self::create($manifest, false);
    }

    private static function create(array $manifest, bool $requiresCore): self
    {
        self::assertSchemaVersion($manifest['schema_version'] ?? null);
        $packageVersion = self::normalizePackageVersion($manifest['package_version'] ?? null);
        $buildId = self::normalizeBuildId($manifest['build_id'] ?? null);
        $profiles = self::profiles($manifest['profiles'] ?? null, $requiresCore);

        return new self($packageVersion, $buildId, $profiles);
    }

    public function schemaVersion(): int
    {
        return self::SCHEMA_VERSION;
    }

    public function packageVersion(): string
    {
        return $this->packageVersion;
    }

    public function buildId(): string
    {
        return $this->buildId;
    }

    /**
     * @return list<string>
     */
    public function profileIds(): array
    {
        return array_keys($this->profiles);
    }

    public function profile(string $profile): AssetProfile
    {
        if (! isset($this->profiles[$profile])) {
            throw new InvalidArgumentException("Unknown asset profile [{$profile}].");
        }

        return $this->profiles[$profile];
    }

    private static function assertSchemaVersion(mixed $version): void
    {
        if ($version !== self::SCHEMA_VERSION) {
            throw new InvalidArgumentException(
                sprintf(
                    'Unsupported asset manifest schema [%s].',
                    var_export($version, true)
                )
            );
        }
    }

    private static function normalizePackageVersion(mixed $version): string
    {
        if (! is_string($version) || trim($version) === '') {
            throw new InvalidArgumentException('Asset manifest package version is required.');
        }

        return $version;
    }

    private static function normalizeBuildId(mixed $buildId): string
    {
        if (! is_string($buildId) || preg_match(self::BUILD_ID_PATTERN, $buildId) !== 1) {
            throw new InvalidArgumentException('Invalid asset manifest build id.');
        }

        return $buildId;
    }

    /**
     * @return array<string, AssetProfile>
     */
    private static function profiles(mixed $profiles, bool $requiresCore): array
    {
        if (! is_array($profiles) || $profiles === []) {
            throw new InvalidArgumentException('Asset manifest profiles are required.');
        }

        $result = [];
        foreach ($profiles as $name => $profile) {
            if (! is_string($name) || preg_match('/\A[a-z][a-z0-9_-]*\z/', $name) !== 1) {
                throw new InvalidArgumentException('Invalid asset profile name.');
            }

            $result[$name] = AssetProfile::fromArray($profile, $requiresCore);
        }

        return $result;
    }
}
