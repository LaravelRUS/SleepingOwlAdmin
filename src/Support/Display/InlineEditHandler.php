<?php

namespace SleepingOwl\Admin\Support\Display;

use Illuminate\Http\Request;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class InlineEditHandler
{
    public function __construct(private readonly EditableColumnResolver $columns)
    {
    }

    public function handle(ModelConfigurationInterface $model, Request $request): array
    {
        $field = (string) $request->input('name', '');
        $id = $request->input('pk');
        $column = $this->columns->find($model->fireDisplay(), $field);
        $item = $model->getRepository()->find($id);

        if (! $column instanceof ColumnEditableInterface || is_null($item)) {
            throw new NotFoundHttpException;
        }

        $column->setModel($item);
        $this->assertEditable($model, $column, $item);
        if (is_callable([$column, 'validate'])) {
            $column->validate($request);
        }

        if ($model->fireEvent('updating', true, $item, $request) === false) {
            return $this->rejectedPayload();
        }

        $newValue = $column->save($request);
        $model->fireEvent('updated', false, $item, $request);

        return $this->successPayload($model, $field, $id, $newValue);
    }

    private function successPayload(ModelConfigurationInterface $model, string $field, $id, $value): array
    {
        return [
            'status' => true,
            'name' => $this->fieldName($field),
            'newValue' => $value ?? $this->storedValue($model, $id, $field),
            'pk' => $id,
        ];
    }

    private function storedValue(ModelConfigurationInterface $model, $id, string $field)
    {
        $value = $model->getRepository()->find($id);

        foreach (explode('.', $field) as $segment) {
            if ($value === null) {
                return null;
            }

            $value = $value->{$segment};
        }

        return $value;
    }

    private function fieldName(string $field): string
    {
        $segments = explode('.', $field);

        return (string) end($segments);
    }

    private function rejectedPayload(): array
    {
        return [
            'status' => false,
            'reason' => 'Can not fire event: updating',
        ];
    }

    private function assertEditable(ModelConfigurationInterface $model, $column, $item): void
    {
        if (
            ! $model->isEditable($item)
            || ! $column->getVisibled()
            || $column->isColumnReadonly()
        ) {
            throw new NotFoundHttpException;
        }
    }
}
