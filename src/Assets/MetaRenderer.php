<?php

namespace SleepingOwl\Admin\Assets;

final class MetaRenderer
{
    /** @var array<string, string> */
    private array $tags = [];

    private int $anonymousTags = 0;

    public function __construct(private HtmlAttributes $attributes)
    {
    }

    public function title(string $title): self
    {
        return $this->put('title', '<title>'.$this->escape($title).'</title>');
    }

    public function description(string $description): self
    {
        return $this->meta(['name' => 'description', 'content' => $description]);
    }

    /**
     * @param  list<string>|string  $keywords
     */
    public function keywords(array|string $keywords): self
    {
        $keywords = is_array($keywords) ? implode(', ', $keywords) : $keywords;

        return $this->meta(['name' => 'keywords', 'content' => $keywords]);
    }

    public function robots(string $robots): self
    {
        return $this->meta(['name' => 'robots', 'content' => $robots]);
    }

    /**
     * @param  array<int|string, mixed>  $attributes
     */
    public function meta(array $attributes, ?string $handle = null): self
    {
        $handle ??= $this->metaHandle($attributes);

        return $this->put($handle, '<meta'.$this->attributes->render($attributes).' />');
    }

    public function favicon(
        string $url,
        string $rel = 'shortcut icon',
        string $type = 'image/x-icon'
    ): self {
        $attributes = ['rel' => $rel, 'href' => $url, 'type' => $type];

        return $this->put('favicon', '<link'.$this->attributes->render($attributes).' />');
    }

    public function put(string $handle, string $html): self
    {
        $this->tags[$handle] = $html;

        return $this;
    }

    public function get(string $handle): ?string
    {
        return $this->tags[$handle] ?? null;
    }

    public function remove(?string $handle = null): self
    {
        if ($handle === null) {
            $this->tags = [];
        } else {
            unset($this->tags[$handle]);
        }

        return $this;
    }

    public function render(): string
    {
        return implode(PHP_EOL, $this->tags);
    }

    /**
     * @param  array<int|string, mixed>  $attributes
     */
    private function metaHandle(array $attributes): string
    {
        if (isset($attributes['name']) && is_string($attributes['name'])) {
            return $attributes['name'];
        }

        $this->anonymousTags++;

        return 'meta-'.$this->anonymousTags;
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
