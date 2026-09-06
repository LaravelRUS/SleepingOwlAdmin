<?php

namespace SleepingOwl\Tests\Helpers;

trait InteractsWithJsonProps
{
    protected function extractJsonProps(string $html): array
    {
        preg_match('/data-soa-vue-props="([^"]*)"/', $html, $matches);
        $this->assertArrayHasKey(1, $matches);

        $json = html_entity_decode($matches[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
    }
}
