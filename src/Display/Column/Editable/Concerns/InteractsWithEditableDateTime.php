<?php

namespace SleepingOwl\Admin\Display\Column\Editable\Concerns;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

trait InteractsWithEditableDateTime
{
    protected $type = 'text';

    protected $combodateValue = '{}';

    public function getCombodateValue()
    {
        return $this->combodateValue;
    }

    public function setCombodateValue(array $value)
    {
        $this->combodateValue = json_encode($value);

        return $this;
    }

    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        return is_null($this->modifier)
            ? $this->getFormatedDate($this->getModelValue())
            : $this->modifier;
    }

    public function toArray(): array
    {
        return array_merge($this->editableColumnToArray(), [
            'value' => $this->getFormatedDate($this->getModelValue()),
            'format' => $this->getJsPickerFormat(),
            'viewformat' => $this->getJsPickerFormat(),
            'data-date-pickdate' => 'true',
            'data-date-picktime' => 'false',
            'data-date-useseconds' => $this->hasSeconds() ? 'true' : 'false',
            'type' => $this->type,
            'text' => $this->getModifierValue(),
            'combodateValue' => $this->getCombodateValue(),
            'editorDateFormat' => $this->getJsPickerFormat(),
        ]);
    }

    public function save(Request $request)
    {
        return $this->persistInlineFormValue(
            $request,
            fn (Request $mappedRequest) => parent::save($mappedRequest),
            fn (Request $mappedRequest) => parent::afterSave($mappedRequest)
        );
    }

    protected function getFormatedDate($date)
    {
        if (empty($date)) {
            return null;
        }

        if (! $date instanceof Carbon) {
            try {
                $date = Carbon::parse($date);
            } catch (\Exception $exception) {
                try {
                    $date = Carbon::createFromFormat($this->getFormat(), $date);
                } catch (\Exception $parseException) {
                    Log::error('Unable to parse date!', [
                        'format' => $this->getFormat(),
                        'date' => $date,
                        'exception' => $parseException,
                    ]);

                    return null;
                }
            }
        }

        return $date->timezone($this->getTimezone())->format($this->getPickerFormat());
    }
}
