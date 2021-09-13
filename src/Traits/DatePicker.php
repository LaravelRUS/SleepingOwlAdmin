<?php

namespace SleepingOwl\Admin\Traits;

trait DatePicker
{
    /**
     * @var string
     */
    protected $pickerFormat;

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        return $this->generatePickerFormat(
            $this->pickerFormat
        );
    }

    /**
     * @return string
     */
    public function getJsPickerFormat()
    {
        return $this->generatePickerFormat(
            $this->getPickerFormat()
        );
    }

    /**
     * @param  string  $pickerFormat
     * @return $this
     */
    public function setPickerFormat($pickerFormat)
    {
        $this->pickerFormat = $pickerFormat;

        return $this;
    }

    /**
     * @param  string  $format
     * @return string
     */
    protected function generatePickerFormat($format)
    {
        return strtr($format, [
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
