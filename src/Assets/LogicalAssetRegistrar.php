<?php

namespace SleepingOwl\Admin\Assets;

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
     */
    public function register(array $logicalIds): ResolvedAssetBundle
    {
        $bundle = $this->resolver->resolveMany($logicalIds);

        $this->registerStyles($bundle->styles());
        $this->registerScripts($bundle->scripts());

        return $bundle;
    }

    /**
     * @param  list<string>  $urls
     */
    private function registerStyles(array $urls): void
    {
        $dependency = null;
        foreach ($urls as $url) {
            $handle = $this->handle('style', $url);
            $this->meta->addCss($handle, $url, $dependency);
            $dependency = $handle;
        }
    }

    /**
     * @param  list<string>  $urls
     */
    private function registerScripts(array $urls): void
    {
        $dependency = null;
        foreach ($urls as $url) {
            $handle = $this->handle('script', $url);
            $this->meta->addJs($handle, $url, $dependency);
            $dependency = $handle;
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
