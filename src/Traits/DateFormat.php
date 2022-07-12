<?php

namespace SleepingOwl\Admin\Traits;

trait DateFormat
{
    /**
     * @return string
     */
    public function getFormat(): string
    {
        if (is_null($this->format)) {
            $this->format = config('sleeping_owl.datetimeFormat');
        }

        return $this->format;
    }

    /**
     * @param string|null $format
     * @return $this
     */
    public function setFormat(?string $format): DateFormat
    {
        $this->format = $format;

        return $this;
    }

    /**
     * @return string
     */
    public function getTimezone(): string
    {
        if (is_null($this->timezone)) {
            $this->timezone = config('sleeping_owl.timezone');
        }

        return $this->timezone;
    }

    /**
     * @param string $timezone
     * @return $this
     */
    public function setTimezone(string $timezone): DateFormat
    {
        $this->timezone = $timezone;

        return $this;
    }
}
