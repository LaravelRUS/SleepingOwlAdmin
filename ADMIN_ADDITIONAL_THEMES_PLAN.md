# План добавления последующих тем SleepingOwlAdmin

## Назначение

Этот файл — повторяемый checklist для второй и каждой следующей темы после стабилизации основного `AdminLTETheme`/`ThemeInterface` contract. Он не выбирает конкретный framework и не обещает конкретные темы. Для каждой утверждённой темы создаётся отдельный `ADMIN_<THEME>_THEME_PLAN.md`, куда копируются применимые пункты и добавляются решения по дизайну, dependencies и лицензии.

Tailwind ведётся отдельно в [`ADMIN_TAILWIND_THEME_PLAN.md`](ADMIN_TAILWIND_THEME_PLAN.md). Основной release checklist находится в [`ADMIN_UI_MODERNIZATION_PLAN.md`](ADMIN_UI_MODERNIZATION_PLAN.md).

## Gate перед началом новой темы

- [ ] Название, аудитория, single job админ-интерфейса и визуальное направление согласованы.
- [ ] Выбран framework/template либо подтверждена framework-free реализация.
- [ ] Зафиксированы точная версия, лицензия, источник обновлений и допустимость распространения готовых assets.
- [ ] Определено, будет тема встроенной в основной Composer package или внешним package с service provider.
- [ ] Подтверждено, что тема не требует изменений PHP DSL и feature behavior.

## Публичный PHP contract

- [ ] Theme class реализует только публичный `ThemeInterface`: стабильный id, view namespace, logical assets, icons и capabilities.
- [ ] Существующий `sleeping_owl.template` выбирает тему; для package theme документирован service-provider registration hook.
- [ ] Неверный class/capability/asset manifest даёт диагностическую ошибку без fallback к другой теме.
- [ ] Theme assets используют `theme:<id>` и `feature:<feature>:theme:<id>`; physical paths не попадают в PHP API.
- [ ] Theme получает нейтральный asset health status и сама владеет footer presentation.

## Views и presentation

- [ ] Layout/navigation/display/form/action/widget views принадлежат namespace темы и сохраняют публичные logical paths.
- [ ] Application/vendor overrides имеют приоритет и работают без пересборки package assets.
- [ ] Blade задаёт concrete framework classes; core/PHP не переводит classes через semantic resolver.
- [ ] Vue islands получают конечные classes/options через Blade props и используют общие precompiled production/development bundles.
- [ ] Feature JavaScript привязывается только к documented behavior hooks/ARIA/field names, а не к presentation classes темы.
- [ ] Пользовательские attributes, classes и безопасно изменённая вложенность доходят до browser без потерь.

## Assets и styles

- [ ] Theme имеет самостоятельные source/build entries и не импортирует assets других тем.
- [ ] `_colors.scss` владеет color literals, `_variables.scss` — остальными defaults, `theme.scss` — handwritten presentation; generated CSS отделён.
- [ ] Общие `--soa-*` properties получают theme defaults; dark mode меняет properties на root/container.
- [ ] `sidebar_background_color` применяется через валидированную `--soa-sidebar-bg`, если capability темы включает sidebar.
- [ ] Icons подключаются отдельным shared либо theme-owned entry без неявного дублирования.
- [ ] Production и development assets, source maps, static resources и checksums публикуются заранее.
- [ ] Consumer устанавливает и выбирает тему без Node.js/npm; build toolchain нужен только автору темы.

## Feature adapters

- [ ] Для каждой объявленной capability существует presentation adapter или явно документирован native/classless mode.
- [ ] Theme adapter не копирует transport, state, query или lifecycle feature driver.
- [ ] Vendor-owned DOM настраивается через публичные vendor options и theme-owned styles.
- [ ] Notification adapters слушают публичные native events и не монтируют feature повторно.
- [ ] Unsupported capability не активирует лишний adapter и не вызывает fallback к основной теме.

## Изоляция и проверки

- [ ] При выборе темы загружается ровно один theme bundle и только её feature adapters.
- [ ] Bundle не содержит Bootstrap/AdminLTE/Tailwind/другой framework, если он не является заявленной dependency этой темы.
- [ ] Core, shared Vue runtime и feature drivers остаются byte-identical и не требуют rebuild из-за добавления темы.
- [ ] Общие PHP/render/browser contracts проходят на одном display/form fixture в основной и новой теме.
- [ ] Accessibility: keyboard/focus/ARIA/contrast/reduced-motion/responsive smoke tests проходят.
- [ ] Asset match/mismatch и locale fallback проверены; совпадающие версии не добавляют footer warning.
- [ ] Bundle size измерен отдельно; dependency/license inventory обновлён.
- [ ] Config matrix, setup/customisation guide, migration notes и CHANGELOG обновлены.
- [ ] Чистая release-artifact установка без Node.js прошла через Composer и `sleepingowl:update`.

## Журнал

| Дата | Решение | Результат |
| --- | --- | --- |
| 2026-09-07 | Разделение планов | Создан единый reusable contract; конкретные новые темы пока не выбраны и не входят в основной release scope. |
| 2026-09-08 | Framework-free acceptance fixture | Test-only тема без UI framework прошла публичный `ThemeInterface`, Blade/render, production/development asset и browser-isolation contracts на шести capabilities основной темы. Reusable checklist намеренно оставлен незакрытым: fixture не является утверждённой продуктовой темой и не заменяет отдельный план её поставки. |
