<?php

namespace SleepingOwl\Admin\Display\Column;

use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use SleepingOwl\Admin\Traits\DateFormat;

class DateTime extends NamedColumn
{
    use DateFormat;
    /**
     * Datetime format.
     *
     * @var null|string
     */
    protected ?string $format = null;

    /**
     * Datetime timezone.
     *
     * @var string|null
     */
    protected ?string $timezone = null;

    /**
     * @var string
     */
    protected string $view = 'column.datetime';

    /**
     * @param  Model|null  $model
     * @return $this
     */
    public function setModel(?Model $model): DateTime
    {
        parent::setModel($model);
        $this->setHtmlAttribute('data-value', $this->getModelValue());

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        $value = $this->getModelValue();

        return parent::toArray() + [
            'value' => $this->getFormatedDate($value),
            'originalValue' => $value,
        ];
    }

    /**
     * @param  string  $date
     * @return null|string|void
     */
    protected function getFormatedDate(string $date)
    {
        if (empty($date)) {
            return;
        }

        if (! $date instanceof Carbon) {
            try {
                $date = Carbon::parse($date);
            } catch (Exception) {
                try {
                    $date = Carbon::createFromFormat($this->getFormat(), $date);
                } catch (Exception $e) {
                    Log::error('Unable to parse date!', [
                        'format' => $this->getFormat(),
                        'date' => $date,
                        'exception' => $e,
                    ]);

                    return;
                }
            }
        }

        return $date->timezone($this->getTimezone())->format($this->getFormat());
    }
}
