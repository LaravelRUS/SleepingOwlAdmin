<?php

namespace SleepingOwl\Admin\Traits;

trait DateFormat
{
    /**
     * @return string
     */
    public function getFormat()
    {
        if (is_null($this->format)) {
            $this->format = config('sleeping_owl.datetimeFormat');
        }

        return $this->format;
    }

    /**
     * @param  string|null  $format
     * @return $this
     */
    public function setFormat($format)
    {
        $this->format = $format;

        return $this;
    }

    /**
     * @return string
     */
    public function getTimezone()
    {
        if (is_null($this->timezone)) {
            $this->timezone = config('sleeping_owl.timezone');
        }

        return $this->timezone;
    }

    /**
     * @param  string  $timezone
     * @return $this
     */
    public function setTimezone($timezone)
    {
        $this->timezone = $timezone;

        return $this;
    }
}
