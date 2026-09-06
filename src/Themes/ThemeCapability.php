<?php

namespace SleepingOwl\Admin\Themes;

enum ThemeCapability: string
{
    case Tabs = 'tabs';
    case Tooltip = 'tooltip';
    case Dropdown = 'dropdown';
    case Modal = 'modal';
    case Notification = 'notification';
    case Icons = 'icons';
    case TablePresentation = 'table-presentation';
}
