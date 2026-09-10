# План общей основы для `empty` theme

## Цель и граница

`empty` остаётся framework-free диагностической темой: её собственный bundle не
содержит presentation rules. Рабочая базовая разметка, размеры, поверхности и
theme-neutral поведение должны приходить из `core`, `shared:ui` и
`shared:features`; AdminLTE и Shadcn задают только отличающиеся значения токенов
и действительно framework-specific presentation.

`core` остаётся headless: DOM/API, accessibility и lifecycle без визуального
оформления. Всё видимое общее оформление принадлежит `shared:ui`, а общее
интерактивное поведение — `shared:features`.

## Инвентарь переноса

| Приоритет | Область | Целевой владелец | Статус |
| --- | --- | --- | --- |
| P0 | Размер шрифта, line-height, document sizing и наследование controls | `shared:ui/foundation` | [x] |
| P0 | Page/surface/sidebar palette defaults и dark palette | `shared/tokens` | [x] |
| P0 | Фоны и базовая типографика header/sidebar/footer/page heading | `shared:ui/shell` | [x] |
| P0 | Переключение, восстановление и сохранение light/dark mode | `shared:features/color-mode` | [x] |
| P1 | Dashboard grid, login layout, thumbnails | `shared:ui` | [ ] |
| P1 | Alerts, asset-health и scroll-control skin | `shared:ui` | [ ] |
| P1 | Badge presentation | `shared:features/forms` | [x] |
| P1 | Card collapse/maximize behavior | `shared:features` | [ ] |
| P1 | Auto-update progress/toggle presentation | `shared:features/table` | [x] |
| P1 | Theme-neutral pagination | `shared:features/table` | [x] |
| P1 | Theme-neutral table shell и filters | `shared:features/table` | [ ] |
| P1 | Общая форма: select islands, related fields, uploads и WYSIWYG shell | `shared:ui` / `shared:features/forms` | [ ] |
| P2 | Modal/notification presentation и capability contract | `shared:ui` / `shared:features` | [ ] |
| P2 | Удаление оставшихся Bootstrap-классов из canonical Blade hooks | `resources/views/default` | [ ] |
| P2 | Расширение capabilities `empty` после browser parity каждого feature | `EmptyTheme` | [ ] |

## Правила переноса

- Общие selectors используют только `soa-*`, документированные `data-*`, ARIA и
  layout state hooks.
- В shared rules нет literal palette, Bootstrap/AdminLTE/Tailwind selectors и
  vendor DOM assumptions; значения приходят через `--soa-*`.
- Правило удаляется из темы в том же checkpoint, в котором появляется shared
  owner; копии между слоями не сохраняются.
- `empty` проверяет shared default, AdminLTE и Shadcn — собственные token
  overrides. Light/dark и desktop/mobile проверяются минимум в development и
  production profiles.
- После серии правок watcher останавливается и выполняется полный
  `npm run production`, чтобы синхронизировать оба profiles, hashes и manifest.

## Текущий checkpoint

- [x] Shared document foundation применяет базовую размерку, фон и foreground.
- [x] Shared palette содержит самостоятельные light/dark defaults.
- [x] Основные shell surfaces и text scale перенесены из Shadcn в shared owner.
- [x] Color-mode runtime перенесён из theme JavaScript в общий feature bundle.
- [x] Все auto-update styles сведены в shared partial; theme-копии удалены.
- [x] Badge и pagination presentation перенесены в shared; theme-копии удалены.
- [x] Добавлены unit- и browser-проверки framework-free light/dark foundation.
- [x] Выполнить полный production rebuild и acceptance gates после завершения
  ближайшей серии переносов.
