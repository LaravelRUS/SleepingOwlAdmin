<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;

final class LogicalAssetRegistrar
{
    public function __construct(
        private AssetManifestResolver $resolver,
        private MetaInterface $meta
    ) {
    }

    /**
     * @param  list<string>  $logicalIds
     * @param  array<string, string>  $aliases
     */
    public function register(array $logicalIds, array $aliases = []): ResolvedAssetBundle
    {
        $bundle = $this->resolver->resolveMany($logicalIds);
        $resolvedAliases = $this->resolveAliases($logicalIds, $aliases);

        $this->registerStyles($bundle->styles(), $resolvedAliases['styles']);
        $this->registerScripts($bundle->scripts(), $resolvedAliases['scripts']);

        return $bundle;
    }

    /**
     * @param  list<string>  $urls
     * @param  array<string, string>  $aliases
     */
    private function registerStyles(array $urls, array $aliases): void
    {
        $dependency = null;
        foreach ($urls as $url) {
            $handle = $aliases[$url] ?? $this->handle('style', $url);
            $this->meta->addCss($handle, $url, $dependency);
            $dependency = $handle;
        }
    }

    /**
     * @param  list<string>  $urls
     * @param  array<string, string>  $aliases
     */
    private function registerScripts(array $urls, array $aliases): void
    {
        $dependency = null;
        foreach ($urls as $url) {
            $handle = $aliases[$url] ?? $this->handle('script', $url);
            $this->meta->addJs($handle, $url, $dependency);
            $dependency = $handle;
        }
    }

    /**
     * @param  list<string>  $logicalIds
     * @param  array<string, string>  $aliases
     * @return array{scripts: array<string, string>, styles: array<string, string>}
     */
    private function resolveAliases(array $logicalIds, array $aliases): array
    {
        $resolved = ['scripts' => [], 'styles' => []];
        foreach ($aliases as $logicalId => $handle) {
            $this->assertAlias($logicalIds, $logicalId, $handle);
            $bundle = $this->resolver->resolve($logicalId);
            $this->mapAlias($resolved['scripts'], $bundle->scripts(), $handle, 'script');
            $this->mapAlias($resolved['styles'], $bundle->styles(), $handle, 'style');
        }

        return $resolved;
    }

    /**
     * @param  array<string, string>  $aliases
     * @param  list<string>  $urls
     */
    private function mapAlias(array &$aliases, array $urls, string $handle, string $type): void
    {
        if (count($urls) > 1) {
            throw new InvalidArgumentException(
                "A logical {$type} alias requires exactly one or zero resolved files."
            );
        }

        if ($urls !== []) {
            $aliases[$urls[0]] = $handle;
        }
    }

    /**
     * @param  list<string>  $logicalIds
     */
    private function assertAlias(array $logicalIds, mixed $logicalId, mixed $handle): void
    {
        if (! is_string($logicalId) || ! in_array($logicalId, $logicalIds, true)) {
            throw new InvalidArgumentException(
                'Asset handle aliases must target a registered logical id.'
            );
        }

        if (! is_string($handle) || trim($handle) === '') {
            throw new InvalidArgumentException('Asset handle aliases must be non-empty strings.');
        }
    }

    private function handle(string $type, string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH) ?: $url;
        $identity = preg_replace(
            '#/profiles/(?:production|development)/#',
            '/profiles/selected/',
            $path
        );

        return "sleepingowl-logical-{$type}-".substr(hash('sha256', $identity), 0, 16);
    }
}
