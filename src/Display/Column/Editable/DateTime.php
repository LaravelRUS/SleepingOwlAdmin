<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Traits\DateFormat;
use SleepingOwl\Admin\Traits\DatePicker;

class DateTime extends EditableColumn implements ColumnEditableInterface
{
    use DatePicker, DateFormat;

    /**
     * @var string
     */
    protected $defaultValue;

    /**
     * @var string
     */
    protected $format = 'Y-m-d H:i:s';

    /**
     * @var string
     */
    protected $type = 'text';

    /**
     * @var string
     */
    protected $timezone;

    /**
     * @var bool
     */
    protected $seconds = false;

    /**
     * @var string
     */
    protected $view = 'column.editable.datetime';

    /**
     * @var string
     */
    protected $combodateValue = '{}';

    /**
     * Text constructor.
     *
     * @param  $name
     * @param  $label
     */
    public function __construct($name, $label = null, $small = null)
    {
        parent::__construct($name, $label, $small);

        $this->setFormat(config('sleeping_owl.datetimeFormat'));
        $this->setCombodateValue(['maxYear' => now()->addYears(100)->format('Y')]);
    }

    /**
     * @return string
     */
    public function getCombodateValue()
    {
        return $this->combodateValue;
    }

    /**
     * @param  array  $maxYear
     * @return $this
     */
    public function setCombodateValue(array $value)
    {
        $this->combodateValue = json_encode($value);

        return $this;
    }

    /**
     * @return mixed
     */
    public function getModifierValue()
    {
        if (is_callable($this->modifier)) {
            return call_user_func($this->modifier, $this);
        }

        if (is_null($this->modifier)) {
            return $this->getFormatedDate($this->getModelValue());
        }

        return $this->modifier;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array_merge(parent::toArray(), [
            'id' => $this->getModel()->getKey(),
            'value' => $this->getFormatedDate($this->getModelValue()),
            'isReadonly' => $this->isReadonly(),
            'url' => $this->getUrl(),

            'format' => $this->getJsPickerFormat(),
            'viewformat' => $this->getJsPickerFormat(),
            'data-date-pickdate' => 'true',
            'data-date-picktime' => 'false',
            'data-date-useseconds' => $this->hasSeconds() ? 'true' : 'false',
            'type' => $this->type,

            'text' => $this->getModifierValue(),
            'combodateValue' => $this->getCombodateValue(),
        ]);
    }

    /**
     * @param  string  $date
     * @return null|string
     */
    protected function getFormatedDate($date)
    {
        if (empty($date)) {
            return;
        }

        if (! $date instanceof Carbon) {
            try {
                $date = Carbon::parse($date);
            } catch (\Exception $e) {
                try {
                    $date = Carbon::createFromFormat($this->getFormat(), $date);
                } catch (\Exception $e) {
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

    /**
     * @return null
     */
    public function getValueFromModel()
    {
        $value = parent::getModelValue();
        if (! empty($value)) {
            return $this->parseValue($value);
        }
    }

    /**
     * @return bool
     */
    public function hasSeconds()
    {
        return (bool) $this->seconds;
    }

    /**
     * @param  bool  $seconds
     * @return $this
     */
    public function setSeconds($seconds)
    {
        $this->seconds = $seconds;

        return $this;
    }

    /**
     * @param  mixed  $value
     * @return void
     */
    public function setModelAttribute($value)
    {
        $value = ! empty($value)
            ? Carbon::createFromFormat($this->getPickerFormat(), $value, $this->getTimezone())
                ->timezone(config('app.timezone'))->format($this->getFormat())
            : null;

        parent::setModelAttribute($value);
    }

    /**
     * @param  Request  $request
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormException
     */
    public function save(Request $request)
    {
        $form = new FormDefault([
            new \SleepingOwl\Admin\Form\Element\Text(
                $this->getName()
            ),
        ]);

        $model = $this->getModel();

        if ($request->input('value')) {
            $value = Carbon::createFromFormat(
              $this->format, $request->input('value'), $this->getTimezone()
            );
        } else {
            $value = null;
        }

        $array = [];
        Arr::set($array, $this->getName(), $value);

        $request->merge($array);

        $form->setModelClass(get_class($model));
        $form->initialize();
        $form->setId($model->getKey());

        $form->saveForm($request);
    }

    /**
     * @return string
     */
    public function getPickerFormat()
    {
        return $this->pickerFormat ?: config('sleeping_owl.datetimeFormat');
    }

    /**
     * @return $this
     *
     * SMELLS This function does more than it says.
     */
    public function setCurrentDate()
    {
        $this->defaultValue = Carbon::now()->timezone($this->getTimezone())->format($this->getFormat());

        return $this;
    }
}
