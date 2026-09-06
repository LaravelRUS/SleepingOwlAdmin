# Narrow DOM helpers

Core содержит только два helper для повторяющейся работы с browser events:

- `listen(target, type, listener, options)` использует `addEventListener` и возвращает функцию teardown;
- `delegate(root, type, selector, listener, options)` находит ближайший matching element внутри root и также возвращает teardown.

Delegation уже повторяется в legacy table controls, tree controls и file actions. Явный teardown нужен общему `mount`/`destroy` lifecycle, чтобы динамические компоненты не накапливали listeners. Callback `delegate` получает `(event, matchedElement)` и вызывается с matching element в `this`; это упрощает перенос существующих delegated jQuery handlers без передачи jQuery objects в новый API.

Core намеренно не оборачивает `querySelector`, `querySelectorAll`, `closest`, `classList`, `dataset`, `FormData` или `URLSearchParams`: их native API уже достаточно короткий и понятный. Feature-specific операции вроде выбора строк таблицы, создания hidden form и загрузки assets остаются в своих features/services, а не превращаются в общий DOM utility namespace.
