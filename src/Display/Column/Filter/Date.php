<?php

namespace SleepingOwl\Admin\Display\Column\Filter;

use Exception;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\NamedColumnInterface;

class Date extends Text
{
    /**
     * @var string
     */
    protected $view = 'date';

    /**
     * @var string
     */
    protected $format;

    /**
     * @var string
     */
    protected $pickerFormat;

    /**
     * @var string
     */
    protected $searchFormat = 'Y-m-d';

    /**
     * @var bool
     */
    protected $seconds = false;

    /**
     * @var int
     */
    protected $width = 150;

    /**
     * @return string
     */
    public function getFormat()
    {
        return $this->format;
    }

    /**
     * @param string $format
     *
     * @return $this
     */
    public function setFormat($format)
    {
        $this->format = $format;

        return $this;
    }

    /**
     * @return bool
     */
    public function hasSeconds()
    {
        return $this->seconds;
    }

    /**
     * @param bool $seconds
     *
     * @return $this
     */
    public function setSeconds($seconds)
    {
        $this->seconds = (bool) $seconds;

        return $this;
    }

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        if (is_null($this->pickerFormat)) {
            return $this->generatePickerFormat();
        }

        return $this->pickerFormat;
    }

    /**
     * @param string $pickerFormat
     *
     * @return $this
     */
    public function setPickerFormat($pickerFormat)
    {
        $this->pickerFormat = $pickerFormat;

        return $this;
    }

    /**
     * @return int
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param int $width
     *
     * @return $this
     */
    public function setWidth($width)
    {
        intval($width);

        if ($width < 0) {
            $width = 0;
        }

        $this->width = (int) $width;

        return $this;
    }

    /**
     * @return string
     */
    public function getSearchFormat()
    {
        return $this->searchFormat;
    }

    /**
     * @param string $searchFormat
     *
     * @return $this
     */
    public function setSearchFormat($searchFormat)
    {
        $this->searchFormat = $searchFormat;

        return $this;
    }

    /**
     * @param RepositoryInterface  $repository
     * @param NamedColumnInterface $column
     * @param Builder              $query
     * @param string               $search
     * @param string               $fullSearch
     *
     * @return void
     */
    public function apply(
        RepositoryInterface $repository,
        NamedColumnInterface $column,
        Builder $query,
        $search,
        $fullSearch
    ) {
        if (empty($search)) {
            return;
        }

        try {
            $time = Carbon::createFromFormat($this->getFormat(), $search);
        } catch (Exception $e) {
            try {
                $time = Carbon::parse($search);
            } catch (Exception $e) {
                return;
            }
        }

        $time = $time->format($this->getSearchFormat());
        $name = $column->getName();
        if ($repository->hasColumn($name)) {
            $this->buildQuery($query, $name, $time);
        } elseif (strpos($name, '.') !== false) {
            $parts = explode('.', $name);
            $fieldName = array_pop($parts);
            $relationName = implode('.', $parts);

            $query->whereHas($relationName, function ($q) use ($name, $time) {
                $this->buildQuery($q, $name, $time);
            });
        }
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return parent::toArray() + [
            'seconds'      => $this->hasSeconds(),
            'format'       => $this->getFormat(),
            'pickerFormat' => $this->getPickerFormat(),
            'width'        => $this->getWidth(),
        ];
    }

    /**
     * @return string
     */
    protected function generatePickerFormat()
    {
        return strtr($this->getFormat(), [
            'i' => 'mm',
            's' => 'ss',
            'h' => 'hh',
            'H' => 'HH',
            'g' => 'h',
            'G' => 'H',
            'd' => 'DD',
            'j' => 'D',
            'm' => 'MM',
            'n' => 'M',
            'Y' => 'YYYY',
            'y' => 'YY',
        ]);
    }
}
