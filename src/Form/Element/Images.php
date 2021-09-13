<?php

namespace SleepingOwl\Admin\Form\Element;

use Illuminate\Http\Request;

class Images extends Image
{
    /**
     * @var string
     */
    protected $view = 'form.element.images';

    protected $draggable = true;

    /**
     * @return bool
     */
    public function getDraggable()
    {
        return (bool) $this->draggable;
    }

    /**
     * @param  bool  $draggable
     * @return $this
     */
    public function setDraggable($draggable)
    {
        $this->draggable = $draggable;

        return $this;
    }

    /**
     * Store array of images as json string.
     *
     * @return $this
     */
    public function storeAsJson()
    {
        $this->mutateValue(function ($value) {
            return json_encode($value);
        });

        return $this;
    }

    /**
     * Store array of images as coma separator.
     *
     * @deprecated
     *
     * @return $this
     */
    public function storeAsComaSeparatedValue()
    {
        /* deprecated this logic */
        // $this->mutateValue(function ($value) {
        //     return implode(',', $value);
        // });

        return $this;
    }

    /**
     * @return string
     */
    public function getValueFromModel()
    {
        $images = $value = parent::getValueFromModel();

        if (is_null($value)) {
            $images = [];
        } elseif (is_string($value)
            && (($images = json_decode($value)) === false
                || is_null($images))
        ) {
            $images = preg_split('/,/', $value, -1, PREG_SPLIT_NO_EMPTY);
        }

        return $images;
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function save(Request $request)
    {
        $name = $this->getName();
        $value = $request->input($name, '');

        if (! empty($value)) {
            $value = explode(',', $value);
        } else {
            $value = [];
        }

        $request->merge([$name => $value]);

        parent::save($request);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array_merge(parent::toArray(), [
            'draggable' => $this->getDraggable(),
        ]);
    }
}
