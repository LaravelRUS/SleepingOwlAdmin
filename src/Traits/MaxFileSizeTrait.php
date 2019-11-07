<?php

namespace SleepingOwl\Admin\Traits;

trait MaxFileSizeTrait
{

    /**
     * @var number
     */
    protected $maxFileSize;


    /**
     * @return number
     */
    public function getMaxFileSize()
    {
        if (! $this->maxFileSize) {
            try {
                $this->maxFileSize = $this->convertMB(ini_get('upload_max_filesize'));
            } catch (\Exception $e) {
                $this->maxFileSize = 5;
            }
        }
        return $this->maxFileSize;
    }

    /**
      * Конвертирование значения
      * максимального размера загружаемого файла
      */
    function convertMB( $value ) {
        if ( is_numeric( $value ) ) {
            return $value;
        } else {
            $value_length = strlen($value);
            $qty = substr( $value, 0, $value_length - 1 );
            $unit = strtolower( substr( $value, $value_length - 1 ) );
            switch ( $unit ) {
                case 'k':
                $qty /= 1024;
                break;
                case 'm':
                $qty = $qty;
                break;
                case 'g':
                $qty *= 1024;
                break;
            }
            return $qty;
        }
    }
}
