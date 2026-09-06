# Native admin events

`Admin.Events` сохраняет compatibility API текущего major:

```js
Admin.Events.on('datatables::draw', callback, context)
Admin.Events.off('datatables::draw', callback)
Admin.Events.fire('datatables::draw', table)
```

Внутри больше нет собственного массива-dispatcher или jQuery event bus. Один `AdminEventBus` использует нативный `EventTarget`; в браузере target — `document`. Старые callbacks получают параметры позиционно и вызываются с переданным `context`.

Тот же вызов доступен нативному коду как `CustomEvent`:

```js
document.addEventListener('datatables::draw', (event) => {
    const [table] = event.detail
})
```

`event.detail` всегда является массивом аргументов `fire(type, ...args)`. `off(type, callback)`, `off(type)` и `off()` сохраняют прежние уровни очистки. Повторная регистрация одного callback разрешена; удаление callback снимает все его регистрации для указанного type.

Имена `datatables::*`, `bootstrap::*` и остальные legacy names пока не переименовываются. Нейтральные `table::*` lifecycle events добавляются в table adapter отдельным пунктом, после чего legacy aliases смогут жить на compatibility boundary без знания jQuery/DataTables реализации.
