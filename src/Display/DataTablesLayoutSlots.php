<?php

namespace SleepingOwl\Admin\Display;

use InvalidArgumentException;

final class DataTablesLayoutSlots
{
    private const NAMESPACE = 'datatable.';

    private const POSITION_PATTERN = '/\A(top|bottom)[1-9][0-9]*(Start|End)?\z/';

    /**
     * Separate regular Blade sections from DataTables layout slots.
     *
     * @param  array<string, array<int, string>>  $blocks
     * @return array{sections: array<string, array<int, string>>, slots: array<string, array<int, string>>}
     */
    public static function split(array $blocks): array
    {
        $sections = [];
        $slots = [];

        foreach ($blocks as $placement => $contents) {
            if (! is_string($placement) || ! str_starts_with($placement, self::NAMESPACE)) {
                $sections[$placement] = $contents;

                continue;
            }

            $position = substr($placement, strlen(self::NAMESPACE));
            if (! self::isPosition($position)) {
                throw new InvalidArgumentException(
                    "Invalid DataTables layout placement [{$placement}]."
                );
            }

            $slots[$position] = array_merge($slots[$position] ?? [], $contents);
        }

        return ['sections' => $sections, 'slots' => $slots];
    }

    public static function isPlacement(string $placement): bool
    {
        if (! str_starts_with($placement, self::NAMESPACE)) {
            return false;
        }

        return self::isPosition(substr($placement, strlen(self::NAMESPACE)));
    }

    public static function isPosition(string $position): bool
    {
        return preg_match(self::POSITION_PATTERN, $position) === 1;
    }
}
