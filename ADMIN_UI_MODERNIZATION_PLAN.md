# План миграции SleepingOwlAdmin на headless UI core, сменные темы, Vue 3 и DataTables 2

## Статус и границы

- Статус: выполняется.
- Текущий этап: **Этап 0 — решения и baseline**.
- Точка возобновления: выбрать replacements для legacy UI plugins.
- Рабочая ветка: `codex/remove-jquery-datatables2`.
- База ветки: `ia11`, commit `17752e62`.
- Тип релиза: major, с допустимыми frontend breaking changes.
- Основная цель: выделить независимый от CSS/JS-фреймворков SleepingOwlAdmin core, удалить прямое использование jQuery и jQuery-плагинов, обновить DataTables до версии 2 и перейти с Vue 2 на Vue 3.
- UI-цель: загружать минимальный core bundle и только одну выбранную тему — AdminLTE, Tailwind или пользовательскую реализацию `ThemeInterface`.
- Distribution-цель: конечный пользователь устанавливает/обновляет пакет через Composer и не обязан устанавливать Node.js, запускать Vite/Laravel Mix/Tailwind или пересобирать assets при создании разделов, forms и displays.
- Compatibility-цель: по возможности сохранить PHP DSL (`AdminDisplay`, колонки, фильтры, actions), но считать этот релиз major и явно документировать frontend breaking changes.
- Config-цель: считать опубликованный `config/sleeping_owl.php` публичным контрактом и сохранить большинство существующих ключей, значений по умолчанию и поведения даже при полной замене frontend implementation.
- Вне текущего scope: обязательный переход с Laravel Mix на Vite, изменение серверной модели репозиториев и визуальный редизайн всех тем. Смена build tool допустима только если окажется необходимой для Vue 3/theme bundles и будет оформлена отдельным решением.

## Правило №1: декомпозиция и читаемость

Декомпозиция является главным техническим правилом этой миграции. Новый код должен быть лёгким для чтения backend-разработчиком, которому приходится открыть JavaScript, Blade или внутренний PHP-класс.

- Одна функция или метод решает одну задачу и помещается в один обозримый фрагмент экрана.
- Целевой размер функции — до 25 строк логики; функция длиннее 40 строк требует декомпозиции либо явного обоснования на review.
- Orchestration отделяется от вычислений и side effects: разбор config/request, DOM lookup, network call, state mutation и render не смешиваются в одной функции.
- Большой модуль делится по ответственности, а не по типу синтаксиса. Например, DataTables migration разделяется на lifecycle, options normalization, transport, filters, state, selection и draw hooks.
- Vue island не превращается в монолитный component: сложная логика выносится в composables/services, а template разбивается на понятные дочерние components только при реальной самостоятельной ответственности.
- PHP classes не должны одновременно строить query, нормализовать frontend options, выбирать тему и формировать HTML.
- Blade view отвечает за presentation и composition; в нём не размещается сложная бизнес-логика или длинный inline script.
- Не создаются новые god objects (`Admin`, `Theme`, `Manager`) с десятками несвязанных методов. Registries/facades делегируют работу узким modules.
- Общий `utils` не используется как склад случайных helpers. Helper остаётся рядом с feature либо переносится в core только после появления реального повторного использования.
- Имена функций, modules и variables описывают назначение; комментарии объясняют причину или ограничение, а не пересказывают код.
- Декомпозиция не означает искусственные одно-двухстрочные wrappers и интерфейс на каждый класс. Новый слой вводится только при отдельной ответственности, тестируемой границе или нескольких реализациях.
- Каждый извлечённый модуль получает узкий публичный API и самостоятельные unit/contract tests.
- Старые длинные функции, которых касается миграция, сначала покрываются characterization test, затем разбиваются; перенос монолита с заменой `$()` на `querySelector()` не считается выполненной миграцией.

Минимальные автоматические guards:

- ESLint запрещает неявные globals и контролирует complexity/длину новых JavaScript-функций;
- formatter и единый code style применяются автоматически;
- CI запускает unit/contract tests по feature boundaries;
- исключения из size/complexity rules допускаются только локально с коротким комментарием причины, не глобальным отключением правила.

## Правило стилей: Sass и централизованные переменные

- Все написанные нами вручную стили хранятся в `.scss`; существующие отдельные `.css` sources по мере затрагивания переводятся в Sass partials.
- У каждого bundle есть явный Sass entrypoint и файл переменных: core, feature и каждая тема не импортируют случайные globals друг друга.
- Все цвета объявляются только в центральном `_variables.scss`/`_colors.scss` соответствующего слоя либо как CSS custom properties в `:root`. Hex/rgb/hsl literals внутри component files запрещены.
- Публичные runtime-настройки темы оформляются CSS custom properties с единым префиксом `--soa-*`; базовые значения объявляются в `:root`.
- Sass variables используются для build-time defaults, вычислений, breakpoints и значений, которые не требуется менять без сборки. Переопределяемые defaults объявляются с `!default`.
- Component styles используют `var(--soa-*)` для пользовательски настраиваемых значений; fallback берётся из централизованной Sass variable, а не дублируется literal в компоненте.
- Dark mode и theme variants переопределяют существующие custom properties на root/theme container, а не копируют целые component styles с новыми hardcoded colors.
- Повторяемые spacing, radius, shadow, z-index, transition, typography и layout values также выносятся в variables/tokens file. Одноразовые структурные размеры разрешены локально, если это делает правило понятнее.
- Цвета не задаются из JavaScript. Существующие config values вроде `dt_autoupdate_color` передаются в валидированную CSS custom property конкретного компонента.
- Inline styles в Blade допускаются только для действительно динамических данных (например, preview image URL/width) и не используются для theme colors.
- `transparent`, `currentColor`, `inherit`, `initial` и CSS system colors не считаются нарушением color-literal rule.
- `!important` не используется как стандартный способ победить тему; исключения допустимы только для документированного vendor override.
- Stylelint + `stylelint-scss` проверяет literals, дублирование и базовые правила качества SCSS. Исключения локальны и обоснованы.
- TailwindTheme является техническим исключением только для сгенерированного Tailwind/PostCSS utility layer. Все first-party handwritten overrides и общие tokens ведутся централизованно; сгенерированный CSS вручную не редактируется.

Целевая структура source entrypoints:

```text
resources/frontend/
  core/{index.js,styles/admin-core.scss,styles/_variables.scss,styles/_colors.scss}
  features/<id>/{index.js,styles/feature.scss,styles/_variables.scss,styles/_colors.scss}
  themes/adminlte/{index.js,styles/theme.scss,styles/_variables.scss,styles/_colors.scss}
  themes/tailwind/{index.js,styles/theme.scss,styles/_variables.scss,styles/_colors.scss,tailwind.input.css}
```

- `admin-core.scss`, каждый `feature.scss` и каждый `theme.scss` являются самостоятельными build entries и попадают в отдельные manifest entries.
- First-party Sass modules используют `@use`/`@forward`; legacy `@import` допускается временно только на migration boundary или когда vendor package не поддерживает module system.
- Core variables содержат только framework-independent behavior/accessibility tokens; core не знает Bootstrap, AdminLTE, Tailwind и visual component palette.
- Feature variables принадлежат одному driver и определяют только его layout/behavior defaults и публичные `--soa-<feature>-*` hooks; feature не импортирует private variables темы.
- Theme variables владеют typography, spacing, radius, shadows, layout и palette темы, а также назначают значения публичным core/feature CSS custom properties.
- `_colors.scss` каждого слоя является единственным first-party местом color literals этого слоя; `_variables.scss` содержит остальные Sass defaults с `!default` там, где нужен build-time override.
- Theme-specific feature presentation хранится рядом с темой либо в явном adapter entry, но не возвращается в generic feature stylesheet.
- `tailwind.input.css` содержит только необходимые Tailwind/PostCSS directives/config и считается build-tool input; все написанные вручную overrides остаются в `theme.scss`. Generated Tailwind CSS существует только в output и вручную не редактируется.
- Текущие `resources/assets/scss/admin-app.scss`, глобальные `_variables.scss`/`colors.scss` и component aggregators разбираются по этим владельцам постепенно; монолит удаляется после parity обеих тем.

Color literals и dark mode:

- first-party color literals разрешены только в `_colors.scss`; component/theme files используют Sass variables или `var(--soa-*)`;
- `transparent`, `currentColor`, `inherit`, `initial`, `unset` и CSS system colors разрешены локально, поскольку не создают новую palette value;
- alpha/gradient calculations над централизованной переменной разрешены локально; новый hex/rgb/hsl literal внутри такого выражения запрещён;
- vendor sources, generated Tailwind CSS и compiled output исключаются из literal rule и не редактируются вручную;
- first-party monochrome SVG использует `currentColor`; фиксированные literals допустимы только в явно помеченных multicolor brand/logo assets, где цвет является содержимым изображения, а не UI token;
- действительно динамический пользовательский цвет сначала валидируется PHP value object, затем передаётся только в allowlisted `--soa-*` custom property; произвольный style fragment из config не принимается;
- light defaults объявляются в `:root`, dark values — только в `:root[data-soa-color-scheme="dark"]`; components не дублируются отдельными `.dark-*` blocks;
- JavaScript меняет только `data-soa-color-scheme` и сохранённое предпочтение (`light`, `dark`, `system`), но не назначает отдельные цвета;
- theme variables задают default `--soa-sidebar-bg`, а валидированный `sidebar_background_color` переопределяет его с более высоким cascade priority для обоих color schemes; `null` не выводит override;
- Stylelint проверяет first-party `.scss` и допускает исключения только по точным generated/vendor/brand paths, без глобального disable.

## Важное техническое ограничение

DataTables 2 поддерживает современную инициализацию через `new DataTable(...)`, но перед реализацией нужно проверить фактическое дерево зависимостей выбранного пакета и его extensions. Если `jquery` остаётся транзитивной зависимостью DataTables 2, возможны два разных критерия завершения:

1. **Базовый критерий:** в коде проекта нет `$`, `jQuery`, jQuery-плагинов и глобальных `window.$/window.jQuery`; jQuery может присутствовать только как закрытая транзитивная деталь DataTables 2.
2. **Строгий критерий:** пакет `jquery` отсутствует и в production bundle, и в `npm` dependency tree. Если DataTables 2 не позволяет этого добиться, для строгого критерия придётся заменить DataTables на независимый grid (основной кандидат — Tabulator) либо принять базовый критерий отдельным решением.

Выбран **базовый критерий**, поскольку целевой grid явно зафиксирован как DataTables 2:

- first-party JavaScript и inline scripts в Blade не используют jQuery API (`$()`, `jQuery`, jQuery plugins) или глобальные `window.$`/`window.jQuery`;
- `jquery` удаляется из прямых dependencies SleepingOwlAdmin;
- транзитивный jQuery допускается только под allowlist пакетов DataTables 2 и попадает только в изолированный table-feature bundle;
- jQuery внутри DataTables не является публичным API: hooks, extensions и пользовательский код работают через публичный DataTables API и native events;
- автоматическая проверка `npm ls jquery` завершается ошибкой, если jQuery появляется вне разрешённой DataTables-ветки;
- переход на DataTables 3 ради строгого критерия рассматривается отдельно после стабилизации текущей миграции и не входит в неё незаметно.

#### Проверка npm packages от 2026-09-06

- Последняя версия согласованной major-ветки — `datatables.net@2.3.8`; совместимый Responsive — `datatables.net-responsive@3.0.8`.
- `datatables.net`, `datatables.net-bs4`, `datatables.net-bs5`, `datatables.net-dt` и Responsive packages этих major-веток объявляют production dependency `jquery >=1.7`.
- Чистая временная установка `datatables.net@2.3.8`, `datatables.net-bs4@2.3.8`, `datatables.net-responsive@3.0.8` и `datatables.net-responsive-bs4@3.0.8` установила пять production packages, включая дедуплицированный `jquery@4.0.0`.
- Следовательно, строгий критерий несовместим с DataTables 2 без замены grid либо неподдерживаемого вмешательства в package/bundle.
- На дату проверки npm tag `latest` уже указывает на `datatables.net@3.0.3` и Responsive `4.0.3`; их metadata не содержит зависимости от jQuery. Это отдельная major-миграция и не меняет согласованную цель автоматически.

### Ограничение Vue 3 и серверных шаблонов

Vue 3 по-прежнему поддерживает in-DOM root templates: если у root component нет `template`, содержимое mount-контейнера используется как шаблон. Это официально поддерживает сценарий, где HTML генерируется серверным Blade-шаблоном: <https://vuejs.org/guide/essentials/application.html#in-dom-root-component-template>.

Атрибут `inline-template`, напротив, удалён из Vue 3. Временный migration build `@vue/compat` умеет поддерживать его через `COMPILER_INLINE_TEMPLATE`, но финальная архитектура не должна от него зависеть: <https://v3-migration.vuejs.org/breaking-changes/inline-template-attribute.html>.

Целевое решение для SleepingOwlAdmin:

- не монтировать один Vue app на всю страницу админки;
- использовать небольшие Vue 3 islands для интерактивных компонентов;
- передавать server data через props, `data-*` или `<script type="application/json">`;
- хранить template компонента в SFC/JS либо в theme-owned template, а не в `inline-template`;
- использовать compiler-included Vue build только там, где временно остаётся серверный in-DOM template;
- применить `@vue/compat` только как промежуточный инструмент и удалить его до завершения миграции.

Выбрана короткая migration strategy через `@vue/compat`:

- после characterization tests Vue обновляется до Vue 3 с compat build в `MODE: 2`; `COMPILER_INLINE_TEMPLATE` разрешается только для уже существующих legacy views;
- compat mode не является новой архитектурой: новые и мигрированные widgets сразу создаются как отдельные Vue 3 islands через `createApp`;
- миграция идёт по одному bounded widget: env editor, select/multiselect, file/image(s), затем related elements/groups;
- для каждого island сначала фиксируются входные данные и события, затем template переносится из Blade в precompiled component, после чего удаляется соответствующий global registration/`inline-template`;
- compat warnings учитываются как конечный backlog; новые suppressions и Vue 2 APIs после включения compat запрещены;
- после последнего island удаляются глобальный root app, `window.Vue`, `Vue.component`, `Vue.extend`, `vue-resource`, prototype plugin и compiler-included build;
- обязательный exit gate до release: удалить `@vue/compat` из dependencies и production bundles, переключиться на runtime-only Vue 3 и пройти поиск/тесты из acceptance matrix.

Повторный inventory на 2026-09-06 нашёл 9, а не 10 использований `inline-template` в 9 Blade views, 7 глобально регистрируемых components, один глобальный `new Vue(...)`, `Vue.http` interceptor и prototype translation helper. Эти числа становятся проверяемым исходным baseline.

Контракт данных Vue islands:

- mount node помечается `data-admin-component="<feature-id>"`; один registry находит его и гарантирует ровно один mount/unmount;
- короткие строки, ids, booleans и числовые параметры передаются только через HTML-escaped `data-*`; decoder feature явно преобразует и валидирует типы, не полагаясь на JavaScript truthiness;
- массивы, objects и длинные payload передаются соседним `<script type="application/json" id="<unique-props-id>">`, а mount node ссылается на него через `data-admin-props-id`;
- чистый JSON для script block создаётся `Illuminate\Support\Js::encode()`, доступным во всех поддерживаемых Laravel; `json_encode()` внутри HTML attributes и Vue expressions больше не используется;
- общий parser отвечает только за безопасное чтение JSON и понятную ошибку синтаксиса; schema/defaults конкретного payload нормализует сам feature;
- данные не исполняются через `eval`, `new Function`, inline handler или динамический Vue template; пользовательские строки выводятся обычным escaped text, если API явно не требует sanitized HTML;
- server endpoint URLs, CSRF и translation strings являются обычными props, а результаты/изменения наружу передаются через native `CustomEvent` и стандартные form controls;
- props id уникален в пределах документа, чтобы несколько одинаковых islands и динамические related groups не разделяли состояние;
- JSON payload не считается местом хранения секретов: всё, переданное в DOM, доступно пользователю браузера.

### Поддерживаемые браузеры

Админка ориентируется на современные браузеры; Internet Explorer и legacy Edge не поддерживаются. Production target:

- последние две стабильные major-версии Chrome, Edge и Firefox;
- актуальный Firefox ESR;
- Safari `>= 16.4` и iOS Safari `>= 16.4`;
- Chromium WebView поддерживается только при соответствии одной из перечисленных Chromium-версий.

Эта политика будет записана в `package.json` как `browserslist`. Версии `caniuse-lite` и build dependencies фиксируются lock-файлом, чтобы результат сборки был воспроизводим. Синтаксис может транспилироваться под target, но глобальные legacy polyfills не включаются автоматически: необходимый Web API получает локальный fallback внутри feature либо явно документированное требование.

## Текущее состояние

На момент составления плана:

- `jquery` объявлен как `^3.5.1`, установленная локально версия — `3.7.1`;
- `datatables.net` объявлен как `^1.12.1`, установленная локально версия — `1.13.11`;
- Bootstrap — `4.6.1`, AdminLTE — `3.2.0`;
- `vue` и `vue-template-compiler` объявлены как `^2.6.14`, локально установлены `2.7.16`; используется устаревший `vue-resource`;
- npm lock-файл отсутствует;
- из 73 исходных JS-файлов не менее 33 используют jQuery-style API;
- JavaScript unit/browser test infrastructure отсутствует;
- скомпилированные assets в `public/default` хранятся в Git;
- серверный async endpoint выдаёт DataTables-совместимый формат `draw`, `recordsTotal`, `recordsFiltered`, `data`;
- интеграция DataTables содержит собственный Bootstrap 3 renderer, хотя интерфейс уже использует Bootstrap 4;
- `datatables.net-bs4` установлен, но официальный adapter не подключён;
- `datatables.net-responsive` установлен, но его подключение закомментировано.
- Vue создаётся одним глобальным `new Vue({ el: '#vueApp' })` на всей внутренней странице;
- компоненты регистрируются через глобальные `Vue.component`/`Vue.extend`, а HTTP interceptor — через `Vue.http`;
- в Blade найдено 9 использований удалённого в Vue 3 атрибута `inline-template`;
- текущие Blade/PHP views жёстко связаны с Bootstrap/AdminLTE: 113 Blade-файлов, Bootstrap-классы также создаются непосредственно в PHP form/display classes.
- основной `config/sleeping_owl.php` содержит около 500 строк и управляет core, routes/auth, uploads, date/time, WYSIWYG, tables, UI state, template и aliases; его нельзя заменять новым минимальным конфигом целиком.

Основные зоны jQuery-связности:

- DataTables, фильтры, state, reload и подсветка колонок;
- display actions и actions form;
- checkbox/control/inline-edit колонки;
- Bootstrap tabs, tooltips, alerts и dropdown-разметка;
- Select2 и AJAX-select;
- date, datetime и date-range controls;
- dependent dropdown;
- tree view/Nestable;
- lightbox/Magnific Popup;
- файловые и image-компоненты;
- sidebar/AdminLTE PushMenu;
- отдельные вспомогательные DOM-операции и динамическая загрузка assets.

## Целевая архитектура

### Headless core и темы

- Core не должен импортировать Bootstrap, AdminLTE, Tailwind или theme-specific DataTables styles.
- `admin-core.js` содержит только HTTP/CSRF, native events, module lifecycle, feature registries, storage и узкие DOM helpers.
- `admin-core.css` содержит только accessibility/behavior rules (`hidden`, cloak, loading, drag placeholders) и не включает reset, typography или layout framework.
- Загружается ровно один theme bundle: `theme-adminlte` либо `theme-tailwind`; custom theme может предоставить собственный asset manifest.
- Рядом с существующим `TemplateInterface` вводится небольшой стабильный `ThemeInterface`: id, view namespace, assets, icons и capabilities. Старый широкий contract не получает новых обязанностей и временно поддерживается adapter-слоем. Class resolver и отдельный semantic styling API не вводятся.
- Стандартные framework-классы встроенных компонентов задаются непосредственно в Blade views выбранной темы, а не в PHP core.
- Обычный публичный API HTML attributes/classes сохраняется: пользователь знает выбранную тему и передаёт нужные Bootstrap, AdminLTE, Tailwind или custom classes напрямую. Core не переводит, не валидирует и не переименовывает их.
- Сложные компоненты рендерятся theme-owned Blade components/partials; общие views остаются только там, где их разметка действительно не зависит от темы.
- Выбор темы выполняется на уровне установки или отдельной admin panel. Runtime-переключение нескольких CSS frameworks на одной странице не входит в первую версию.
- AdminLTE-тема сама владеет Bootstrap/AdminLTE dependencies. Tailwind и custom темы не должны получать их транзитивно из core.

### Feature drivers

- DataTables, select, date/time, inline editor, tree и lightbox оформляются как независимые feature drivers, а не как часть core или конкретной темы.
- Компоненты активируются по нейтральным атрибутам (`data-admin-component`, `data-driver`) и могут загружаться отдельными chunks.
- Driver отвечает за поведение, theme adapter — за presentation; пользовательская тема может переопределить presentation без копирования бизнес-логики.
- Базовый PHP API таблиц постепенно обобщается до `TableDisplay`; `AdminDisplay::datatables()` остаётся удобным alias выбранного table driver.

### Контракт архитектурных границ

| Слой | Владеет | Не должен содержать |
| --- | --- | --- |
| PHP/core | PHP DSL и contracts, config normalization, routes/auth, server payloads, feature/theme registries, manifest resolution | framework-specific classes, concrete theme views, vendor widget initialization |
| Frontend core | lifecycle, native events, HTTP/CSRF, storage, manifest-driven boot, узкие DOM helpers и registries | Vue runtime, DataTables, Bootstrap/AdminLTE/Tailwind, feature business logic |
| Feature driver | поведение одного widget, его state/transport/lifecycle, third-party library и нейтральный DOM contract | page layout, navigation, classes конкретной темы, прямые импорты внутренних файлов темы |
| Theme | layout/navigation views, presentation Blade partials, icons, visual SCSS и собственные framework dependencies | query/transport/state feature, PHP DSL rules, assets другой темы |
| Feature theme adapter | только разметка/стили presentation для пары feature + theme | копия driver logic или загрузка feature без фактического использования |
| User extension | регистрация через публичные PHP/JS contracts, собственные classes/views/assets/manifest entries | импорт внутренних source paths или monkey patch private state |

Правила зависимостей:

- frontend core ничего не импортирует из features и themes;
- feature driver импортирует только публичный core API;
- theme импортирует только публичный core API и не активирует необязательные features;
- feature/theme adapter связывается с driver по публичному id/registry, без circular imports;
- PHP renderer собирает страницу как `core + selected theme + detected features + matching presentation adapters`;
- один feature имеет один lifecycle и не инициализируется повторно при Vue island mount, tab activation или динамической вставке DOM;
- пользовательские classes и HTML attributes проходят через core без преобразования; встроенные framework classes принадлежат theme views.

Текущий `TemplateInterface` не расширяется новыми обязанностями: он уже объединяет presentation с meta, breadcrumbs и navigation. Вводится отдельный узкий `ThemeInterface`, а server-side coordinator использует core-сервисы и выбранную тему. Значение существующего ключа `template` сохраняется; legacy implementation `TemplateInterface` подключается через явно deprecated adapter на переходный период. Это позволяет мигрировать custom templates без class resolver и без переименования config key.

Логические manifest ids фиксируются заранее: `core`, `theme:<id>`, `feature:<id>` и `feature:<id>:theme:<id>`. Физические имена с hash/version берутся только из manifest; PHP и пользовательские extensions не строят пути к собранным файлам вручную.

### Темы первого major-релиза

- Встроенные темы: `adminlte` и `tailwind`; третья обязательная acceptance implementation — минимальная тестовая custom theme через публичный `ThemeInterface`.
- Default theme — `adminlte`, чтобы существующий `template` config и привычная структура upgrade-проектов получили минимально неожиданный результат.
- Встроенная AdminLTE theme переходит на AdminLTE 4 + Bootstrap 5.3 и не поддерживает legacy AdminLTE 3/Bootstrap 4 JavaScript. На 2026-09-06 актуальная `admin-lte@4.9.1` объявляет только peer dependency `bootstrap ^5.3.8` и не требует jQuery.
- Tailwind theme строится на Tailwind 4.x (на дату проверки `4.3.3`) и поставляется как заранее собранный полный bundle для стандартных views/components.
- `TemplateDefault` сохраняется как deprecated compatibility alias/adapter к AdminLTE theme, поэтому прежнее значение опубликованного `template` не вызывает fatal error.
- Выбор `tailwind` полностью исключает Bootstrap/AdminLTE assets; выбор `adminlte` полностью исключает Tailwind assets.
- Custom theme явно задаётся существующим ключом `template`, реализует `ThemeInterface` и предоставляет готовые manifest entries; core не делает автоматический fallback к AdminLTE при ошибке custom theme.
- Тема выбирается для панели при bootstrap приложения. Runtime theme switch на уже отрисованной странице не входит в первый релиз.

### Поставка без frontend-сборки у пользователя

No-build consumer contract является release-blocking:

- production consumer выполняет только Composer/PHP/Artisan-команды; отсутствие `node`, `npm`, Vite, Mix и Tailwind CLI не ограничивает штатные displays/forms/features/themes;
- Composer artifact обязательно содержит manifest, precompiled core, все standard feature bundles, обе встроенные темы и их статические ресурсы;
- `sleepingowl:install` публикует готовые assets при первой установке, а `sleepingowl:update` атомарно обновляет только package-owned published assets;
- смена `template` между встроенными темами после публикации не требует новой frontend-сборки;
- создание section/model/display/form/column/filter через PHP DSL не меняет bundle и не запускает генератор frontend-кода;
- пользовательские CSS/JS подключаются отдельными файлами через публичный asset API и не требуют fork/rebuild core;
- custom theme package поставляет собственные готовые assets; требование build toolchain относится только к её автору;
- CI устанавливает release artifact в чистое Laravel-приложение, где Node.js/npm отсутствуют, и выполняет smoke tests обеих встроенных тем.

Контракт install/update и manifest mismatch:

- `sleepingowl:install` использует тот же узкий asset publisher, что и `sleepingowl:update`; bootstrap files создаются отдельно и не смешиваются с обновлением frontend assets.
- `sleepingowl:update` остаётся единственной штатной командой обновления assets и не вызывает npm/build tools.
- Команда копирует package-owned assets во временный каталог, проверяет manifest schema, обязательные entries и checksums, затем заменяет опубликованный asset root; manifest переносится последним как commit marker.
- Ошибка копирования/валидации даёт non-zero exit code и оставляет прежний полный опубликованный набор рабочим; частично обновлённый manifest не публикуется.
- Устаревшие hashed package files удаляются только после успешной замены. Пользовательские CSS/JS должны находиться вне package-owned asset root и никогда не удаляются этой командой.
- Published `config/sleeping_owl.php`, application bootstrap files и custom theme package assets не перезаписываются `sleepingowl:update`.
- Manifest содержит как минимум `schema_version`, `package_version`, `build_id`, логические entries, относительные filenames и checksums. PHP package version определяется через Composer metadata, а не дублируется вручную в config.
- Runtime resolver проверяет manifest до render. Отсутствующий, повреждённый или несовместимый manifest вызывает специализированную диагностическую ошибку с точной командой `php artisan sleepingowl:update`; silent fallback на старые/unversioned files запрещён.
- Добавляется `sleepingowl:update --check`: read-only проверка установленного manifest/files для deployment health check; успех и ошибка имеют стабильные exit codes.
- Release CI проверяет идемпотентный повторный запуск update, recovery после искусственно оборванной staging copy и отсутствие изменений config/application files.

- Первый major поставляется одним Composer package `laravelrus/sleepingowl`: PHP core, обе встроенные темы, standard feature drivers, views, manifest и готовые production assets версионируются совместно.
- Исходники разделяются внутри монорепозитория по `core/features/themes`, а build создаёт независимые entries; монорепозиторий не означает один монолитный browser bundle.
- Composer archive содержит готовые assets обеих встроенных тем. Лишняя тема занимает место только в vendor/public после публикации, но не загружается браузером и не влияет на runtime.
- В первой итерации встроенные темы не выносятся в отдельные Composer packages: атомарная версия исключает несовместимые сочетания PHP contracts, Blade views и assets и сохраняет одну update-команду.
- Внешняя custom theme может поставляться отдельным Composer package с service provider, views и готовым manifest fragment; Node.js нужен автору такой темы, но не её потребителю.
- Выделение официальных тем в отдельные packages допускается только после стабилизации `ThemeInterface` и manifest schema и требует отдельного compatibility решения.
- Репозиторий и релизные archives содержат готовые versioned production bundles: core, feature chunks и bundles поддерживаемых тем.
- Composer-пользователь не получает frontend toolchain как обязательное условие работы админки. `npm` используется только maintainers и авторами распространяемых тем/features.
- Первичная установка использует существующий `sleepingowl:install`, а обновление готовых assets — существующий `php artisan sleepingowl:update`. Сейчас update-команда выполняет `vendor:publish --tag=assets --force`; её контракт расширяется проверкой manifest/version/theme без запуска frontend toolchain.
- Asset manifest связывает логические имена (`core`, `table-datatables`, `theme-adminlte`, `theme-tailwind`) с versioned файлами и позволяет корректно обновлять cache/CDN.
- На страницу всегда попадают precompiled `admin-core` и только выбранная тема; feature chunks подгружаются по наличию `data-admin-component`/`data-driver` либо регистрируются PHP-компонентом до render.
- Добавление пользователем новой модели, section, form, display, column или filter через PHP DSL не требует изменения frontend bundle.
- TailwindTheme поставляется с готовым CSS для всех стандартных компонентов. Пользователю не нужен Tailwind content scan для обычного использования.
- Простая кастомизация выполняется через классы выбранной темы, её конфигурацию и дополнительный обычный CSS-файл без пересборки core.
- Готовый Tailwind bundle гарантирует классы, используемые штатными Blade views темы. Произвольный utility class, переданный пользователем из PHP, сработает без сборки только если он входит в поставляемый CSS; дополнительные utilities пользователь подключает отдельным CSS/theme build. Core не пытается автоматически safelist/переводить такие классы.
- Расширенная разработка новой темы может использовать собственный frontend build, но потребитель готовой theme package устанавливает уже собранные assets и также не запускает Node.js.
- Пользователь может добавить собственные CSS/JS URLs через документированный asset API без пересборки core. Custom JavaScript взаимодействует только с публичными событиями/registries.
- Финальная Vue 3 сборка использует заранее скомпилированные component templates и по возможности runtime-only build. Blade передаёт данные, а не новый Vue template; compiler-included build допустим только на промежуточном migration этапе.

### DOM и события

- Использовать `querySelector`, `querySelectorAll`, `closest`, `classList`, `dataset`, `FormData`, `URLSearchParams`, `CustomEvent` и делегирование через `addEventListener`.
- Не создавать внутренний «мини-jQuery». Небольшие повторяемые операции разрешено оформить как узкие helpers (`delegate`, `onReady`, `serializeForm`), но не как универсальную chainable-обёртку.
- Сохранить `Admin.Events` как временный compatibility API, переведя его внутреннюю реализацию на native events. Добавить нейтральные события `table::*`; старые `datatables::*` оставить на один major-переход только там, где это оправдано.
- Запретить новые глобалы, кроме существующего корневого `window.Admin`, пока не будет отдельной миграции модульной архитектуры.

### Таблицы

- Создать реестр `Admin.Tables`, который скрывает конкретный table engine.
- Минимальный контракт instance: `reload()`, `destroy()`, `clearState()`, `selectedRows()`, `element`, `engineInstance`.
- Инициализировать DataTables 2 через `new DataTable(element, options)`, без `$(element).DataTable()` в коде проекта.
- На первом этапе сохранить текущий серверный wire protocol, чтобы не смешивать frontend-миграцию с переписыванием PHP query layer.
- Перевести внешние consumers (actions, inline-edit, auto-update) с прямого DataTables API на `Admin.Tables`.
- Удалить собственный renderer из `resources/assets/js_owl/libs/datatables.js`.
- DataTables core/behavior не должен зависеть от темы. AdminLTE-тема подключает подходящий Bootstrap adapter, Tailwind-тема — Tailwind/base adapter, custom theme — собственный presentation layer.

### Vue 3

- Заменить глобальные `Vue.component`, `Vue.extend`, `Vue.use`, `Vue.prototype` и `new Vue` на `createApp`, `defineComponent`, app-scoped registration и composables/plugins.
- Заменить `vue-resource` на уже используемый Axios либо `fetch`.
- Удалить `this.$set`: Vue 3 отслеживает обычное присваивание элементам reactive arrays/objects.
- Обновить либо удалить Vue 2-only packages (`vue-template-compiler`, `vue-multiselect` 2.x, `vuedraggable` 2.x, `vue-resource`).
- Перевести 10 Blade `inline-template` блоков в Vue 3 islands. В первую очередь: env editor, file/image/images, select/multiselect и related elements.
- Не использовать Vue для компонентов, которые проще и меньше реализовать native Web/DOM API; Vue 3 остаётся для действительно stateful islands.
- Динамически добавленные формы должны явно монтировать/демонтировать island через общий registry, а не рассчитывать на один глобальный root app.

### PHP API

- В рамках этой major-ветки `AdminDisplay::datatables()` переводится на новую реализацию DataTables 2; отдельный `datatables2()` больше не нужен, если обратная frontend-совместимость официально не является целью.
- Сохранить по возможности методы конфигурации PHP: `setOrder`, `setDisplaySearch`, `setDisplayLength`, pagination, payload, row class callback, columns и filters.
- Устаревшие произвольные DataTables 1 options из `setDatatableAttributes()` пропускать через нормализатор и документировать несовместимые ключи.
- Server-side response оставить совместимым с DataTables 2. Нормализацию request/response вынести в отдельные классы только если тесты покажут, что текущая реализация мешает обновлению.

### Совместимость `config/sleeping_owl.php`

- По умолчанию существующий ключ сохраняется. Удаление допускается только если опция больше технически не имеет смысла либо небезопасна; такое решение требует отдельной записи в migration table.
- Пользовательский опубликованный конфиг не перезаписывается командой `sleepingowl:update`. Новые ключи читаются с безопасными defaults, поэтому старый config продолжает загружаться.
- Имена `template`, `body_default_class`, `logo`, `logo_mini`, `menu_top`, `favicon`, `show_mode`, footer/version settings сохраняются. `template` продолжает выбирать класс реализации, даже если новый класс реализует расширенный `ThemeInterface`.
- Добавляется простой optional key `sidebar_background_color`; `null` означает default выбранной темы. Значение после валидации задаёт `--soa-sidebar-bg`, поэтому типичный brand color меняется в PHP config без Sass/Tailwind build.
- `body_default_class` и другие class/HTML options остаются обычными строками классов выбранной темы; core не преобразует их.
- `bootstrapDirectory` сохраняется без переименования: это историческое имя директории bootstrap-файлов админки (`app/Admin`), а не настройка CSS-фреймворка Bootstrap.
- Core settings сохраняются без frontend-переосмысления: `url_prefix`, `domain`, `middleware`, `auth_provider`, env editor, upload directories/extensions/filename behavior, date/time formats/timezone, search operator и aliases.
- WYSIWYG settings и вложенные массивы сохраняются; замена frontend wrappers не должна менять выбранный editor, toolbar/files/CDN config без отдельной причины.
- Table settings сохраняются как compatibility contract: state flags, request method, filters state, `datatables`, highlight и autoupdate. DataTables 1-specific произвольные options внутри `datatables` проходят документированную нормализацию; неподдерживаемый ключ даёт понятное предупреждение, а не молча игнорируется.
- UI layout flags (`useWysiwygCard`, `useRelationCard`, `useHasManyLocalCard`, scroll controls и подобные) передаются выбранной теме. Тема обязана либо поддержать capability, либо явно задокументировать fallback.
- Для каждого top-level ключа ведётся migration matrix со статусом: `unchanged`, `same key/new implementation`, `theme-owned`, `deprecated`, `removed`.
- При необходимости нового имени сначала добавляется alias/fallback на старый ключ; массовое переименование ради чистоты не выполняется.

## Карта замены зависимостей

| Текущая зависимость/интеграция | Целевое решение | Примечание |
| --- | --- | --- |
| `jquery`, `jquery-form` | Native DOM, `FormData`, `fetch`/Axios | `jquery-form` сейчас фактически не подключён и удаляется первым |
| Bootstrap 4 | Только внутри опциональной AdminLTE-темы; core без Bootstrap | Актуальную Bootstrap-версию выбирает и инкапсулирует AdminLTE theme package |
| AdminLTE 3 | Опциональная `AdminLTETheme` | Default theme может остаться AdminLTE, но core не знает её layout/classes/events |
| Tailwind | Опциональная `TailwindTheme` + готовый CSS | Для пользовательских utilities предоставить preset/source instructions без загрузки AdminLTE |
| DataTables 1 + самописный renderer | DataTables 2 feature driver + theme adapters | Не использовать внутренние API DataTables или Bootstrap markup в driver core |
| Vue 2 global build | Vue 3 islands | Временный `@vue/compat` допустим; в финальном bundle отсутствует |
| `vue-resource` | Axios/`fetch` | CSRF и error handling централизовать в core HTTP client |
| `vue-template-compiler` | Совместимый Vue 3 compiler/runtime build | In-DOM root templates допустимы, `inline-template` удаляется |
| `vue-multiselect` 2.x, `vuedraggable` 2.x | Vue 3-compatible версии либо feature drivers | Для drag/drop предпочтителен прямой SortableJS, если Vue wrapper не нужен |
| Select2 | Tom Select либо существующий Vue multiselect | Выбрать один подход для обычного и AJAX select до начала этой фазы |
| `bootstrap4-datetimepicker`, `tempusdominus-core`, Moment | Flatpickr или актуальный Tempus Dominus без jQuery | После миграции удалить Moment, если он больше нигде не нужен |
| `x-editable-bs4` | Собственный небольшой headless `InlineEditor` | Сохранить backend endpoint; внешний вид предоставляет тема |
| `nestable2` | Уже установленный SortableJS с nested-конфигурацией | Сохранить max depth, expand/collapse и сериализацию порядка |
| Magnific Popup | GLightbox или native `<dialog>` | Выбор зависит от требований gallery/navigation |
| `dependent-dropdown` | Небольшой native module поверх Axios/fetch | Сохранить существующие data attributes и события совместимости |
| Bootstrap jQuery tooltip/tab APIs | Theme capabilities либо native implementation | Bootstrap API используется только внутри AdminLTE theme adapter |
| jQuery DOM-код файловых компонентов | Native DOM внутри Vue 3 islands | Убрать поиск parent/container через jQuery и jQuery Dropzone plugin API |

Точный replacement package выбирается в начале соответствующей фазы и фиксируется в этом документе до изменения `package.json`.

## Правила выполнения миграции

- Правило №1 для каждого этапа — декомпозиция: затронутый монолитный код не переносится в новую архитектуру без разделения ответственностей.
- Каждый этап заканчивается рабочей production-сборкой и тестами.
- Не удалять jQuery из dependencies, пока последний consumer не переведён.
- Не смешивать в одном commit механическое переписывание DOM API и изменение пользовательского поведения.
- Сначала покрывать контракт тестом, затем менять реализацию.
- Не переносить legacy JavaScript построчно. Разрешено перепроектировать модуль, если сохранено нужное пользовательское поведение и новый контракт покрыт тестами.
- Не считать случайные globals, дублирование, внутренние DataTables API, смешение jQuery/Vue/native DOM и исторические ошибки публичным контрактом.
- Исправлять обнаруженные ошибки типов, reactivity, lifecycle и множественной инициализации отдельными небольшими commits с regression tests.
- Для новых модулей использовать единый стиль: ES modules, явные imports/exports, отсутствие неявных globals, однозначный ownership DOM-узла и симметричные `mount()`/`destroy()`.
- Не добавлять abstraction только ради сохранения формы старого кода; интерфейсы вводятся на реальной границе core/theme/feature.
- Не удалять и не переименовывать config keys механически вслед за заменой frontend-библиотеки. Сначала проверяется возможность сохранить старое поведение через новый driver/theme.
- Любое изменение config contract фиксируется в migration matrix, покрывается тестом старого и нового формата и попадает в migration guide.
- Не редактировать вручную файлы в `public/default`; они обновляются только production-сборкой на финальной стадии этапа.
- Все breaking changes заносить в migration guide по мере появления, а не задним числом.
- После каждого этапа проверять страницы с несколькими таблицами, таблицей внутри tab и динамически перерисовываемым содержимым.

## Этапы

### Этап 0. Зафиксировать решения и baseline

- [x] Выбрать базовый или строгий критерий удаления jQuery.
- [x] Проверить актуальные DataTables 2 packages и их production dependency tree.
- [x] Зафиксировать список поддерживаемых браузеров.
- [x] Зафиксировать границы `core`, `feature driver`, `theme` и пользовательских extensions.
- [x] Подтвердить AdminLTE и Tailwind как две первые опциональные темы; выбрать default theme нового major.
- [x] Определить стратегию распространения: единый Composer package с theme bundles или отдельные theme packages. На первой итерации предпочтителен монорепозиторий с независимыми bundles и стабильными contracts.
- [x] Утвердить no-build consumer contract: чистое Laravel-приложение без Node.js может установить пакет, опубликовать assets и использовать все стандартные components/themes.
- [x] Зафиксировать `sleepingowl:install`/`sleepingowl:update` как стабильный no-build UX и определить поведение при несовпадении версии PHP package и asset manifest.
- [x] Выбрать Vue 3 migration strategy: прямой переход или временный `@vue/compat`; рекомендуемый вариант — короткий compat-этап с обязательным удалением до release.
- [x] Выбрать способ передачи данных в Vue islands: props + `data-*` для малых payload и `<script type="application/json">` для сложных структур.
- [x] Утвердить структуру Sass entrypoints/partials, префикс CSS custom properties `--soa-*` и границы variables core/features/themes.
- [x] Зафиксировать разрешённые исключения color literals и стратегию dark mode через переопределение root variables.
- [ ] Выбрать replacements для Select2, date/time controls и lightbox.
- [ ] Добавить npm lock-файл и зафиксировать исходное дерево зависимостей.
- [ ] Сохранить baseline production bundle size и перечень лицензий.
- [ ] Составить перечень эталонных экранов для каждой темы: layout/navigation, async table, sync table, filters, bulk actions, inline edit, tree, select, date/time, single/multiple file upload.
- [ ] Составить полный machine-readable inventory top-level/nested config keys и найти их consumers в PHP, Blade и JavaScript.
- [ ] Заполнить config migration matrix (`unchanged`, `same key/new implementation`, `theme-owned`, `deprecated`, `removed`) с правилом сохранения по умолчанию.
- [ ] Подготовить fixture старого опубликованного конфига и fixture минимального конфига с отсутствующими новыми ключами.

Критерий завершения: решения записаны, зависимости воспроизводимы, набор эталонных сценариев согласован.

### Этап 1. Создать страховочную сетку тестов

- [ ] Добавить Vitest для чистых JS-модулей и сериализации данных.
- [ ] Добавить ESLint с запретом неявных глобалов.
- [ ] Настроить ESLint guards для длины функций и cyclomatic complexity с локальными обоснованными исключениями.
- [ ] Добавить formatter/check-команду и единый style для нового JavaScript.
- [ ] Добавить Stylelint/`stylelint-scss` и правила, запрещающие color literals вне variables/color files.
- [ ] Добавить Playwright smoke suite либо минимальный browser fixture, пригодный для проверки compiled assets.
- [ ] Покрыть PHP feature-тестами DataTables async request/response: pagination, global search, ordering, column filters, payload, distinct и row class.
- [ ] Зафиксировать browser-сценарии DataTables 1 до обновления: state restore/clear, range/date/select/text filters, actions, inline edit, auto-update, tooltip/lazyload after draw.
- [ ] Зафиксировать Vue 2 browser-сценарии: env editor, file/image/images, select/multiselect и related elements, включая динамическое добавление групп.
- [ ] Добавить render snapshots/contract assertions для layout, navigation, forms, displays, validation и messages текущей темы.
- [ ] Добавить tests, загружающие пакет с прежним полным опубликованным конфигом и с конфигом, в котором отсутствуют новые keys.
- [ ] Добавить CI-команды для PHP и frontend тестов.

Критерий завершения: текущая реализация проходит тесты, которые способны обнаружить основные регрессии миграции.

### Этап 2. Выделить headless core и theme contract

- [ ] Расширить существующий `TemplateInterface` до `ThemeInterface`, сохранив адаптер для старого `TemplateDefault` на время миграции.
- [ ] Перенести стандартные Bootstrap/AdminLTE-классы встроенных button, form, card/panel, grid, navigation, table, alert, badge и validation components из PHP core в Blade views legacy theme.
- [ ] Сохранить прямой API пользовательских HTML attributes/classes и проверить, что theme rendering передаёт их без преобразований и потерь.
- [ ] Разделить общие Blade views, theme-owned layout/views и feature-owned views.
- [ ] Извлечь текущую AdminLTE 3/Bootstrap 4 реализацию как временную reference/legacy theme без изменения поведения.
- [ ] Добавить contract tests, которые рендерят один и тот же PHP display/form через разные test themes.
- [ ] Определить theme asset manifest и capability API: tabs, tooltip, dropdown, modal, notification, icons и table presentation.
- [ ] Сохранить `sleeping_owl.template` как selector реализации темы и передать theme-owned config values без переименования.
- [ ] Проверить `body_default_class`, logo/favicon/menu/footer/version/show_mode и layout card flags в legacy и новых темах.
- [ ] Запретить core imports из каталогов конкретной темы автоматической проверкой.

Критерий завершения: PHP core не генерирует framework-specific classes, а текущий UI продолжает работать через изолированную legacy theme.

### Этап 3. Подготовить минимальный native frontend foundation

- [ ] Разделить сборку на `admin-core.js`, `admin-core.css`, feature chunks и независимые theme bundles.
- [ ] Создать Sass entrypoints и отдельные `_variables.scss`/`_colors.scss` для core, features и themes.
- [ ] Перевести затронутые plain CSS sources в SCSS partials; generated vendor/Tailwind CSS не редактировать вручную.
- [ ] Ввести публичные `:root` custom properties с префиксом `--soa-*` для runtime/no-build настройки цветов и основных theme values.
- [ ] Добавить versioned asset manifest и PHP resolver для precompiled core/theme/feature bundles.
- [ ] Расширить существующие `sleepingowl:install` и `sleepingowl:update`: публиковать выбранные precompiled theme/feature assets, проверять manifest/version, не вызывать npm и не компилировать frontend.
- [ ] Сохранить обратную совместимость `sleepingowl:update` как минимум на уровне неинтерактивного forced asset publish, пригодного для deployment scripts.
- [ ] Переписать внутреннюю реализацию `Admin.Events` на native events, сохранив текущий публичный интерфейс.
- [ ] Добавить узкие DOM helpers только для реально повторяющихся операций.
- [ ] Реализовать `Admin.Tables` registry и adapter interface.
- [ ] Разделить table implementation минимум на lifecycle, options, transport, filters, state, selection и hooks; registry не содержит реализацию этих обязанностей.
- [ ] Перевести общий reload, selected rows и clear state на `Admin.Tables`.
- [ ] Перевести `Admin.Asset`, buttons, checkbox/control events и простые DOM-модули на native API.
- [ ] Устранить неявные глобалы (`urlName`, `activeFilters`, `array`, присваивания внутри условий и подобные места).
- [ ] Реализовать единый lifecycle для динамических компонентов: `scan(root)`, `mount(element)`, `destroy(element)`.
- [ ] Не включать в core reset, layout framework, DataTables, Vue или theme-specific CSS.

Критерий завершения: минимальный core bundle не зависит от jQuery, Bootstrap, AdminLTE, Tailwind, Vue или DataTables; legacy UI работает через подключаемые adapters.

### Этап 4. Перейти на Vue 3 islands

- [ ] Временно подключить `@vue/compat` с явным перечнем compat flags либо сразу Vue 3, согласно решению этапа 0.
- [ ] Заменить `new Vue({ el: '#vueApp' })` на factory небольших app instances для отдельных islands.
- [ ] Заменить глобальную регистрацию `Vue.component`/`Vue.extend` на `createApp`/`defineComponent` и локальную регистрацию.
- [ ] Заменить `Vue.http`/`vue-resource` на core HTTP client поверх Axios/`fetch`.
- [ ] Заменить `Vue.prototype.$trans` на injection/composable без глобального mutable API.
- [ ] Перенести все 10 `inline-template`: env editor, file/image/images, select/multiselect, related elements.
- [ ] Перевести `$set` на обычные reactive assignments и проверить array updates.
- [ ] Обновить/заменить Vue wrappers для multiselect и drag/drop.
- [ ] На каждый island реализовать `mount`/`unmount`, повторную инициализацию и защиту от двойного mount.
- [ ] Вынести upload, serialization, HTTP/error mapping и sortable logic из Vue components в отдельные composables/services; components оставить orchestration/presentation слоем.
- [ ] Проверить Blade escaping, `@{{ }}`, JSON props, CSP nonce и отсутствие исполнения пользовательского HTML как Vue template.
- [ ] Удалить `@vue/compat`, compat flags, Vue 2 packages и глобальный `Vue` до завершения этапа.
- [ ] Переключить финальную сборку на runtime-only Vue 3 после переноса всех runtime templates в заранее компилируемые components.

Критерий завершения: production bundle использует Vue 3 без compatibility build и `inline-template`; server-rendered Blade безопасно передаёт данные изолированным islands.

### Этап 5. Перейти на DataTables 2 feature driver

- [ ] Обновить DataTables core и extensions; отделить engine от theme presentation adapters.
- [ ] Не создавать новый монолитный `datatables.js`: lifecycle, request/response, filters, state, selection, actions и draw hooks должны быть отдельными тестируемыми modules.
- [ ] Удалить собственный Bootstrap 3 renderer и обращения к `settings.oApi`.
- [ ] Переписать инициализацию на `new DataTable(element, options)`.
- [ ] Перевести legacy options (`sDom`, `bStateSave`, `fnDrawCallback`) на актуальные DataTables 2 options.
- [ ] Перенести error handling, custom ordering и custom search без прямого использования `$.fn` в коде проекта, насколько позволяет публичный API DataTables 2.
- [ ] Переписать filters module на native DOM: text, select, date, daterange и numeric range.
- [ ] Переписать state filters storage и исключить коллизии между несколькими таблицами.
- [ ] Сохранить поведение `state_datatables`, `state_filters`, `default_datatables_method`, `datatables`, `datatables_highlight` и `dt_autoupdate*`; задокументировать только реально несовместимые DataTables 1 options.
- [ ] Перевести draw hooks: `Admin.Events`, tooltip, lazyload, highlight и inline editor.
- [ ] Перевести actions и auto-update на `Admin.Tables.reload()`.
- [ ] Удалить DataTables presentation CSS из core; добавить отдельные presentation adapters для AdminLTE и Tailwind themes.
- [ ] Проверить sync и async displays, несколько таблиц на странице и таблицу внутри tab.

Критерий завершения: все существующие табличные сценарии работают на DataTables 2, а код SleepingOwlAdmin не вызывает jQuery DataTables plugin API.

### Этап 6. Заменить остальные jQuery-плаги и legacy modules

- [ ] Select2 и AJAX select.
- [ ] Date, datetime и daterange controls.
- [ ] Dependent dropdown.
- [ ] X-editable/inline editor.
- [ ] Nestable tree.
- [ ] Magnific Popup/lightbox.
- [ ] Theme tooltip/tab/dropdown/sidebar capabilities.
- [ ] jQuery-операции в file/image/files/images Vue 3 islands.
- [ ] jQuery-операции в WYSIWYG wrappers и related elements.
- [ ] Sidebar cookie/state integration.
- [ ] Удалить неиспользуемые wrappers и комментарии со старым jQuery-кодом.

Критерий завершения: в исходниках нет runtime-вызовов `$()`/`jQuery()` и ни один выбранный UI-плагин не требует глобального jQuery.

### Этап 7. Реализовать готовые темы

- [ ] Реализовать современную `AdminLTETheme`, инкапсулирующую собственные Bootstrap/AdminLTE assets, markup и component adapters.
- [ ] Реализовать `TailwindTheme`, которая не загружает Bootstrap/AdminLTE и поставляется с готовым production CSS.
- [ ] Для каждой темы определить собственные Sass variables и значения общих `--soa-*` custom properties без hardcoded colors в component partials.
- [ ] Реализовать dark mode через переопределение variables на theme container/root, без дублирования component stylesheet.
- [ ] Поддержать `sidebar_background_color` в AdminLTE и Tailwind themes через `--soa-sidebar-bg`; `null` использует собственный default темы.
- [ ] Для Tailwind customisation предоставить preset/source/content instructions, чтобы пользовательские theme views попадали в CSS build.
- [ ] Поставлять полный готовый Tailwind production CSS для стандартного режима без Tailwind CLI у пользователя.
- [ ] Предоставить документированный способ подключить дополнительный CSS и при необходимости простые theme settings/CSS variables без пересборки core.
- [ ] Реализовать test/custom theme без UI framework как проверку достаточности публичного контракта.
- [ ] Проверить одинаковое функциональное поведение feature drivers в AdminLTE и Tailwind themes.
- [ ] Проверить, что одновременно загружается только один theme bundle.
- [ ] Добавить theme selection через конфигурацию и документированный service provider hook.
- [ ] Измерить core, feature и theme bundles по отдельности.

Критерий завершения: установка выбирает AdminLTE, Tailwind или custom theme без изменения core; Tailwind/custom не получают Bootstrap/AdminLTE assets транзитивно.

### Этап 8. Удалить jQuery и очистить сборку

- [ ] Удалить `resources/assets/js_owl/libs/jquery.js` и его import.
- [ ] Удалить `jquery`, `jquery-form` и все оставшиеся jQuery-only dependencies из `package.json`.
- [ ] Удалить глобальные `window.$`, `window.jQuery`, `global.jQuery`.
- [ ] Проверить `npm ls jquery` в соответствии с выбранным на этапе 0 критерием.
- [ ] Проверить исходники поиском `jquery`, `jQuery`, `$(` с ручной разметкой допустимых совпадений.
- [ ] Проверить production bundle и license-файлы на наличие jQuery.
- [ ] Удалить устаревшие картинки/assets x-editable и прочие orphaned resources.
- [ ] Сравнить размер production bundle с baseline.

Критерий завершения: выбранный критерий удаления jQuery выполнен и закреплён автоматической проверкой.

### Этап 9. Проверить миграцию на крупном pilot-проекте

- [ ] До обновления снять inventory используемых displays, forms, columns, filters, actions, widgets, editors, uploads, tree и navigation.
- [ ] Найти опубликованные/переопределённые Blade views, пользовательские CSS-классы, jQuery hooks, DataTables options/events и прямые imports assets.
- [ ] Зафиксировать исходные screenshots и критические пользовательские сценарии.
- [ ] Создать отдельную migration branch в pilot-проекте; не смешивать её с прикладными feature changes.
- [ ] Подключить новую версию пакета воспроизводимым способом и пройти migration guide без скрытых ручных шагов.
- [ ] Обновить pilot-проект без запуска npm/Vite/Tailwind, используя `php artisan sleepingowl:update`, и зафиксировать только PHP/Composer/Artisan шаги deployment.
- [ ] Проверить pilot сначала на default theme, затем минимум на одной альтернативной теме для ключевых экранов.
- [ ] Любую общую проблему исправлять в SleepingOwlAdmin и добавлять regression test; project-specific override оставлять только для действительно прикладной логики.
- [ ] Дополнять migration guide по фактически найденным несовместимостям.
- [ ] Запустить pilot с его существующим опубликованным `sleeping_owl.php`, не заменяя конфиг новым файлом; изменения вносить только для подтверждённых deprecated/removed keys.
- [ ] Составить итоговый отчёт: автоматические изменения, необходимые ручные изменения, удалённые overrides, оставшиеся project-specific adapters.

Критерий завершения: крупный проект, использующий почти весь функционал, работает на новой версии без форка core и без незадокументированных исправлений.

### Этап 10. Документация, compatibility и выпуск

- [ ] Обновить README и frontend build instructions.
- [ ] Добавить migration guide с заменой пользовательских jQuery hooks, Bootstrap/AdminLTE classes/selectors, Vue 2 extensions, `inline-template` и DataTables 1 options.
- [ ] Опубликовать config migration matrix и примеры только новых/изменённых keys вместо требования перепубликовать весь конфиг.
- [ ] Добавить руководство по выбору AdminLTE/Tailwind theme и созданию custom theme.
- [ ] Обновить PHPDoc/facades/interfaces для актуального API.
- [ ] Добавить CHANGELOG с перечнем breaking changes.
- [ ] Обновить опубликованные assets через `npm run production`.
- [ ] Проверить, что `mix-manifest.json` соответствует собранным файлам.
- [ ] Выполнить полный PHP/frontend/browser test suite.
- [ ] Выполнить установку зависимостей и production build в чистой среде по lock-файлу.
- [ ] Отдельно установить release artifact в чистое Laravel-приложение без Node.js/npm и проверить AdminLTE и Tailwind themes на готовых assets.
- [ ] Провести ручной smoke test эталонных экранов.

Критерий завершения: ветка готова к major release и содержит инструкции обновления для поддерживаемых проектов.

## Обязательные проверки

Минимальный набор команд к концу миграции:

```bash
composer install
vendor/bin/phpunit
npm ci
npm run lint
npm test
npm run test:e2e
npm run production
npm ls jquery
php artisan sleepingowl:update
```

Дополнительно проверить поиском:

```bash
rg -n "jquery|jQuery|\\$\\(" resources/assets/js_owl resources/views package.json
rg -n "data-toggle|data-target|data-dismiss" resources/views
rg -n "inline-template|new Vue|Vue\\.component|Vue\\.extend|Vue\\.http|Vue\\.prototype" resources/assets/js_owl resources/views
rg -n "btn-|form-control|form-group|card-|col-(sm|md|lg)|pull-right" src
```

Совпадения в документации, changelog или migration guide допустимы; runtime-код проверяется вручную и автоматическим lint rule.

## Функциональная матрица приёмки

### DataTables

- [ ] sync и async таблицы;
- [ ] GET и POST загрузка;
- [ ] pagination и смена page length;
- [ ] global search;
- [ ] сортировка, включая DateTime/custom order;
- [ ] text/select/date/daterange/numeric range filters;
- [ ] state save, restore и clear;
- [ ] payload и custom ajax data hooks;
- [ ] row class callback;
- [ ] hidden/orderable/width column settings;
- [ ] несколько таблиц на одной странице;
- [ ] таблица в tab;
- [ ] responsive layout;
- [ ] processing/error state;
- [ ] auto-update;
- [ ] lazy images, tooltip и column highlight после draw.

### Actions и editing

- [ ] select one/select all;
- [ ] bulk action submit/cancel/error;
- [ ] action form serialization;
- [ ] delete/control confirmation;
- [ ] inline text/select/date/datetime/checklist editing;
- [ ] reload после успешного действия;
- [ ] CSRF и backend validation errors.

### Остальная админка

- [ ] sidebar, dark mode и сохранение состояния;
- [ ] tabs и восстановление активной вкладки;
- [ ] tooltips, dropdowns, alerts и messages;
- [ ] select/multiselect/AJAX/dependent select;
- [ ] date/time/daterange;
- [ ] single/multiple file и image upload;
- [ ] drag-and-drop сортировка файлов/images;
- [ ] tree reorder, max depth, expand/collapse;
- [ ] lightbox/gallery;
- [ ] WYSIWYG initialisation;
- [ ] related form elements.

### Vue 3

- [ ] каждый stateful widget монтируется как отдельный island;
- [ ] server data передаётся как корректный JSON/props без выполнения непроверенного HTML;
- [ ] отсутствует `inline-template`;
- [ ] отсутствуют глобальные `Vue`, `Vue.component`, `Vue.extend`, `Vue.http` и `Vue.prototype`;
- [ ] отсутствует `@vue/compat` в production dependencies/bundle;
- [ ] динамически добавленные related groups монтируют и демонтируют вложенные widgets ровно один раз;
- [ ] file/image uploads, multiselect, sorting и validation корректно обновляют reactive state;
- [ ] несколько одинаковых islands на странице не разделяют состояние.

### Темы

- [ ] core работает без подключённого Bootstrap/AdminLTE/Tailwind CSS;
- [ ] AdminLTE theme полностью функциональна и владеет всеми Bootstrap/AdminLTE dependencies;
- [ ] Tailwind theme полностью функциональна и не загружает Bootstrap/AdminLTE;
- [ ] custom test theme реализуется только через публичные contracts, без импортов внутренних файлов;
- [ ] один PHP display/form даёт одинаковое поведение во всех темах;
- [ ] theme selection не включает assets невыбранной темы;
- [ ] пользовательские HTML attributes и theme-specific classes передаются без преобразований и не теряются;
- [ ] встроенные buttons, controls, validation states и responsive grid получают штатные classes из Blade views каждой темы;
- [ ] core не содержит class resolver и не пытается преобразовывать классы одной темы в классы другой;
- [ ] Tailwind custom views могут быть включены в пользовательский CSS scan по документированной инструкции.

### No-build consumer experience

- [ ] чистое Laravel-приложение без Node.js устанавливает админку через Composer;
- [ ] готовые assets публикуются/обновляются существующей `php artisan sleepingowl:update` без компиляции;
- [ ] выбор AdminLTE или Tailwind выполняется конфигурацией и не требует изменения package sources;
- [ ] создание новой модели, section, form и DataTable через PHP DSL не требует frontend build;
- [ ] стандартная TailwindTheme работает без пользовательского Tailwind config/content scan;
- [ ] дополнительный CSS подключается без пересборки core; ограничения произвольных Tailwind utilities явно документированы;
- [ ] пользовательский CSS или JS подключается отдельным asset, не пересобирая core/theme bundles;
- [ ] отсутствующие/устаревшие published assets дают понятную диагностическую ошибку с командой обновления;
- [ ] версии PHP package, asset manifest и published bundles согласованы;
- [ ] production deployment документирован только через Composer/PHP/Artisan для обычного пользователя.

### Config compatibility

- [ ] прежний опубликованный `config/sleeping_owl.php` загружается без fatal errors и сохраняет ожидаемое поведение поддерживаемых keys;
- [ ] `sleepingowl:update` не перезаписывает пользовательский config;
- [ ] отсутствие новых keys покрывается defaults внутри пакета;
- [ ] `template` выбирает AdminLTE, Tailwind или custom implementation без обязательного переименования ключа;
- [ ] `bootstrapDirectory` продолжает указывать на application admin bootstrap files и не связано с выбранной CSS-темой;
- [ ] route/auth/env/upload/date-time/WYSIWYG/search/alias settings не меняются из-за frontend migration;
- [ ] table/state/autoupdate settings сохраняют ключи и документированное поведение;
- [ ] class/HTML config values передаются выбранной теме без преобразования;
- [ ] каждый deprecated/removed key присутствует в config migration matrix с причиной, replacement/fallback и release timeline;
- [ ] pilot-проект обновляется со своим существующим config, без полной повторной публикации файла.

### Декомпозиция и качество кода

- [ ] новые функции имеют одну ответственность и укладываются в целевой размер; исключения длиннее 40 строк обоснованы локально;
- [ ] длинные legacy-функции, затронутые миграцией, разбиты после characterization tests;
- [ ] network, DOM, state, config normalization и rendering не смешаны в одном методе;
- [ ] отсутствуют новые god objects и глобальные mutable registries с feature logic внутри;
- [ ] table driver разделён на lifecycle/options/transport/filters/state/selection/hooks;
- [ ] Vue islands используют небольшие components и composables/services для сложной логики;
- [ ] theme Blade views не содержат бизнес-логику и большие inline scripts;
- [ ] helpers расположены рядом с feature, если они не доказали общую применимость;
- [ ] ESLint complexity/function-length/style checks проходят без глобальных disable directives;
- [ ] публичные границы modules покрыты unit/contract tests и имеют понятные имена.

### Sass и переменные стилей

- [ ] все first-party handwritten styles находятся в SCSS files; plain CSS допускается только как generated/vendor artifact;
- [ ] core, каждый feature и каждая theme имеют явный Sass entrypoint и локальный variables file;
- [ ] color literals отсутствуют в component SCSS и объявлены централизованно в variables/colors либо `:root`;
- [ ] runtime-настраиваемые значения используют CSS custom properties с префиксом `--soa-*`;
- [ ] dark mode переопределяет variables, а не дублирует component rules;
- [ ] JavaScript не устанавливает theme colors напрямую;
- [ ] динамический config color проходит валидацию и записывается в scoped CSS custom property;
- [ ] `sidebar_background_color` меняет фон sidebar в AdminLTE/Tailwind без rebuild, а `null` возвращает default темы;
- [ ] inline styles не используются для theme styling;
- [ ] Stylelint/`stylelint-scss` проходит без глобальных отключений правил;
- [ ] generated Tailwind/vendor CSS собирается автоматически и не редактируется вручную.

## Definition of Done

Миграция считается завершённой, когда одновременно выполнены условия:

- правило декомпозиции выполнено: новый код состоит из небольших однозадачных функций/modules, а затронутые legacy-монолиты не перенесены как есть;
- first-party стили написаны на Sass, а colors/configurable theme values централизованы в variables files и `--soa-*` root properties;
- исходный код SleepingOwlAdmin не использует jQuery API и не создаёт jQuery globals;
- core не импортирует Bootstrap, AdminLTE, Tailwind, DataTables или Vue и имеет отдельный минимальный bundle;
- конечный пользователь использует все стандартные функции и выбирает готовую тему без Node.js и frontend-сборки;
- release содержит согласованные versioned core/theme/feature bundles и asset manifest;
- большинство существующих config keys сохранено, а старый опубликованный config является обязательным compatibility fixture;
- PHP core не генерирует framework-specific CSS classes;
- AdminLTE, Tailwind и custom theme выбираются через стабильный публичный contract;
- в страницу попадают assets только выбранной темы и востребованных features;
- DataTables 2 использует только публичные API и явный theme presentation adapter;
- все jQuery-only плагины удалены либо заменены;
- Vue 3 используется через изолированные islands; Vue 2, `inline-template`, `vue-resource` и `@vue/compat` отсутствуют в финальной сборке;
- PHP API таблиц и серверный async flow покрыты тестами;
- browser smoke suite покрывает критические сценарии;
- production assets собраны воспроизводимо по lock-файлу;
- выбранный критерий присутствия jQuery в dependency tree выполнен;
- migration guide перечисляет все пользовательские breaking changes;
- крупный pilot-проект успешно обновлён по migration guide, а найденные общие регрессии закреплены тестами пакета;
- PHP, frontend и browser тесты проходят в чистой среде.

## Журнал выполнения

| Дата | Этап | Решение/результат | Commit |
| --- | --- | --- | --- |
| 2026-09-06 | Планирование | Создан исходный план миграции; реализация не начата | — |
| 2026-09-06 | Расширение scope | Добавлены headless core, сменные AdminLTE/Tailwind/custom темы, минимальные bundles и миграция Vue 2 → Vue 3 islands | — |
| 2026-09-06 | Принцип реализации | Разрешено улучшать разнородный legacy-код; сохраняется подтверждённое поведение, а не случайная внутренняя структура | — |
| 2026-09-06 | Pilot | Крупный пользовательский проект принят как обязательная интеграционная проверка перед major release | — |
| 2026-09-06 | Distribution | Зафиксирован no-build consumer contract: Composer/PHP/Artisan для пользователей, frontend build только для maintainers и авторов тем | — |
| 2026-09-06 | Update command | Существующая `sleepingowl:update` закреплена как единая команда публикации и проверки готовых assets | — |
| 2026-09-06 | Config compatibility | `config/sleeping_owl.php` признан публичным контрактом; ключи сохраняются по умолчанию и контролируются migration matrix/tests | — |
| 2026-09-06 | Правило №1 | Декомпозиция и читаемость объявлены главным правилом; добавлены пределы размера функций, feature boundaries и CI guards | — |
| 2026-09-06 | Styling contract | First-party стили закреплены за Sass; colors и настраиваемые значения централизуются через variables files и `--soa-*` root properties | — |
| 2026-09-06 | Sidebar color | В config добавлен планируемый `sidebar_background_color`, применяемый через `--soa-sidebar-bg` без frontend rebuild | — |
| 2026-09-06 | Этап 0 / запуск | План закреплён в Git как источник истины; ветка и чистое рабочее дерево проверены; выполнение переведено в активный статус | `2029528c` |
| 2026-09-06 | Этап 0 / DataTables packages | Проверены npm metadata и чистая production-установка: DataTables `2.3.8` + Responsive `3.0.8` обязательно включают jQuery; DataTables `3.0.3` отмечен только как отдельная будущая major-альтернатива | текущий commit |
| 2026-09-06 | Этап 0 / критерий jQuery | Выбран базовый критерий: first-party и публичный runtime API полностью без jQuery; транзитивный jQuery разрешён только как изолированная внутренняя зависимость DataTables 2 с точным allowlist | текущий commit |
| 2026-09-06 | Этап 0 / браузеры | Зафиксирована modern-only матрица: последние 2 Chrome/Edge/Firefox, Firefox ESR, Safari/iOS `>= 16.4`; IE и legacy Edge не поддерживаются | текущий commit |
| 2026-09-06 | Этап 0 / границы | Разделены PHP/frontend core, feature drivers, themes, presentation adapters и user extensions; сохранён ключ `template`, legacy `TemplateInterface` получает переходный adapter | текущий commit |
| 2026-09-06 | Этап 0 / темы | Подтверждены AdminLTE 4/Bootstrap 5 и Tailwind 4; AdminLTE остаётся default ради upgrade/config compatibility, но загружается только как выбранная опциональная тема | текущий commit |
| 2026-09-06 | Этап 0 / packaging | Выбран единый Composer package и монорепозиторий с независимо собираемыми core/feature/theme entries; внешние custom themes могут поставляться отдельными готовыми packages | текущий commit |
| 2026-09-06 | Этап 0 / no-build | No-build consumer UX принят как release-blocking contract и будущий CI smoke scenario без Node.js/npm; все стандартные assets обязаны входить в Composer artifact | текущий commit |
| 2026-09-06 | Этап 0 / update command | Зафиксирован staging/validation/manifest-last протокол, `--check`, fail-fast runtime diagnostic и запрет изменения опубликованного config/application files | текущий commit |
| 2026-09-06 | Этап 0 / Vue strategy | Выбран короткий `@vue/compat` этап с миграцией по одному island и обязательным удалением compat до release; baseline уточнён до 9 `inline-template` и 7 global components | текущий commit |
| 2026-09-06 | Этап 0 / Vue props | Зафиксирован typed `data-*` contract для скаляров и безопасный `application/json` payload через `Js::encode()` для сложных props; выполнение server data как template/code запрещено | текущий commit |
| 2026-09-06 | Этап 0 / Sass structure | Определены независимые Sass entries и локальные `_variables.scss`/`_colors.scss` для core/features/themes; first-party modules переходят на `@use`/`@forward`, Tailwind output остаётся generated exception | текущий commit |
| 2026-09-06 | Этап 0 / colors | Color literals ограничены `_colors.scss` и узкими vendor/generated/brand exceptions; dark mode меняет только `--soa-*` в root selector, sidebar config проходит validation | текущий commit |
