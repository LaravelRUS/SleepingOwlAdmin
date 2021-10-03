<?php

return [
    'dashboard' => 'Панель',
    '404'       => 'Страница не найдена.',

    'auth'      => [
        'title'           => 'Авторизация',
        'username'        => 'Логин',
        'password'        => 'Пароль',
        'login'           => 'Войти',
        'logout'          => 'Выйти',
        'wrong-username'  => 'Неверный логин',
        'wrong-password'  => 'или пароль',
        'since'           => 'Зарегистрирован :date',
    ],

    'model' => [
        'create'  => 'Создание документа в разделе :title',
        'edit'    => 'Редактирование записи в разделе :title',
    ],

    'links' => [
        'index_page' => 'На сайт',
    ],

    'env_editor' => [
        'title'  => 'ENV-редактор',
        'key'    => 'Ключ',
        'var'    => 'Значение',
    ],

    'ckeditor' => [
        'upload' => [
            'success' => 'Файл был успешно загружен: \\n- Размер: :size кб \\n- ширина/высота: :width x :height',

            'error' => [
                'common'              => 'Возникла ошибка при загрузке файла.',
                'wrong_extension'     => 'Файл ":file" имеет неверный тип.',
                'filesize_limit'      => 'Максимальный размер файла :size кб.',
                'filesize_limit_m'      => 'Максимальный размер файла :size Mb.',
                'imagesize_max_limit' => 'Ширина x Высота = :width x :height \\n Максимальный размер изображение должен быть: :maxwidth x :maxheight',
                'imagesize_min_limit' => 'Ширина x Высота = :width x :height \\n Минимальный размер изображение должен быть: :minwidth x :minheight',
            ],
        ],

        'image_browser' => [
            'title'    => 'Вставка изображения с сервера',
            'subtitle' => 'Выберите изображение для вставки',
        ],
    ],

    'table' => [
        'no-action'       => 'Нет действия',
        'deleted_all'     => 'Удалить выбранные',
        'make-action'     => 'Отправить',
        'delete-confirm'  => 'Вы уверены, что хотите удалить эту запись?',
        'action-confirm'  => 'Вы уверены, что хотите совершить это действие?',
        'delete-error'    => 'Невозможно удалить эту запись. Необходимо предварительно удалить все связанные записи.',
        'destroy-confirm' => 'Вы уверены, что хотите удалить эту запись?',
        'destroy-error'   => 'Невозможно удалить эту запись. Необходимо предварительно удалить все связанные записи.',
        'error'           => 'В процессе обработки вашего запроса возникла ошибка',
        'filter'          => 'Показать подобные записи',
        'filter-goto'     => 'Показать',
        'save'            => 'Сохранить',
        'all'             => 'Все',
        'processing'      => '<i class="fas fa-spinner fa-5x fa-spin"></i>',
        'loadingRecords'  => 'Загрузка...',
        'lengthMenu'      => 'Отображать _MENU_ записей',
        'zeroRecords'     => 'Не найдено подходящих записей.',
        'info'            => 'Записи с _START_ по _END_ из _TOTAL_',
        'infoEmpty'       => 'Нет записей',
        'infoFiltered'    => '(отфильтровано из _MAX_ записей)',
        'infoThousands'   => ',',
        'infoPostFix'     => '',
        'search'          => 'Поиск ',
        'emptyTable'      => 'Нет записей в таблице',

        'paginate' => [
            'first'     => 'Первая',
            'previous'  => '&larr;',
            'next'      => '&rarr;',
            'last'      => 'Последняя',
        ],

        'filters' => [
            'control' => 'Фильтр',
        ],
    ],

    'tree' => [
        'expand'   => 'Развернуть все',
        'reorderCompleted'   => 'Раздел перемещен',
        'collapse' => 'Свернуть все',
    ],

    'editable' => [
        'checkbox' => [
            'checked'   => 'Да',
            'unchecked' => 'Нет',
        ],
    ],

    'select' => [
        'nothing'     => 'Ничего не выбрано',
        'selected'    => 'выбрано',
        'placeholder' => 'Выберите из списка',
        'no_items'    => 'Нет элементов',
        'empty'       => 'пусто',
        'init'        => 'Выбрать',
        'limit'       => 'и еще ${count}',
        'more'       => 'и еще :count',
        'deselect'    => 'Сбросить',
        'short'       => 'Введите минимум :min символов',
    ],

    'image' => [
        'browse'         => 'Выбор изображения',
        'browseMultiple' => 'Выбор изображений',
        'remove'         => 'Удалить изображение',
        'removeMultiple' => 'Удалить изображения',
    ],

    'file' => [
        'browse'         => 'Выбор файла',
        'browseMultiple' => 'Выбор файлов',
        'remove'         => 'Удалить файл',
        'insert_link'    => 'Вставить ссылку',
    ],

    'button' => [
        'yes'       => 'Да',
        'no'        => 'Нет',
        'cancel'    => 'Отмена',
        'save'      => 'Сохранить',
        'new-entry' => 'Новая запись',
        'edit'      => 'Редактировать',
        'restore'   => 'Восстановить',
        'delete'    => 'Удалить',
        'destroy'   => 'Удалить полностью',
        'save_and_close'  => 'Сохранить и закрыть',
        'save_and_create' => 'Сохранить и создать',
        'moveUp'    => 'Подвинуть вверх',
        'moveDown'  => 'Подвинуть вниз',
        'download'  => 'Скачать',
        'add'       => 'Добавить',
        'remove'    => 'Удалить',
        'clear'     => 'Очистить',
    ],

    'message' => [
        'created' => 'Запись успешно создана',
        'updated' => 'Запись успешно обновлена',
        'deleted' => 'Запись успешно удалена',
        'destroyed' => 'Запись полностью удалена',
        'restored' => 'Запись успешно восстановлена',
        'something_went_wrong' => 'Что-то пошло не так!',
        'are_you_sure' => 'Вы уверены?',
        'access_denied' => 'Доступ запрещен',
        'validation_error' => 'Ошибка валидации',
    ],

    'related' => [
        'unique' => 'Данная связь уже существует',
    ],

    'seo' => [
        'title' => 'Заголовок',
        'description' => 'Описание',
    ],
];
