<?php

namespace SleepingOwl\Admin\Support\Display;

use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\FormElements;

final class EditableColumnResolver
{
    public function find($display, string $field): ?ColumnEditableInterface
    {
        if ($column = $this->findDirectColumn($display, $field)) {
            return $column;
        }

        foreach ($this->children($display) as $child) {
            if ($column = $this->find($child, $field)) {
                return $column;
            }
        }

        return null;
    }

    private function findDirectColumn($display, string $field): ?ColumnEditableInterface
    {
        if (! is_object($display) || ! is_callable([$display, 'getColumns'])) {
            return null;
        }

        foreach ($display->getColumns()->all() as $column) {
            if ($this->matches($column, $field)) {
                return $column;
            }
        }

        return null;
    }

    private function children($display): iterable
    {
        if ($display instanceof DisplayTabbed) {
            foreach ($display->getTabs() as $tab) {
                yield $tab->getContent();
            }
        }

        if ($display instanceof FormElements || $display instanceof Column) {
            yield from $display->getElements();
        }
    }

    private function matches($column, string $field): bool
    {
        return $column instanceof ColumnEditableInterface
            && $column->getName() === $field;
    }
}
