<?php

namespace SleepingOwl\Admin\Display\Column\Editable;

use Carbon\Carbon;
use Illuminate\Http\Request;
use SleepingOwl\Admin\Form\FormDefault;
use SleepingOwl\Admin\Traits\DateFormat;
use SleepingOwl\Admin\Traits\DatePicker;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

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
    //    protected $format = 'YYYY-MM-DD';

    protected $type = 'combodate';

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
     * Text constructor.
     *
     * @param             $name
     * @param             $label
     */
    public function __construct($name, $label = null)
    {
        parent::__construct($name, $label);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $value = $this->getModelValue();

        return parent::toArray() + [
                'id'             => $this->getModel()->getKey(),
                'value'          => $this->getFormatedDate($value),
                'isEditable'     => $this->getModelConfiguration()->isEditable($this->getModel()),
                'url'            => $this->getUrl(),

                'format'          => $this->getJsPickerFormat(),
                'viewformat'      => $this->getJsPickerFormat(),
                'data-date-pickdate'   => 'true',
                'data-date-picktime'   => 'false',
                'data-date-useseconds' => $this->hasSeconds() ? 'true' : 'false',
                'type'                 => $this->type,
            ];
    }

    /**
     * @param string $date
     *
     * @return null|string
     */
    protected function getFormatedDate($date)
    {
        if (! is_null($date)) {
            if (! $date instanceof Carbon) {
                $date = Carbon::parse($date);
            }

            $date = $date->timezone($this->getTimezone())->format($this->getFormat());
        }

        return $date;
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
     * @param bool $seconds
     *
     * @return $this
     */
    public function setSeconds($seconds)
    {
        $this->seconds = $seconds;

        return $this;
    }

    /**
     * @param mixed $value
     *
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
     * @param Request $request
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

        $request->offsetSet($this->getName(), $request->input('value', null));

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
