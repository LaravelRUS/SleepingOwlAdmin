<?php

namespace SleepingOwl\Admin\Templates;

use SleepingOwl\Admin\Assets\HtmlAttributes;
use SleepingOwl\Admin\Assets\MetaRenderer;
use SleepingOwl\Admin\Contracts\Template\AssetsInterface;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;

class Meta implements MetaInterface
{
    public const META_GROUP_NAME = 'meta';

    private MetaRenderer $renderer;

    public function __construct(
        private AssetsInterface $assets,
        ?MetaRenderer $renderer = null
    ) {
        $this->renderer = $renderer ?? new MetaRenderer(new HtmlAttributes());
    }

    public function assets(): AssetsInterface
    {
        return $this->assets;
    }

    public function addJs(
        $handle = false,
        $src = null,
        $dependency = null,
        $footer = true,
        array $attributes = []
    ): self {
        $this->assets->addJs($handle, $src, $dependency, $footer, $attributes);

        return $this;
    }

    public function addCss(
        $handle = null,
        $src = null,
        $dependency = null,
        array $attributes = []
    ): self {
        $this->assets->addCss($handle, $src, $dependency, $attributes);

        return $this;
    }

    public function loadPackage($names): self
    {
        $this->assets->loadPackage(...func_get_args());

        return $this;
    }

    public function putGlobalVar($key, $value): self
    {
        $this->assets->putGlobalVar($key, $value);

        return $this;
    }

    public function setTitle($title): self
    {
        $this->renderer->title((string) $title);

        return $this;
    }

    public function setMetaDescription($description): self
    {
        $this->renderer->description((string) $description);

        return $this;
    }

    public function setMetaKeywords($keywords): self
    {
        $this->renderer->keywords($keywords);

        return $this;
    }

    public function setMetaRobots($robots): self
    {
        $this->renderer->robots((string) $robots);

        return $this;
    }

    public function addMeta(array $attributes, $group = null): self
    {
        $this->renderer->meta($attributes, $group);

        return $this;
    }

    public function setFavicon(
        $url,
        $rel = 'shortcut icon',
        $type = 'image/x-icon'
    ): self {
        $this->renderer->favicon((string) $url, (string) $rel, (string) $type);

        return $this;
    }

    public function addTagToGroup(
        string $handle,
        string $content,
        array $params = [],
        ?string $dependency = null
    ): self {
        $this->renderer->put($handle, strtr($content, $params));

        return $this;
    }

    public function getGroup(string $group, string $handle): ?string
    {
        return $group === self::META_GROUP_NAME ? $this->renderer->get($handle) : null;
    }

    public function removeFromGroup(?string $handle = null): self
    {
        $this->renderer->remove($handle);

        return $this;
    }

    public function renderScripts($footer = false): string
    {
        return $this->assets->renderScripts($footer);
    }

    public function render(): string
    {
        return implode(PHP_EOL, [$this->renderer->render(), $this->assets->render()]);
    }

    public function __toString(): string
    {
        return $this->render();
    }
}
