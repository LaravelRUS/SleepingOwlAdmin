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
        return $this->loadFile($path, false);
    }

    public function loadFragment(string $path): AssetManifest
    {
        return $this->loadFile($path, true);
    }

    private function loadFile(string $path, bool $fragment): AssetManifest
    {
        if (! $this->files->isFile($path)) {
            throw $this->failure($path, 'file is missing', $fragment);
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

            return $fragment
                ? AssetManifest::fromFragment($manifest)
                : AssetManifest::fromArray($manifest);
        } catch (Throwable $exception) {
            throw $this->failure($path, $exception->getMessage(), $fragment, $exception);
        }
    }

    private function failure(
        string $path,
        string $reason,
        bool $fragment = false,
        ?Throwable $previous = null
    ): AssetManifestException {
        $type = $fragment ? 'manifest fragment' : 'manifest';
        $instruction = $fragment
            ? 'Publish or reinstall the external theme assets.'
            : 'Run `php artisan sleepingowl:update` to publish a complete asset set.';

        return new AssetManifestException(
            "Unable to load SleepingOwl asset {$type} [{$path}]: {$reason}. {$instruction}",
            0,
            $previous
        );
    }
}
