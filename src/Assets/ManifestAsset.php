<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;

final class ManifestAsset
{
    private const CHECKSUM_PATTERN = '/\Asha256:[a-f0-9]{64}\z/';

    private const FILE_PATTERN = '/\A[a-zA-Z0-9][a-zA-Z0-9._\/-]*\z/';

    private const VERSION_PATTERN = '/\A[a-f0-9]{32,64}\z/';

    private function __construct(
        private string $file,
        private string $version,
        private string $checksum
    ) {
    }

    public static function fromArray(mixed $asset, string $extension): self
    {
        if (! is_array($asset)) {
            throw new InvalidArgumentException('Manifest asset must be an object.');
        }

        $file = $asset['file'] ?? null;
        $version = $asset['version'] ?? null;
        $checksum = $asset['checksum'] ?? null;

        self::assertFile($file, $extension);
        self::assertMatches('version', $version, self::VERSION_PATTERN);
        self::assertMatches('checksum', $checksum, self::CHECKSUM_PATTERN);

        return new self($file, $version, $checksum);
    }

    public function file(): string
    {
        return $this->file;
    }

    public function version(): string
    {
        return $this->version;
    }

    public function checksum(): string
    {
        return $this->checksum;
    }

    private static function assertFile(mixed $file, string $extension): void
    {
        if (! is_string($file) || preg_match(self::FILE_PATTERN, $file) !== 1) {
            throw new InvalidArgumentException('Manifest asset file must be a relative path.');
        }

        $segments = explode('/', $file);
        if (in_array('', $segments, true)
            || in_array('.', $segments, true)
            || in_array('..', $segments, true)
        ) {
            throw new InvalidArgumentException('Manifest asset file cannot traverse directories.');
        }

        if (pathinfo($file, PATHINFO_EXTENSION) !== $extension) {
            throw new InvalidArgumentException("Manifest asset [{$file}] must use .{$extension}.");
        }
    }

    private static function assertMatches(string $name, mixed $value, string $pattern): void
    {
        if (! is_string($value) || preg_match($pattern, $value) !== 1) {
            throw new InvalidArgumentException("Invalid manifest asset {$name}.");
        }
    }
}
