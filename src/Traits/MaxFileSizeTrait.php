<?php

namespace SleepingOwl\Admin\Traits;

trait MaxFileSizeTrait
{
    /**
     * @var number
     */
    protected $maxFileSize;

    /**
     * Возвращает максимальный размер загружаемого файла из конфигурации php.ini.
     *
     * @return number Максимальный размер загружаемого файла в килобайтах
     */
    public function getMaxFileSize()
    {
        if (! $this->maxFileSize) {
            try {
                $this->maxFileSize = $this->convertKB(ini_get('upload_max_filesize'));
            } catch (\Exception $e) {
                $this->maxFileSize = 5;
            }
        }

        return $this->maxFileSize;
    }

    /**
     * Конвертация значения размера загружаемого файла.
     *
     * @param  string  $value
     * @return number Размер файла в килобайтах
     */
    public function convertKB($value)
    {
        if (is_numeric($value)) {
            return $value;
        } else {
            $value_length = strlen($value);
            $qty = substr($value, 0, $value_length - 1);
            $unit = strtolower(substr($value, $value_length - 1));
            switch ($unit) {
                case 'k':
                    $qty = $qty;
                    break;
                case 'm':
                    $qty *= 1024;
                    break;
                case 'g':
                    $qty *= 1048576;
                    break;
            }

            return $qty;
        }
    }
}
