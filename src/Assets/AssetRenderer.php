<?php

namespace SleepingOwl\Admin\Assets;

use Illuminate\Contracts\Routing\UrlGenerator;

final class AssetRenderer
{
    public function __construct(
        private UrlGenerator $url,
        private HtmlAttributes $attributes
    ) {
    }

    public function render(Asset $asset): string
    {
        return $asset->isScript()
            ? $this->renderScript($asset)
            : $this->renderStyle($asset);
    }

    /**
     * @param  iterable<Asset>  $assets
     */
    public function renderMany(iterable $assets): string
    {
        $rendered = [];

        foreach ($assets as $asset) {
            $rendered[] = $this->render($asset);
        }

        return implode(PHP_EOL, $rendered);
    }

    private function renderScript(Asset $asset): string
    {
        $attributes = $asset->attributes();
        $attributes['src'] = $this->url->asset($asset->source());

        return '<script'.$this->attributes->render($attributes).'></script>';
    }

    private function renderStyle(Asset $asset): string
    {
        $attributes = $asset->attributes() + [
            'media' => 'all',
            'type' => 'text/css',
            'rel' => 'stylesheet',
        ];
        $attributes['href'] = $this->url->asset($asset->source());

        return '<link'.$this->attributes->render($attributes).'>';
    }
}
