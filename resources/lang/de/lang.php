<?php

return [
    'dashboard' => 'Dashboard',
    '404'       => 'Seite nicht gefunden.',

    'auth'      => [
        'title'           => 'Authorisierung',
        'username'        => 'Nutzername',
        'password'        => 'Passwort',
        'login'           => 'Login',
        'logout'          => 'Logout',
        'wrong-username'  => 'Falscher Nutzername',
        'wrong-password'  => 'oder Passwort',
        'since'           => 'Registriert am :date',
    ],

    'model' => [
        'create'  => 'Erstelle :title',
        'edit'    => 'Bearbeite :title',
    ],

    'links' => [
        'index_page' => 'Zur Seite',
    ],

    'env_editor' => [
        'title' => 'ENV-Editor',
        'key' => 'Schlüssel',
        'var' => 'Wert',
    ],

    'ckeditor' => [
        'upload' => [
            'success' => 'Datei wurde hochgeladen: \\n- Größe: :size kb \\n- Breite/Höhe: :width x :height',

            'error' => [
                'common' => 'Fehler beim hochladen der Datei.',
                'wrong_extension' => 'Datei ":file" hat die falsche Endung',
                'filesize_limit' => 'Maximal erlaubte Dateigröße beträgt :size kb.',
                'filesize_limit_m' => 'Maximal erlaubte Dateigröße beträgt :size Mb.',
                'imagesize_max_limit' => 'Breite x Höhe = :width x :height \\n Die maximale Bildgröße beträgt :maxwidth x :maxheight',
                'imagesize_min_limit' => 'Breite x Höhe = :width x :height \\n Die Bildgröße muss mindestens :minwidth x :minheight betragen',
            ],
        ],

        'image_browser' => [
            'title' => 'Bild vom Server auswählen',
            'subtitle' => 'Einzufügendes Bild auswählen',
        ],
    ],

    'table' => [
        'no-action' => 'Nichts tun',
        'deleted_all' => 'Ausgewählte Löschen',
        'make-action' => 'Abschicken',
        'delete-confirm' => 'Soll dieser Eintrag wirklich gelöscht werden?',
        'action-confirm' => 'Bist du sicher?',
        'delete-error' => 'Fehler beim löschen des Eintrages. Bitte zuerst alle verbunden Einträge löschen.',
        'destroy-confirm' => 'Soll dieser Eintrag wirklich für immer gelöscht werden?',
        'destroy-error' => 'Fehler beim löschen des Eintrages. Bitte zuerst alle verbunden Einträge löschen.',
        'error' => 'Es ist ein Fehler aufgetreten',
        'filter' => 'Zeige ähnlich Einträge',
        'filter-goto' => 'Zeige',
        'save' => 'Speichern',
        'all' => 'Alle',
        'processing' => '<i class="fas fa-spinner fa-5x fa-spin"></i>',
        'loadingRecords' => 'Lade...',
        'lengthMenu' => 'Zeige _MENU_ Einträge',
        'zeroRecords' => 'Keine passenden Einträge gefunden.',
        'info' => 'Zeige _START_ bis _END_ von _TOTAL_ Einträgen',
        'infoEmpty' => 'Keine Einträge',
        'infoFiltered' => '(gefiltert von _MAX_ Einträgen)',
        'infoThousands' => ',',
        'infoPostFix' => '',
        'search' => 'Suche ',
        'emptyTable' => 'Keine Einträge vorhanden',

        'paginate' => [
            'first' => 'Erste',
            'previous' => '&larr;',
            'next' => '&rarr;',
            'last' => 'Letzte',
        ],

        'filters' => [
            'control' => 'Filter',
        ],
    ],

    'tree' => [
        'expand' => 'Alle ausklappen',
        'collapse' => 'Alle einklappen',
    ],

    'editable' => [
        'checkbox' => [
            'checked' => 'Ja',
            'unchecked' => 'Nein',
        ],
    ],

    'select' => [
        'nothing' => 'Nichts ausgewählt',
        'selected' => 'ausgewählt',
        'placeholder' => 'Aus der Liste auswählen',
        'no_items'    => 'Keine Einträge',
        'init'        => 'Auswählen',
        'empty'       => 'leer',
        'limit'       => 'und ${count} mehr',
        'more'       => 'und :count mehr',
        'deselect'    => 'Abwählen',
        'short'       => 'Mindestens :min Zeichen eingeben',
    ],

    'image' => [
        'browse' => 'Bild auswählen',
        'browseMultiple' => 'Bilder auswählen',
        'remove' => 'Bild löschen',
        'removeMultiple' => 'Bilder löschen',
    ],

    'file' => [
        'browse' => 'Datei auswählen',
        'browseMultiple' => 'Dateien auswählen',
        'remove' => 'Datei löschen',
        'insert_link' => 'Link einfügen',
    ],

    'button' => [
        'yes'       => 'Ja',
        'no'        => 'Nein',
        'cancel'    => 'Abbrechen',
        'save' => 'Speichern',
        'new-entry' => 'Neuer Eintrag',
        'edit' => 'Bearbeiten',
        'restore' => 'Wiederherstellen',
        'delete' => 'Löschen',
        'destroy' => 'Löschen',
        'save_and_close' => 'Speichern und Schließen',
        'save_and_create' => 'Erstellen und Schließen',
        'moveUp' => 'Nach oben',
        'moveDown' => 'Nach unten',
        'download' => 'Download',
        'add' => 'Hinzufügen',
        'remove' => 'Entfernen',
        'clear' => 'Löschen',
    ],

    'message' => [
        'created' => 'Eintrag wurde erfolgreich erstellt',
        'updated' => 'Eintrag wurde erfolgreich aktualisiert',
        'deleted' => 'Eintrag wurde gelöscht',
        'destroyed' => 'Eintrag wurde gelöscht',
        'restored' => 'Eintrag wurde wieder hergestellt',
        'something_went_wrong' => 'Es ist etwas schief gelaufen!',
        'are_you_sure' => 'Bist du sicher?',
        'access_denied' => 'Zugriff verweigert',
        'validation_error' => 'Validation error',
    ],

    'related' => [
        'unique' => 'Verbindung ist nicht eineindeutig',
    ],

    'seo' => [
        'title' => 'Titel',
        'description' => 'Beschreibung',
    ],
];
