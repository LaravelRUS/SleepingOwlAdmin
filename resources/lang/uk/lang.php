<?php

return [
    'dashboard' => 'Панель',
    '404'       => 'Сторінку не знайдено.',

    'auth'      => [
        'title'           => 'Авторизація',
        'username'        => 'Логін',
        'password'        => 'Пароль',
        'login'           => 'Увійти',
        'logout'          => 'Вийти',
        'wrong-username'  => 'Не вірний логін',
        'wrong-password'  => 'або пароль',
        'since'           => 'Зареєстрований :date',
    ],

    'model' => [
        'create'  => 'Створення документа в розділі :title',
        'edit'    => 'Редагування запису в розділі :title',
    ],

    'links' => [
        'index_page' => 'До сайту',
    ],

    'env_editor' => [
        'title' => 'ENV-редактор',
        'key' => 'Ключ',
        'var' => 'Значення',
    ],

    'ckeditor' => [
        'upload' => [
            'success' => 'Файл був успішно завантажений: \\n - Розмір: :size кб \\n - ширина / висота: :width x :height',

            'error' => [
                'common' => 'Виникла помилка при спробі завантажити файл.',
                'wrong_extension' => 'Файл ":file" має не вірний тип.',
                'filesize_limit' => 'Максимальний розмір файлу: :size кб.',
                'filesize_limit_m' => 'Максимальний розмір файлу: :size Mb.',
                'imagesize_max_limit' => 'Ширина x Висота = :width x :height \\n Максимальний розмір зображення повинен бути: :maxwidth x :maxheight',
                'imagesize_min_limit' => 'Ширина x Висота = :width x :height \\n Мінімальний розмір зображення повинен бути: :minwidth x :minheight',
            ],
        ],

        'image_browser' => [
            'title' => 'Вставка зображення з серверу',
            'subtitle' => 'Виберіть зображення для вставки',
        ],
    ],

    'table' => [
        'no-action' => 'Без дiй',
        'deleted_all' => 'Видалити вибрані',
        'make-action' => 'Вiдправити',
        'delete-confirm' => 'Ви впевнені, що хочете видалити цей запис?',
        'action-confirm' => 'Ви впевнені, що хочете виконати цю дію?',
        'delete-error' => 'Неможливо видалити цей запис. Потрібно спочатку видалити всі пов\'язані записи.',
        'destroy-confirm' => 'Ви впевнені, що хочете видалити цей запис?',
        'destroy-error' => 'Неможливо видалити цей запис. Потрібно спочатку видалити всі пов\'язані записи.',
        'error' => 'В процесі обробки вашого запиту виникла помилка',
        'filter' => 'Показати подібні записи',
        'filter-goto' => 'Показати',
        'save' => 'Зберегти',
        'all' => 'Все',
        'processing' => '<i class="fas fa-spinner fa-5x fa-spin"></i>',
        'loadingRecords' => 'Завантаження...',
        'lengthMenu' => 'Відображати _MENU_ записів',
        'zeroRecords' => 'Не знайдено відповідних записів.',
        'info' => 'Записи починаючи з _START_ до _END_ із _TOTAL_',
        'infoEmpty' => 'Немає записів',
        'infoFiltered' => '(відфільтровано з _MAX_ записів)',
        'infoThousands' => ',',
        'infoPostFix' => '',
        'search' => 'Пошук ',
        'emptyTable' => 'Немає записів у таблиці',

        'paginate' => [
            'first' => 'Перша',
            'previous' => '&larr;',
            'next' => '&rarr;',
            'last' => 'Остання',
        ],

        'filters' => [
            'control' => 'Фільтр',
        ],
    ],

    'tree' => [
        'expand' => 'Розгорнути все',
        'reorderCompleted'   => 'Розділ переміщений',
        'collapse' => 'Згорнути все',
    ],

    'editable' => [
        'checkbox' => [
            'checked' => 'Так',
            'unchecked' => 'Ні',
        ],
    ],

    'select' => [
        'nothing' => 'Нічого не вибрано',
        'selected' => 'вибрано',
        'placeholder' => 'Виберіть зі списку',
        'no_items'    => 'Нема шо вибрати',
        'empty'       => 'порожньо',
        'init'        => 'Вибрати',
        'limit'       => 'і ще ${count}',
        'more'       => 'і ще :count',
        'deselect'    => 'Скинути',
        'short'       => 'Введіть мінімум :min символів',
    ],

    'image' => [
        'browse' => 'Вибір зображення',
        'browseMultiple' => 'Вибір зображень',
        'remove' => 'Видалити зображення',
        'removeMultiple' => 'Видалити усі зображення',
    ],

    'file' => [
        'browse' => 'Вибір файлу',
        'browseMultiple' => 'Вибір файлів',
        'remove' => 'Видалити файл',
        'insert_link' => 'Вставити лінк',
    ],

    'button' => [
        'yes'       => 'Так',
        'no'        => 'Ні',
        'cancel'    => 'Скасувати',
        'save' => 'Зберегти',
        'new-entry' => 'Новий запис',
        'edit' => 'Редагувати',
        'restore' => 'Відновити',
        'delete' => 'Видалити',
        'destroy' => 'Знищити',
        'save_and_close' => 'Зберегти та закрити',
        'save_and_create' => 'Зберегти та створити',
        'moveUp' => 'Посунути вгору',
        'moveDown' => 'Посунути вниз',
        'download' => 'Завантажити',
        'add' => 'Додати',
        'remove' => 'Видалити',
        'clear' => 'Очистити',
    ],

    'message' => [
        'created' => 'Запис успішно створено',
        'updated' => 'Запис успішно обновлено',
        'deleted' => 'Запис успішно видалено',
        'destroyed' => 'Запис успішно знищено',
        'restored' => 'Запис успішно відновлено',
        'something_went_wrong' => 'Щось пішло не так!',
        'are_you_sure' => 'Ви впевнені?',
        'access_denied' => 'Доступ заборонено',
        'validation_error' => 'Помилка валідації',
    ],

    'related' => [
        'unique' => 'Це відношення не є унікальним',
    ],

    'seo' => [
        'title' => 'Заголовок',
        'description' => 'Опис',
    ],
];
