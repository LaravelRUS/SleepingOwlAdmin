<?php

namespace SleepingOwl\Admin\Assets;

use Illuminate\Filesystem\Filesystem;
use JsonException;
use SleepingOwl\Admin\Exceptions\AssetManifestException;
use Throwable;

final class AssetManifestLoader
{
    public function __construct(private Filesystem $files)
    {
    }

    public function load(string $path): AssetManifest
    {
        if (! $this->files->isFile($path)) {
            throw $this->failure($path, 'file is missing');
        }

        try {
            $manifest = json_decode(
                $this->files->get($path),
                true,
                512,
                JSON_THROW_ON_ERROR
            );

            if (! is_array($manifest)) {
                throw new JsonException('Manifest root must be an object.');
            }

            return AssetManifest::fromArray($manifest);
        } catch (Throwable $exception) {
            throw $this->failure($path, $exception->getMessage(), $exception);
        }
    }

    private function failure(
        string $path,
        string $reason,
        ?Throwable $previous = null
    ): AssetManifestException {
        return new AssetManifestException(
            "Unable to load SleepingOwl asset manifest [{$path}]: {$reason}. "
            .'Run `php artisan sleepingowl:update` to publish a complete asset set.',
            0,
            $previous
        );
    }
}
