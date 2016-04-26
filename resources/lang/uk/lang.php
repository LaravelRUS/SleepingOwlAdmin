<?php

return [
    '404'      => 'Сторінка не знайдена.',
    'auth'     => [
        'title'            => 'Авторизація',
        'username'         => 'Логін',
        'password'         => 'Пароль',
        'login'            => 'Увійти',
        'logout'           => 'Вийти',
        'wrong-username'   => 'Не вірний логін',
        'wrong-password'   => 'або пароль',
    ],
    'ckeditor' => [
        'upload'        => [
            'success' => 'Файл був успішно завантажений: \\n - Розмір: :size кб \\n - ширина / висота: :width x :height',
            'error'   => [
                'common'              => 'Виникла помилка при спробі завантажити файл.',
                'wrong_extension'     => 'Файл ":file" має не вірний тип.',
                'filesize_limit'      => 'Максимальний розмір файлу: :size кб.',
                'imagesize_max_limit' => 'Ширина x Висота = :width x :height \\n Максимальний розмір зображення повинен бути: :maxwidth x :maxheight',
                'imagesize_min_limit' => 'Ширина x Висота = :width x :height \\n Мінімальний розмір зображення повинен бути: :minwidth x :minheight',
            ],
        ],
        'image_browser' => [
            'title'    => 'Вставка зображення з серверу',
            'subtitle' => 'Виберіть зображення для вставки',
        ],
    ],
    'table'    => [
        'new-entry'        => 'Новий запис',
        'edit'             => 'Редагувати',
        'restore'          => 'Відновити',
        'delete'           => 'Видалити',
        'delete-confirm'   => 'Ви впевнені що хочете видалити цей запис ? ',
        'delete-error'     => 'Неможливо видалити цей запис. Потрібно спочатку видалити всі пов\'язані записи.',
        'moveUp'           => 'Посунути вгору',
        'moveDown'         => 'Посунути вниз',
        'error'            => 'В процесі обробки вашого запиту виникла помилка',
        'filter'           => 'Показати подібні записи',
        'filter-goto'      => 'Перейти',
        'save'             => 'Зберегти',
        'cancel'           => 'Скасувати',
        'download'         => 'Завантажити',
        'all'              => 'Все',
        'processing'       => '<i class="fa fa-5x fa-circle-o-notch fa-spin"></i>',
        'loadingRecords'   => 'Зачекайте...',
        'lengthMenu'       => 'Відображати _MENU_ записів',
        'zeroRecords'      => 'Не знайдено підходящих записів.',
        'info'             => 'Записи починаючи з _START_ до _END_ з _TOTAL_',
        'infoEmpty'        => 'Записи починаючи з 0 по 0 з 0',
        'infoFiltered'     => '(відфільтровано з _MAX_ записів)',
        'infoThousands'    => '',
        'infoPostFix'      => '',
        'search'           => 'Пошук: ',
        'emptyTable'       => 'Немає записів',
        'paginate'         => [
            'first'    => 'Перша',
            'previous' => '&larr;',
            'next'     => '&rarr;',
            'last'     => 'Остання',
        ],
    ],
    'editable' => [
        'checkbox' => [
            'checked'   => 'Так',
            'unchecked' => 'Ні',
        ],
    ],
    'select'   => [
        'nothing'     => 'Нічого не вибрано',
        'selected'    => 'вибрано',
        'placeholder' => 'Виберіть зі списку',
    ],
    'image'    => [
        'browse'         => 'Вибір зображення',
        'browseMultiple' => 'Вибір зображення',
        'remove'         => 'Видалити',
    ],
    'file'     => [
        'browse' => 'Вибір файлу',
        'remove' => 'Видалити',
    ],
];
