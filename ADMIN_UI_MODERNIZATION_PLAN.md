# План миграции SleepingOwlAdmin на headless UI core, сменные темы, Vue 3 и DataTables 2

## Статус и границы

- Статус: выполняется.
- Текущий этап: **Этап 7 — готовые AdminLTE, Tailwind и custom themes**.
- Точка возобновления: подготовить самодостаточный browser entry для `feature:table` и runtime notification adapter дерева, затем переключить `AdminLTETheme` с aggregate на versioned logical bundles и реализовать полноценную Tailwind presentation без транзитивной загрузки Bootstrap/AdminLTE. Browser entries forms/lightbox/tree и profile-aware `shared:compatibility`/`shared:vue` уже готовы вместе с `shared:icons`; новый config default указывает на прямую `AdminLTETheme`, её standalone CSS содержит Bootstrap/AdminLTE, а metadata явно объявляет общие assets и component adapters. Старые опубликованные config с `TemplateDefault` продолжают работать через legacy adapter. Этап 6 завершён: first-party runtime не содержит jQuery calls и не создаёт `$`/`jQuery` globals; DataTables 2 использует jQuery только внутри vendor bundle. Native alert сохранил `data-dismiss="alert"`, как dropdown/tooltip сохранили `data-toggle`, а sidebar — `data-widget`; replacement markers вроде `data-soa-dropdown*` и `data-soa-alert*` не вводятся.
- Рабочая ветка: `codex/remove-jquery-datatables2`.
- Read-only reference project: `D:\domains\laluna.kit`; считать ранее собранный inventory достаточным, не сканировать проект/`Modules` повторно и обращаться только к конкретному файлу при точечной необходимости; не изменять и не запускать команды с побочными эффектами без отдельного разрешения.
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

- после characterization tests Vue обновляется до Vue 3 с compat build в строгом `MODE: 3`; только явно перечисленные Vue 2 behaviors временно включаются для существующих legacy views, а `COMPILER_INLINE_TEMPLATE` ограничен их исходным набором;
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

Dependency baseline, закреплённый после составления плана:

- `package-lock.json` lockfile v3 создан npm `11.17.0` на Node.js `24.19.0`; `.gitignore` больше не исключает lock-файл;
- lock содержит 1376 package entries, 34 top-level runtime dependencies и 7 top-level dev dependencies;
- чистый `npm ci --ignore-scripts --no-audit --no-fund` завершился с exit code `0` и установил 1370 packages;
- `npm ls --depth=0` и `npm ls jquery --all` завершились с exit code `0`;
- npm сообщает legacy peer conflict: `bootstrap-switch@3.3.4` из AdminLTE 3 требует Bootstrap 3, тогда как root использует Bootstrap 4.6.2;
- `admin-lte@3.2.0` транзитивно устанавливает множество jQuery plugins и DataTables extensions, включая отдельные ветки DataTables 2; эти зависимости не считаются используемыми features и исчезнут вместе с монолитной AdminLTE 3 dependency.

Production asset/license baseline хранится в `docs/modernization/baseline/frontend.json` и воспроизводится командой `npm run baseline:frontend`:

- четыре реально загружаемых production entries занимают 2 585 357 bytes raw и 587 787 bytes gzip;
- `admin-app.css`: 952 803 raw / 112 572 gzip bytes;
- `admin-app.js`: 1 631 541 raw / 474 572 gzip bytes;
- `vue.js`: 992 raw / 602 gzip bytes; `modules.js`: 21 raw / 41 gzip bytes;
- для каждого asset сохранён SHA-256, а для отчёта — SHA-256 соответствующего `package-lock.json`;
- license inventory содержит 869 уникальных runtime `name@version`, их declared license и признак direct dependency;
- 12 legacy packages не объявляют license в доступной lock/package metadata и помечены `UNKNOWN`; это явный audit backlog, а не разрешение включать packages с неустановленной лицензией в release;
- отчёт не содержит timestamp/absolute paths и при неизменных inputs генерируется без diff.

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

### Выбранные замены legacy UI plugins

| Текущая реализация | Новая реализация | Причина и граница |
| --- | --- | --- |
| Vue Multiselect 2.x, Select2, `dependent-dropdown` | Vue Multiselect 3.5.x island + отдельные async/dependent composables | сохраняет удобный current UX, single/multiple, search, AJAX, tagging и limits; transport и зависимости полей не смешиваются с presentation component |
| `bootstrap4-datetimepicker`, `daterangepicker`, Moment integration | Air Datepicker 3.6.x | один dependency-free driver поддерживает date, time и range; parsing/serialization остаются отдельным модулем |
| Magnific Popup | GLightbox 3.3.x | dependency-free image/gallery lightbox с небольшим публичным adapter |

На 2026-09-06 проверены npm metadata: стабильный `vue-multiselect@3.5.0` для Vue 3 (MIT; без объявленных production dependencies), `air-datepicker@3.6.0` (MIT; без dependencies) и `glightbox@3.3.1` (MIT; без dependencies). Точные версии будут закреплены lock-файлом.

Правила миграции:

- public PHP DSL по возможности сохраняется: `setSelect2()` становится deprecated compatibility alias нового select driver, а несовместимые raw Select2 options проходят migration matrix, а не молча игнорируются;
- обычный Select и MultiSelect сохраняют Vue Multiselect UX, но каждый экземпляр монтируется как независимый Vue 3 island; один глобальный Vue app для формы не создаётся;
- текущий AJAX endpoint/payload сохраняется через composable transport; debounce, cancellation, dependency values, loading/empty/error states получают contract tests;
- произвольный HTML label не разрешён по умолчанию. Legacy `data-select2-allow-html` deprecated; custom renderer принимает DOM node либо явно sanitized HTML через отдельный opt-in API;
- date value, display format и server serialization разделяются; driver не хранит бизнес-дату только в локализованной строке;
- date, datetime и range используют один lifecycle, но отдельные маленькие option normalizers;
- lightbox активируется нейтральным component marker и корректно обновляет динамические DataTables/file gallery elements;
- vendor CSS не импортируется в core: structural feature styles и presentation adapters распределяются по ранее утверждённым Sass boundaries;
- Air Datepicker и GLightbox остаются native drivers; Vue используется для select/multiselect, где существующий reactive UX действительно полезен.
- Tom Select не входит в standard dependencies. Вернуться к нему можно только при подтверждённом feature gap Vue Multiselect в characterization/pilot tests, отдельным записанным решением.

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
- Composer artifact обязательно содержит два согласованных заранее собранных профиля assets: `production` и `development`; оба устанавливаются без Node.js/npm;
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
- Runtime resolver проверяет manifest до render. Отсутствующий, повреждённый, несовместимый по schema или checksum manifest вызывает специализированную диагностическую ошибку с точной командой `php artisan sleepingowl:update`; silent fallback на unversioned files запрещён.
- Если manifest структурно валиден и его файлы доступны, но `package_version` не совпадает с установленной Composer-версией PHP package, админка может загрузить этот последний целостный набор и обязана показать постоянное локализованное уведомление в footer с точной командой `php artisan sleepingowl:update`. Проверка выполняется один раз на request и не требует frontend-запроса.
- Данные о mismatch принадлежат PHP asset health service, а presentation — footer partial выбранной темы: AdminLTE и Tailwind получают аккуратные собственные варианты через Sass/`--soa-*`; custom theme получает публичный status contract и сама решает разметку. PHP core не возвращает CSS-классы.
- Добавляется `sleepingowl:update --check`: read-only проверка установленного manifest/files для deployment health check; успех и ошибка имеют стабильные exit codes.
- Release CI проверяет идемпотентный повторный запуск update, recovery после искусственно оборванной staging copy и отсутствие изменений config/application files.

- Первый major поставляется одним Composer package `laravelrus/sleepingowl`: PHP core, обе встроенные темы, standard feature drivers, views, manifest и готовые production/development assets версионируются совместно.
- Исходники разделяются внутри монорепозитория по `core/features/themes`, а build создаёт независимые entries; монорепозиторий не означает один монолитный browser bundle.
- Composer archive содержит готовые assets обеих встроенных тем. Лишняя тема занимает место только в vendor/public после публикации, но не загружается браузером и не влияет на runtime.
- В первой итерации встроенные темы не выносятся в отдельные Composer packages: атомарная версия исключает несовместимые сочетания PHP contracts, Blade views и assets и сохраняет одну update-команду.
- Внешняя custom theme может поставляться отдельным Composer package с service provider, views и готовым manifest fragment; Node.js нужен автору такой темы, но не её потребителю.
- Выделение официальных тем в отдельные packages допускается только после стабилизации `ThemeInterface` и manifest schema и требует отдельного compatibility решения.
- Репозиторий и релизные archives содержат готовые versioned production/development bundles: core, feature chunks и bundles поддерживаемых тем.
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

### Production и development profiles

- Существующий ключ `sleeping_owl.dev_assets`, получающий значение из `ADMIN_DEV_ASSETS`, остаётся единственным runtime-переключателем: `false` выбирает профиль `production`, `true` — профиль `development`.
- Оба профиля имеют одинаковые логические manifest entries, набор core/features/themes и публичные API. Переключение профиля не меняет PHP/Blade contract, выбранную тему или список активных features.
- Production-профиль содержит minified bundles и production runtime-only build Vue 3; Vue warnings/devtools выключены, development Vue и ссылки на development source maps в загружаемые production entries не попадают.
- Development-профиль содержит читаемые unminified bundles, source maps и отдельный development runtime-only build Vue 3 с warnings, понятными component names/stacks и поддержкой Vue Devtools. Это позволяет отлаживать штатные и пользовательские Vue islands/custom modules.
- Vue runtime каждого профиля выделяется в один общий versioned chunk, чтобы все штатные islands и зарегистрированные через публичный extension API custom modules использовали одну Vue instance, а не включали собственные копии Vue.
- Development-профиль не возвращает runtime template compiler, `inline-template`, `@vue/compat`, `window.Vue` или другие Vue 2 globals: различается режим сборки и диагностика, но не архитектура приложения.
- Manifest хранит оба профиля и checksums всех их файлов. Resolver сначала выбирает профиль по `dev_assets`, затем разрешает те же логические ids (`core`, `theme:<id>`, `feature:<id>`, `feature:<id>:theme:<id>`) только внутри выбранного профиля; смешивание prod/dev chunks является ошибкой.
- `sleepingowl:install` и `sleepingowl:update` публикуют и валидируют оба заранее собранных профиля атомарно. Для переключения `ADMIN_DEV_ASSETS` пользователю не требуется повторная frontend-сборка; после изменения env достаточно обычного сброса Laravel config cache согласно deployment-процессу.
- Development assets предназначены для локальной/отладочной среды. Документация явно предупреждает не включать `ADMIN_DEV_ASSETS=true` в production из-за размера bundles, source maps и расширенной диагностики.

### Отказ от `kodicms/laravel-assets`

- `kodicms/laravel-assets` удаляется из Composer dependencies и lock-файла. В runtime-коде, contracts, PHPDoc, tests, config defaults и stubs не остаётся обязательных ссылок на namespace `KodiCMS\Assets`.
- Полная копия API пакета не переносится. Внутри SleepingOwl реализуется только фактически используемый минимум: описание CSS/JS asset, registry по handle, зависимости и детерминированный порядок, head/footer placement, HTML attributes, именованные packages, title/meta/favicon и безопасная передача global config.
- Обязанности разделяются на небольшие классы: value object asset, asset registry/sorter, package registry и meta renderer. Manifest resolver отвечает только за выбор versioned files и не превращается в registry или HTML renderer.
- Цикл зависимостей assets вызывает понятное исключение с перечислением handles. Отсутствующая optional dependency игнорируется только по явно документированному правилу; случайный бесконечный sort loop невозможен.
- First-party contracts `AssetsInterface` и `MetaInterface` больше не наследуют интерфейсы KodiCMS. Их новый узкий API фиксируется contract tests до удаления Composer package.
- Сохраняются реально используемые SleepingOwl entry points и aliases `Assets`, `Meta`, `PackageManager`. Новый first-party facade/API живёт только в namespace `SleepingOwl\Admin`; совместимость не требует подделывать весь namespace удалённого пакета.
- Старые опубликованные config aliases со строками `KodiCMS\Assets\Facades\Assets`, `Meta` и `PackageManager` распознаются config normalization слоем и перенаправляются на first-party реализации. Это позволяет загрузить legacy config fixture после удаления зависимости.
- Прямые imports/classes `KodiCMS\Assets\...` в пользовательском application code считаются breaking change нового major и получают точную таблицу замен в migration guide.
- Рендер HTML attributes выполняет escaping, а JavaScript config сериализуется через безопасный JSON/`Js::encode()` contract; текущая конкатенация raw `json_encode()` в executable script не переносится как есть.
- First-party asset registry интегрируется с новым versioned manifest и двумя build profiles; он не вычисляет Mix/Vite paths самостоятельно и не требует frontend toolchain у потребителя.

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
- Перевести 9 Blade `inline-template` блоков в Vue 3 islands. В первую очередь: env editor, file/image/images, select/multiselect и related elements.
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
| `vue-multiselect` 2.x | Vue Multiselect 3.5.x | Каждый select/multiselect — отдельный Vue 3 island; async/dependent behavior вынесено в composables |
| `vuedraggable` 2.x | Прямой SortableJS | Не держать Vue wrapper там, где достаточно узкого drag/drop driver |
| Select2 и `dependent-dropdown` | Vue Multiselect island + async/dependent composables | `setSelect2()` временно остаётся compatibility alias; raw plugin options проходят migration matrix |
| `bootstrap4-datetimepicker`, `daterangepicker`, `tempusdominus-core`, Moment | Air Datepicker 3.6.x | Один driver покрывает date/datetime/range; Moment удаляется, если больше нигде не нужен |
| `x-editable-bs4` | Собственный небольшой headless `InlineEditor` | Сохранить backend endpoint; внешний вид предоставляет тема |
| `nestable2` | Уже установленный SortableJS с nested-конфигурацией | Сохранить max depth, expand/collapse и сериализацию порядка |
| Magnific Popup | GLightbox 3.3.x | Сохраняет gallery/navigation; driver обновляет динамически добавленные элементы через публичный lifecycle |
| Flow.js в `Files` | Native `FormData` + `Admin.Http` | Старый chunk size 1 ГБ не давал полезного resumable upload; сохранить endpoint, `file`/`_token` и порядок выбранных файлов |
| Bootstrap jQuery tooltip/tab APIs | Theme capabilities либо native implementation | Bootstrap API используется только внутри AdminLTE theme adapter |
| jQuery DOM-код файловых компонентов | Vue 3 islands для `File`/`Image`/`Images`, native lifecycle для `Files` | Сохранить прямой HTML/PHP contract; убрать jQuery DOM, исполняемый template renderer и Flow.js |

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
- [x] Зафиксировать два готовых asset profiles: production и development Vue 3, переключаемые существующим `ADMIN_DEV_ASSETS` без Node.js у пользователя.
- [x] Зафиксировать удаление `kodicms/laravel-assets` и границы минимальной first-party реализации assets/meta/packages без копирования всего vendor API.
- [x] Утвердить структуру Sass entrypoints/partials, префикс CSS custom properties `--soa-*` и границы variables core/features/themes.
- [x] Зафиксировать разрешённые исключения color literals и стратегию dark mode через переопределение root variables.
- [x] Выбрать replacements для Select2, date/time controls и lightbox.
- [x] Добавить npm lock-файл и зафиксировать исходное дерево зависимостей.
- [x] Сохранить baseline production bundle size и перечень лицензий.
- [x] Составить перечень эталонных экранов для каждой темы: layout/navigation, async table, sync table, filters, bulk actions, inline edit, tree, select, date/time, single/multiple file upload.
- [x] Снять обезличенный inventory реального read-only проекта Laluna как источник сценариев для compatibility tests, документации и generator stubs.
- [x] Составить полный machine-readable inventory top-level/nested config keys и найти их consumers в PHP, Blade и JavaScript.
- [x] Заполнить config migration matrix (`unchanged`, `same key/new implementation`, `theme-owned`, `deprecated`, `removed`) с правилом сохранения по умолчанию.
- [x] Подготовить fixture старого опубликованного конфига и fixture минимального конфига с отсутствующими новыми ключами.

Критерий завершения: решения записаны, зависимости воспроизводимы, набор эталонных сценариев согласован.

### Этап 1. Создать страховочную сетку тестов

- [x] Добавить Vitest для чистых JS-модулей и сериализации данных.
- [x] Добавить ESLint с запретом неявных глобалов.
- [x] Настроить ESLint guards для длины функций и cyclomatic complexity с локальными обоснованными исключениями.
- [x] Добавить formatter/check-команду и единый style для нового JavaScript.
- [x] Добавить Stylelint/`stylelint-scss` и правила, запрещающие color literals вне variables/color files.
- [x] Добавить Playwright smoke suite либо минимальный browser fixture, пригодный для проверки compiled assets.
- [x] Покрыть PHP feature-тестами DataTables async request/response: pagination, global search, ordering, column filters, payload, distinct и row class.
- [x] Зафиксировать browser-сценарии DataTables 1 до обновления: state restore/clear, range/date/select/text filters, actions, inline edit, auto-update, tooltip/lazyload after draw.
- [x] Зафиксировать Vue 2 browser-сценарии: env editor, file/image/images, select/multiselect и related elements, включая динамическое добавление групп.
- [x] Добавить render snapshots/contract assertions для layout, navigation, forms, displays, validation и messages текущей темы.
- [x] Добавить tests, загружающие пакет с прежним полным опубликованным конфигом и с конфигом, в котором отсутствуют новые keys.
- [x] Добавить CI-команды для PHP и frontend тестов.
- [x] Добавить contract tests выбора production/development manifest entries через `sleeping_owl.dev_assets`, включая запрет смешивания профилей и попадания development Vue в production page.
- [x] Добавить characterization tests используемого API `kodicms/laravel-assets`: handles/dependencies/order, CSS/JS attributes, head/footer, packages, meta tags, global config и duplicate registration.

Критерий завершения: текущая реализация проходит тесты, которые способны обнаружить основные регрессии миграции.

### Этап 2. Выделить headless core и theme contract

- [x] Расширить существующий `TemplateInterface` до `ThemeInterface`, сохранив адаптер для старого `TemplateDefault` на время миграции.
- [x] Отвязать first-party `AssetsInterface`/`MetaInterface` от contracts `KodiCMS\Assets` и зафиксировать собственный узкий contract.
- [x] Перенести стандартные Bootstrap/AdminLTE-классы встроенных button, form, card/panel, grid, navigation, table, alert, badge и validation components из PHP core в Blade views legacy theme.
- [x] Сохранить прямой API пользовательских HTML attributes/classes и проверить, что theme rendering передаёт их без преобразований и потерь.
- [x] Разделить общие Blade views, theme-owned layout/views и feature-owned views.
- [x] Извлечь текущую AdminLTE 3/Bootstrap 4 реализацию как временную reference/legacy theme без изменения поведения.
- [x] Добавить contract tests, которые рендерят один и тот же PHP display/form через разные test themes.
- [x] Определить theme asset manifest и capability API: tabs, tooltip, dropdown, modal, notification, icons и table presentation.
- [x] Сохранить `sleeping_owl.template` как selector реализации темы и передать theme-owned config values без переименования.
- [x] Проверить `body_default_class`, logo/favicon/menu/footer/version/show_mode и layout card flags в legacy и новых темах.
- [x] Запретить core imports из каталогов конкретной темы автоматической проверкой.

Критерий завершения: PHP core не генерирует framework-specific classes, а текущий UI продолжает работать через изолированную legacy theme.

### Этап 3. Подготовить минимальный native frontend foundation

- [x] Разделить сборку на `admin-core.js`, `admin-core.css`, feature chunks и независимые theme bundles.
- [x] Создать Sass entrypoints и отдельные `_variables.scss`/`_colors.scss` для core, features и themes.
- [x] Перевести затронутые plain CSS sources в SCSS partials; generated vendor/Tailwind CSS не редактировать вручную.
- [x] Ввести публичные `:root` custom properties с префиксом `--soa-*` для runtime/no-build настройки цветов и основных theme values.
- [x] Добавить versioned asset manifest и PHP resolver для precompiled core/theme/feature bundles.
- [x] Реализовать в manifest и resolver два полных профиля с одинаковыми logical ids: `production` и `development`, выбираемые существующим `sleeping_owl.dev_assets`.
- [x] Реализовать минимальные first-party asset value object, dependency sorter/registry, package registry и meta renderer в `SleepingOwl\Admin`, не смешивая их обязанности с manifest resolver.
- [x] Перевести внутренние `Templates\Assets`, `Templates\Meta`, trait `Assets`, provider bindings, facades и stubs с `KodiCMS\Assets` на first-party classes.
- [x] Нормализовать legacy config aliases `KodiCMS\Assets\Facades\*` в first-party aliases и покрыть это fixture старого опубликованного конфига.
- [x] Расширить существующие `sleepingowl:install` и `sleepingowl:update`: публиковать выбранные precompiled theme/feature assets, проверять manifest/version, не вызывать npm и не компилировать frontend.
- [x] Сохранить обратную совместимость `sleepingowl:update` как минимум на уровне неинтерактивного forced asset publish, пригодного для deployment scripts.
- [x] Переписать внутреннюю реализацию `Admin.Events` на native events, сохранив текущий публичный интерфейс.
- [x] Добавить узкие DOM helpers только для реально повторяющихся операций.
- [x] Реализовать `Admin.Tables` registry и adapter interface.
- [x] Разделить table implementation минимум на lifecycle, options, transport, filters, state, selection и hooks; registry не содержит реализацию этих обязанностей.
- [x] Перевести общий reload, selected rows и clear state на `Admin.Tables`.
- [x] Перевести `Admin.Asset`, buttons, checkbox/control events и простые DOM-модули на native API.
- [x] Устранить неявные глобалы (`urlName`, `activeFilters`, `array`, присваивания внутри условий и подобные места).
- [x] Реализовать единый lifecycle для динамических компонентов: `scan(root)`, `mount(element)`, `destroy(element)`.
- [x] Не включать в core reset, layout framework, DataTables, Vue или theme-specific CSS.

Критерий завершения: минимальный core bundle не зависит от jQuery, Bootstrap, AdminLTE, Tailwind, Vue или DataTables; legacy UI работает через подключаемые adapters.

### Этап 4. Перейти на Vue 3 islands

- [x] Временно подключить `@vue/compat` с явным перечнем compat flags либо сразу Vue 3, согласно решению этапа 0.
- [x] Заменить `new Vue({ el: '#vueApp' })` на factory небольших app instances для отдельных islands.
- [x] Заменить глобальную регистрацию `Vue.component`/`Vue.extend` на `createApp`/`defineComponent` и локальную регистрацию.
- [x] Заменить `Vue.http`/`vue-resource` на core HTTP client поверх Axios/`fetch`.
- [x] Заменить `Vue.prototype.$trans` на injection/composable без глобального mutable API.
- [x] Интегрировать direct Vue hosts с `Admin.Components`: после top-level mount находить вложенные islands в отрендерированном DOM, поддерживать динамические related groups и уничтожать child раньше parent.
- [x] Перенести все 9 `inline-template` в precompiled Vue 3 islands.
  - [x] Env editor.
  - [x] File.
  - [x] Image.
  - [x] Images.
  - [x] Select.
  - [x] Multiselect.
  - [x] Related elements с card.
  - [x] Related elements без card.
  - [x] Related group.
- [x] Перевести `$set` на обычные reactive assignments и проверить array updates.
- [x] Обновить/заменить Vue wrappers для multiselect и drag/drop.
  - [x] Удалить Vue 2 `value/input` wrapper вокруг Vue Multiselect и использовать native Vue 3 contract.
  - [x] Удалить Vue 2 wrapper `vuedraggable` из Related islands.
- [x] На каждый island реализовать `mount`/`unmount`, повторную инициализацию и защиту от двойного mount.
- [x] Вынести upload, serialization, HTTP/error mapping и sortable logic из Vue components в отдельные composables/services; components оставить orchestration/presentation слоем.
- [x] Проверить Blade escaping, `@{{ }}`, JSON props, CSP nonce и отсутствие исполнения пользовательского HTML как Vue template.
- [x] Удалить `@vue/compat`, compat flags, Vue 2 packages и глобальный `Vue` до завершения этапа.
- [x] Переключить финальную сборку на runtime-only Vue 3 после переноса всех runtime templates в заранее компилируемые components.
- [x] Собрать Vue 3 в двух отдельных runtime-only chunks: production/minified без dev diagnostics и development/unminified с warnings, devtools и source maps.
- [x] Предоставить публичный extension API, через который custom modules регистрируют islands и используют единственную Vue runtime instance выбранного профиля.

Критерий завершения: production bundle использует Vue 3 без compatibility build и `inline-template`; server-rendered Blade безопасно передаёт данные изолированным islands.

### Этап 5. Перейти на DataTables 2 feature driver

- [x] Обновить DataTables core и extensions; отделить engine от theme presentation adapters.
- [x] Не создавать новый монолитный `datatables.js`: lifecycle, request/response, filters, state, selection, actions и draw hooks должны быть отдельными тестируемыми modules.
- [x] Удалить собственный Bootstrap 3 renderer и обращения к `settings.oApi`.
- [x] Переписать инициализацию на `new DataTable(element, options)`.
- [x] Перевести legacy options (`sDom`, `bStateSave`, `fnDrawCallback`) на актуальные DataTables 2 options.
- [x] Перенести error handling, custom ordering и custom search без прямого использования `$.fn` в коде проекта, насколько позволяет публичный API DataTables 2.
- [x] Переписать filters module на native DOM: text, select, date, daterange и numeric range.
- [x] Переписать state filters storage и исключить коллизии между несколькими таблицами.
- [x] Сохранить поведение `state_datatables`, `state_filters`, `default_datatables_method`, `datatables`, `datatables_highlight` и `dt_autoupdate*`; задокументировать только реально несовместимые DataTables 1 options.
- [x] Перевести draw hooks: `Admin.Events`, tooltip, lazyload, highlight и inline editor.
- [x] Перевести actions и auto-update на `Admin.Tables.reload()`.
- [x] Удалить DataTables presentation CSS из core; добавить отдельные presentation adapters для AdminLTE и Tailwind themes.
- [x] Проверить sync и async displays, несколько таблиц на странице и таблицу внутри tab.

Критерий завершения: все существующие табличные сценарии работают на DataTables 2, а код SleepingOwlAdmin не вызывает jQuery DataTables plugin API.

### Этап 6. Заменить остальные jQuery-плаги и legacy modules

- [x] Select2 и AJAX select.
- [x] Date, datetime и daterange controls.
- [x] Dependent dropdown.
- [x] X-editable/inline editor.
- [x] Nestable tree.
- [x] Magnific Popup/lightbox.
- [x] Theme tooltip/tab/dropdown/sidebar capabilities.
  - [x] Native tabs + state compatibility + AdminLTE/Tailwind adapters.
  - [x] Native tooltip с сохранением публичного `data-toggle="tooltip"`.
  - [x] Native dropdown с сохранением публичного `data-toggle="dropdown"`.
  - [x] Native sidebar/push menu/navigation tree с сохранением `data-widget="pushmenu"` и `data-widget="treeview"`.
- [x] jQuery-операции в file/image/files/images components.
- [x] jQuery-операции в WYSIWYG wrappers.
- [x] Related elements lifecycle и DOM-операции без jQuery.
- [x] Sidebar cookie/state integration.
- [x] Перевести именованные callbacks табличных actions с jQuery collections на native DOM, сохранив имена, число и порядок аргументов.
- [x] Удалить неиспользуемые `jquery-form`/Noty wrappers и комментарии со старым jQuery-кодом.
- [x] Реализовать native alert с сохранением `data-dismiss="alert"`, затем удалить исполняемые jQuery/Bootstrap wrappers.

Критерий завершения: в исходниках нет runtime-вызовов `$()`/`jQuery()` и ни один выбранный UI-плагин не требует глобального jQuery.

### Этап 7. Реализовать готовые темы

- [x] Перенести legacy Bootstrap/AdminLTE imports из общего `admin-app.scss` под Sass boundary темы, сохранив прежний порядок каскада и structural selectors.
- [x] Вынести Font Awesome в отдельный готовый `shared:icons` bundle и обновить его до актуальной стабильной версии `7.3.1`; legacy aggregate продолжает включать иконки в прежней позиции.
- [ ] Подключить один и тот же `shared:icons` entry в assets готовых `AdminLTETheme` и `TailwindTheme`, не встраивая его CSS в theme bundles.
  - [x] `AdminLTETheme` явно объявляет `shared:icons`, а её standalone CSS не содержит Font Awesome.
  - [ ] `TailwindTheme` явно объявляет тот же `shared:icons`.
- [ ] Реализовать современную `AdminLTETheme`, инкапсулирующую собственные Bootstrap/AdminLTE assets, markup и component adapters.
  - [x] Добавить прямую `AdminLTETheme`, оставить существующий `sleeping_owl.template` selector и сделать её default для новых config без потери `TemplateInterface` compatibility.
  - [x] Объявить theme-owned logical manifest/capabilities и собрать самостоятельный AdminLTE CSS из theme Sass boundary; старый `TemplateDefault` остаётся рабочим для опубликованных config.
  - [x] Связать versioned manifest resolver с first-party asset registry отдельным `LogicalAssetRegistrar`, сохранив profile selection, стабильные handles и порядок CSS/JS.
  - [x] Вынести прежние `Admin.Config/Url/User`, `Admin.Messages/Modules/WYSIWYG`, `_`, `axios`, `Swal` и `trans` в самостоятельный `shared:compatibility`, который устанавливается только после headless core и не загружает Vue, DataTables, Bootstrap/AdminLTE или jQuery globals.
  - [x] Вынести Vue 3 islands в `shared:vue`: один logical path в каждом profile, production minified, development с diagnostics/source map; старые `vue.js`/`vue-dev.js` остаются bridges для `TemplateDefault`.
  - [x] Сделать `feature:lightbox` и `feature:tree` самозапускающимися browser entries поверх headless core; library `index.js` оставить без side effects, а tree labels брать через optional `trans` с безопасным fallback.
  - [x] Сделать `feature:forms` самозапускающимся browser entry и проверить реальные consumer scenarios без legacy aggregate.
  - [ ] Сделать `feature:table` самозапускающимся browser entry и проверить реальные consumer scenarios без legacy aggregate.
  - [ ] Перед переключением runtime подключить theme-owned notification adapter дерева, не встраивая AdminLTE/SweetAlert policy в theme-neutral feature.
  - [ ] Переключить `AdminLTETheme::initialize()` с compatibility aggregate на `core + Vue + feature + selected theme adapters`, не меняя `TemplateDefault` до проверки нового runtime.
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
- [ ] Добавить небольшой PHP asset health service: один раз за request сравнивать установленную Composer-версию пакета с `package_version` опубликованного manifest без frontend-запросов.
- [ ] При несовпадении валидных версий продолжать использовать последний целостный набор assets и передавать в footer status с точной командой `php artisan sleepingowl:update`; при совпадении status не рендерить.
- [ ] Добавить отдельные translation keys сообщения и команды во все штатные locales с проверяемым fallback, не собирать пользовательский текст в JavaScript.
- [ ] Оформить уведомление отдельными компактными footer partials для AdminLTE и Tailwind: Sass-only styles, цвета из `_colors.scss`, остальные параметры из `_variables.scss`/`--soa-*`, доступный `role="status"`, без modal/toast и без перекрытия рабочего интерфейса.
- [ ] Для custom theme предоставить нейтральный публичный asset health status без CSS-классов и оставить отображение теме.
- [ ] Покрыть tests совпадение версий, mismatch, locale fallback, отсутствие лишней разметки и rendering уведомления в AdminLTE/Tailwind.
- [ ] Измерить core, feature и theme bundles по отдельности.

Критерий завершения: установка выбирает AdminLTE, Tailwind или custom theme без изменения core; Tailwind/custom не получают Bootstrap/AdminLTE assets транзитивно.

### Этап 8. Удалить jQuery и очистить сборку

- [x] Удалить `resources/assets/js_owl/libs/jquery.js` и его import.
- [x] Удалить неиспользуемый `jquery-form` из `package.json` и lockfile.
- [x] Удалить прямой `jquery` из `package.json`; оставшиеся jQuery-only transitive dependencies удаляются вместе с legacy AdminLTE/Bootstrap packages.
- [x] Удалить глобальные `window.$`, `window.jQuery`, `global.jQuery`.
- [ ] Проверить `npm ls jquery` в соответствии с выбранным на этапе 0 критерием.
- [ ] Проверить исходники поиском `jquery`, `jQuery`, `$(` с ручной разметкой допустимых совпадений.
- [ ] Проверить production bundle и license-файлы на наличие jQuery.
- [ ] Удалить устаревшие картинки/assets x-editable и прочие orphaned resources.
- [ ] Сравнить размер production bundle с baseline.
- [ ] Удалить `kodicms/laravel-assets` из `composer.json`/lock после перевода всех runtime/contracts/tests и проверить отсутствие `KodiCMS\Assets` вне migration compatibility data/docs.

Критерий завершения: выбранный критерий удаления jQuery выполнен и закреплён автоматической проверкой.

### Этап 9. Проверить миграцию на крупном pilot-проекте

- [ ] До обновления снять inventory используемых displays, forms, columns, filters, actions, widgets, editors, uploads, tree и navigation.
- [ ] Использовать `docs/modernization/reference-project-laluna.md` как reference catalog; не считать доступ на чтение разрешением создать ветку или менять `D:\domains\laluna.kit`.
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
- [ ] Добавить в migration guide таблицу замен прямых `KodiCMS\Assets` imports/facades и примеры нового first-party asset API.
- [ ] Опубликовать config migration matrix и примеры только новых/изменённых keys вместо требования перепубликовать весь конфиг.
- [ ] Добавить руководство по выбору AdminLTE/Tailwind theme и созданию custom theme.
- [ ] Подготовить нейтральные проверенные примеры по сценариям reference project: section/table/DataTables, card form, custom form element, widget, policy, module Admin service provider, navigation/route, custom assets и Vue 3 island.
- [ ] Обновить generator stubs для section, custom form element, widget, policy и module Admin service provider; после стабилизации contracts добавить отдельные stubs Vue island и custom theme.
- [ ] Проверить сгенерированные stubs в test application: PHP-only stubs работают без Node.js, frontend stubs используют public extension/manifest API и не создают jQuery/Vue globals.
- [ ] Обновить PHPDoc/facades/interfaces для актуального API.
- [ ] Добавить CHANGELOG с перечнем breaking changes.
- [ ] Обновить опубликованные assets через `npm run production`.
- [ ] Собрать и опубликовать development profile через `npm run development`, включая development Vue runtime и source maps.
- [ ] Проверить, что versioned asset manifest содержит согласованные production/development entries, файлы и checksums.
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
npm run development
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
- [x] inline text/select/date/datetime/checklist editing;
- [ ] reload после успешного действия;
- [x] CSRF и backend validation errors.

### Остальная админка

- [ ] sidebar, dark mode и сохранение состояния;
- [ ] tabs и восстановление активной вкладки;
- [ ] tooltips, dropdowns, alerts и messages;
- [x] select/multiselect/AJAX/dependent select;
  - [x] static/model-backed select и multiselect;
  - [x] AJAX и dependent select;
- [ ] date/time/daterange;
- [ ] single/multiple file и image upload;
- [ ] drag-and-drop сортировка файлов/images;
- [ ] tree reorder, max depth, expand/collapse;
- [ ] lightbox/gallery;
- [ ] WYSIWYG initialisation;
- [ ] related form elements.

### Vue 3

- [x] каждый stateful widget монтируется как отдельный island;
- [x] server data передаётся как корректный JSON/props без выполнения непроверенного HTML;
- [x] отсутствует `inline-template`;
- [x] отсутствуют глобальные `Vue`, `Vue.component`, `Vue.extend`, `Vue.http` и `Vue.prototype`;
- [x] отсутствует `@vue/compat` в production dependencies/bundle;
- [x] динамически добавленные related groups монтируют и демонтируют вложенные widgets ровно один раз;
- [x] file/image uploads, multiselect, sorting и validation корректно обновляют reactive state;
- [x] несколько одинаковых islands на странице не разделяют состояние.

### Production/development assets

- [x] `ADMIN_DEV_ASSETS=false` загружает только production entries, minified код и production runtime-only Vue 3;
- [x] `ADMIN_DEV_ASSETS=true` загружает только development entries, unminified код, source maps и development runtime-only Vue 3;
- [ ] Vue warnings, component stacks и Vue Devtools доступны для штатных и пользовательских islands в development profile;
- [x] production HTML/manifest resolution не ссылается на development Vue, development chunks или source maps;
- [x] logical ids и runtime behavior совпадают между профилями; отличаются только оптимизация и diagnostics;
- [ ] все islands/custom modules страницы используют одну Vue runtime instance выбранного профиля;
- [x] изменение `ADMIN_DEV_ASSETS` не требует Node.js, npm или пересборки assets;
- [ ] `sleepingowl:update --check` валидирует наличие и checksums обоих профилей.

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
- [ ] отсутствующие/повреждённые published assets дают понятную диагностическую ошибку с командой обновления;
- [ ] валидные, но несовпадающие версии PHP package/assets показывают локализованное footer-уведомление в AdminLTE и Tailwind без frontend rebuild; совпадающие версии не добавляют разметку;
- [ ] версии PHP package, asset manifest и published bundles согласованы;
- [ ] оба готовых asset profiles публикуются одной `sleepingowl:update`, а `ADMIN_DEV_ASSETS` только выбирает уже опубликованный профиль;
- [ ] production deployment документирован только через Composer/PHP/Artisan для обычного пользователя.

### First-party asset registry

- [ ] `kodicms/laravel-assets` отсутствует в Composer dependency tree;
- [ ] runtime, contracts, default config, PHPDoc, stubs и tests не зависят от классов `KodiCMS\Assets`;
- [ ] стандартные и пользовательские CSS/JS регистрируются по handle с dependencies, attributes и head/footer placement;
- [ ] порядок assets детерминирован, duplicate handle имеет документированное поведение, а dependency cycle даёт диагностическое исключение;
- [ ] package registration/activation сохраняет нужные существующим form/display components сценарии без общего mutable god object;
- [ ] title, meta, favicon и global config выводятся корректно и безопасно экранируются;
- [ ] старый полный config fixture с KodiCMS alias strings загружается и получает first-party replacements;
- [ ] прямые старые imports в application code имеют однозначную замену в migration guide;
- [x] registry получает package-owned URLs от versioned manifest resolver и одинаково работает с production/development profiles.

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
- release содержит готовые production/development profiles; `ADMIN_DEV_ASSETS` выбирает их без frontend build, а development profile использует диагностическую сборку Vue 3;
- `kodicms/laravel-assets` удалён; небольшой first-party asset/meta registry покрывает только используемый contract и работает с versioned manifest;
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
- документация и generator stubs основаны на обезличенных реальных сценариях и проходят smoke tests на публичном API;
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
| 2026-09-06 | Этап 0 / asset profiles | Зафиксированы два готовых профиля: production и development; существующий `ADMIN_DEV_ASSETS` выбирает профиль целиком, development использует отдельный Vue 3 dev runtime с warnings/devtools/source maps, Node.js пользователю не нужен | текущий commit |
| 2026-09-06 | Этап 0 / PHP assets | `kodicms/laravel-assets` запланирован к удалению; вместо vendor API остаются узкие first-party asset/meta/package contracts, legacy config aliases нормализуются, прямые пользовательские imports документируются как major migration | текущий commit |
| 2026-09-06 | Этап 0 / Sass structure | Определены независимые Sass entries и локальные `_variables.scss`/`_colors.scss` для core/features/themes; first-party modules переходят на `@use`/`@forward`, Tailwind output остаётся generated exception | текущий commit |
| 2026-09-06 | Этап 0 / colors | Color literals ограничены `_colors.scss` и узкими vendor/generated/brand exceptions; dark mode меняет только `--soa-*` в root selector, sidebar config проходит validation | текущий commit |
| 2026-09-06 | Этап 0 / plugin replacements | Изначально предложены Tom Select, Air Datepicker и GLightbox; выбор select пересмотрен после обсуждения | `359de337` |
| 2026-09-06 | Этап 0 / select correction | Vue Multiselect сохранён и обновляется до стабильной Vue 3-ветки 3.5.x; Select2/AJAX/dependent behavior переносится в тот же island через отдельные composables, Tom Select исключён | текущий commit |
| 2026-09-06 | Этап 0 / dependency lock | Добавлен npm lockfile v3; чистый `npm ci` и dependency tree проверены, зафиксированы 1376 entries и legacy Bootstrap 3 peer conflict внутри AdminLTE 3 | текущий commit |
| 2026-09-06 | Этап 0 / asset baseline | Добавлены воспроизводимый generator и JSON baseline: 2 585 357 raw / 587 787 gzip bytes, SHA-256 assets/lock и license inventory 869 runtime packages с 12 явными `UNKNOWN` | текущий commit |
| 2026-09-06 | Этап 0 / reference screens | В `docs/modernization/reference-screens.md` зафиксированы 9 стабильных scenarios, fixtures, states, viewport/scheme matrix и обязательное AdminLTE/Tailwind coverage | текущий commit |
| 2026-09-06 | Этап 0 / reference project | `D:\domains\laluna.kit` принят только для чтения; снят обезличенный inventory sections/forms/widgets/config/custom assets/Vue/jQuery для будущих docs, fixtures и generator stubs | текущий commit |
| 2026-09-06 | Этап 0 / config inventory | Добавлен воспроизводимый JSON inventory: 59 top-level/113 named keys, прямые и parent-scope consumers, 3 namespace reads, 7 derived JS values; отдельно выявлен отсутствующий в published config ключ `policies_namespace` | текущий commit |
| 2026-09-06 | Этап 0 / config matrix | Все 113 current config paths получили ровно один проверяемый статус: 70 unchanged, 29 same key/new implementation, 14 theme-owned, 0 removed; отдельно записаны legacy `show_editor`, implicit `policies_namespace` и новый `sidebar_background_color` | текущий commit |
| 2026-09-06 | Этап 0 / config fixtures | Добавлены обезличенный full legacy fixture с 49 top-level keys/`show_editor`/KodiCMS aliases и minimal fixture из одного ключа; invariants проверяются отдельной командой | текущий commit |
| 2026-09-06 | Этап 0 / завершение | Все решения, inventories, reference scenarios, dependency/asset baselines, config matrix и fixtures зафиксированы; точка возобновления перенесена на Vitest этапа 1 | текущий commit |
| 2026-09-06 | Этап 1 / Vitest | Добавлен Vitest 5 и первые 5 tests чистого island props parser: строгие boolean/number `data-*`, schema filtering и JSON object payload; Node environment не требует DOM | текущий commit |
| 2026-09-06 | Этап 1 / ESLint globals | Добавлен ESLint 10 flat config для нового frontend/tests с error-level `no-undef`, `no-global-assign`, `no-implicit-globals` и проверкой unused disables; legacy JS подключается по мере миграции | текущий commit |
| 2026-09-06 | Этап 1 / decomposition guards | Новый JavaScript ограничен complexity 8, 25 statements и 40 непустыми/некомментарийными строками на функцию; исключения допускаются только точечно с review-обоснованием | текущий commit |
| 2026-09-06 | Этап 1 / formatter | Добавлен Prettier 3 для нового frontend/tests/config и единая `npm run check` (format check, ESLint, Vitest); legacy assets исключены до их поэтапной миграции | текущий commit |
| 2026-09-06 | Этап 1 / Stylelint | Добавлены Stylelint 17/stylelint-scss и standard SCSS rules; executable tests запрещают named/hex/color functions вне `_colors.scss`/`_variables.scss` и разрешают `--soa-*` consumers | текущий commit |
| 2026-09-06 | Этап 1 / Playwright | Добавлены Playwright 1.63, Chromium fixture server и первый real-browser ES-module smoke test typed `data-*`/JSON props; browser binaries остаются CI/maintainer dependency | текущий commit |
| 2026-09-06 | Этап 1 / PHPUnit baseline | PHPUnit bootstrap и legacy tests адаптированы к PHPUnit 12/Testbench 11: 304 tests, 879 assertions, 0 errors/failures/notices; сохранены 2 явно помеченных TODO-skip | `4262e0b1` |
| 2026-09-06 | Этап 1 / async DataTables PHP | Добавлены 8 SQLite/Eloquent feature tests для pagination/`length=-1`, search, ordering, column filter, payload/controller, distinct, row class и полного response shape; полный прогон с PDO SQLite: 312 tests, 903 assertions | текущий commit |
| 2026-09-06 | Этап 1 / DataTables 1 browser | Готовый опубликованный DataTables 1.13.11 bundle покрыт 7 Playwright-сценариями: POST/payload, state restore/clear, text/date/range/select/daterange filters, bulk/custom actions, inline edit/rebind, auto-update stop и tooltip/lazyload draw hooks; подтверждён legacy range wire format `from::to` без отдельных `search[from]`/`search[to]` | текущий commit |
| 2026-09-06 | Этап 1 / Vue 2 browser | Опубликованные `admin-app.js`/`vue.js`/`modules.js` покрыты 4 Playwright-сценариями: env editor, file/image/images upload callbacks, Vue Multiselect single/multiple/taggable values и related groups с динамическим Select2 rebind; зафиксирован известный legacy-дефект Dropzone CommonJS wrapper, оставляющий auto-discovery включённым на внутреннем constructor | текущий commit |
| 2026-09-06 | Этап 1 / default theme render | Добавлены 9 render-contract tests для layout, nested/leaf navigation, text form с validation, table display и success/warning/info/error messages; user attributes/classes проверяются без преобразования. Полный PHP gate с PDO SQLite: 321 test, 974 assertions, 2 прежних TODO-skip. Выявлены legacy-дефекты пустых message widgets/output buffers и несовпадающей `has-error`-нормализации bracket names | текущий commit |
| 2026-09-06 | Этап 1 / config loading | Добавлены Testbench application tests, подставляющие full legacy и one-key minimal config до регистрации package providers; проверены shallow merge defaults, сохранение пользовательских values/KodiCMS aliases, отсутствие planned sidebar key и загрузка template/views без перепубликации config. Полный PHP gate с PDO SQLite: 326 tests, 1003 assertions, 2 прежних TODO-skip | текущий commit |
| 2026-09-06 | Этап 1 / CI gates | Добавлены `composer test`, единый `npm run check:ci` и GitHub Actions jobs: PHP 8.3 с явными PDO SQLite/sqlite3 и frontend Node 22 с clean npm install, lint/unit/style gates и Playwright Chromium. Локально `npm run check:ci`: 9 Vitest + 12 Playwright tests | текущий commit |
| 2026-09-06 | Этап 1 / asset profiles | Добавлены contract tests реального Mix manifest и `TemplateDefault`: production/development выбирают ровно один `admin-app` profile, не смешиваются, сохраняют порядок общих `vue.js`/`modules.js`/CSS handles, а source entries связывают profiles с `vue-prod`/`vue-dev`. Полный PHP gate: 328 tests, 1029 assertions, 2 прежних TODO-skip | текущий commit |
| 2026-09-06 | Этап 1 / legacy PHP assets | Добавлены 7 characterization tests используемого `kodicms/laravel-assets`: shared container services, handles/dependencies/order, JS attributes и head/footer, CSS attributes, recursive packages, meta tags, global config и last-registration-wins. Полный PHP gate: 335 tests, 1078 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 1 / завершение | Страховочная сетка закрывает PHP async DataTables, legacy DataTables/Vue browser behavior, render/config/assets contracts и оба CI gate; точка возобновления перенесена на `ThemeInterface` этапа 2 | текущий commit |
| 2026-09-06 | Этап 2 / theme contract | Введён узкий `ThemeInterface` (`id`, view namespace, logical assets, icons, capabilities), container entry `sleeping_owl.theme` и deprecated `LegacyTemplateThemeAdapter`; текущий `TemplateDefault` и `sleeping_owl.template` остаются без изменения lifecycle/API. Полный PHP gate: 338 tests, 1096 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / asset contracts | First-party `AssetsInterface`/`MetaInterface` больше не наследуют KodiCMS contracts; зафиксированы только используемые registration/render/meta operations, container aliases и явные небольшие делегаты `Meta` вместо magic-only API. Vendor implementation пока остаётся за contract boundary до отдельной замены. Полный PHP gate: 342 tests, 1107 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / presentation defaults | Bootstrap/AdminLTE defaults встроенных buttons, forms, cards, grid, tabs, badges, tables, filters и controls перенесены из PHP core в legacy Blade views; behavior hooks сохранены. `ComponentAttributeBag` объединяет theme defaults с пользовательскими attributes, отдельные tests фиксируют variants/grid/tabs/controls, PHP guard запрещает возврат framework class defaults и проверяет синтаксис всех legacy Blade views. Уточнён read-only inventory `Laluna/Modules`: 72 sections, 74 datatables displays, 444 прямых class attributes и 72 placement-вхождения. Полный PHP gate: 357 tests, 1140 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / user attributes | Прямой API пользовательских classes/attributes сохранён без semantic resolver: raw arrays доступны темам, прежние строковые keys оставлены для custom views. Все default theme views используют first-party `HtmlAttributeBag`, который объединяет theme/user classes и безопасно экранирует values только при HTML-выводе; static guard запрещает возврат к raw attribute strings. Покрыты navigation, headers, extensions, columns, `data-*`, `aria-*`, inline style и boolean attributes. Полный PHP gate: 366 tests, 1171 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / view boundaries | Blade implementations разделены по физическим ownership roots `shared`, `features` и theme-owned `default`; framework-dependent feature markup оставлен theme adapter-слою. Восемь прежних `sleeping_owl::default.*` paths сохранены однострочными bridge views, поэтому published overrides и custom templates продолжают работать. Добавлены карта границ и guards: shared не зависит от theme/runtime, features не зависит от default theme, все package Blade views компилируются. Полный PHP gate: 371 test, 1199 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / legacy theme extraction | `default` физически перенесён в `resources/views/themes/legacy/default` и явно идентифицирован через `ThemeInterface` как `legacy-adminlte`; стабильный namespace `sleeping_owl::default`, `TemplateDefault`, config selector, published overrides и `public/default` URLs не изменены. Provider регистрирует общий root перед legacy root; executable contract проверяет разрешение каждого legacy Blade-файла. Asset source/distribution пока только объявлены legacy-owned и будут физически разделены вместе с versioned manifests, без промежуточного сломанного runtime. Полный PHP gate: 374 tests, 1326 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / cross-theme rendering | Один и тот же PHP display и form рендерятся через две независимые test themes с разной HTML-разметкой; object identity, общие данные, пользовательские classes/`data-*`/`aria-*`/inline style/boolean attributes и отсутствие theme-specific mutation закреплены contract tests. Полный PHP gate с PDO SQLite: 376 tests, 1370 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / theme metadata | Зафиксированы логические theme manifest ids `theme:<id>`/`feature:<id>:theme:<id>` без физических путей, семь типизированных presentation capabilities и безопасный registry theme-owned icon tokens. Legacy adapter валидирует metadata, а extracted theme объявляет собственный logical entry и capabilities; границы и custom-theme пример описаны в `docs/modernization/theme-contract.md`. Полный PHP gate с PDO SQLite: 383 tests, 1395 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / theme selector | Существующий `sleeping_owl.template` выбирает как legacy `TemplateInterface`, так и прямой custom `ThemeInterface`; узкий resolver создаёт парный transitional adapter без смены config key и без fallback к AdminLTE для неверного класса. `ThemeConfiguration` передаёт 14 существующих theme-owned keys и planned sidebar color под исходными именами/типами, а template renderer предоставляет theme/config выбранным views. Полный PHP gate с PDO SQLite: 387 tests, 1413 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / theme config rendering | Legacy render contract проверяет body/favicon/brand/menu/footer/version/mode visibility и обе стороны трёх card flags на фактической разметке/view modes; direct custom theme потребляет тот же полный `ThemeConfiguration` без переименования, включая nullable/planned sidebar value. Полный PHP gate с PDO SQLite: 391 test, 1448 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / dependency guards | PHPUnit запрещает PHP core references на concrete AdminLTE/Tailwind/Legacy namespaces, физические theme paths из shared/feature Blade и frontend core imports из features/themes; self-check доказывает, что patterns ловят каждый тип нарушения. ESLint дублирует JS boundary через `no-restricted-imports`. Полный PHP gate с PDO SQLite: 395 tests, 1456 assertions, 2 прежних TODO-skip; frontend gate: 9 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 2 / завершение | Headless PHP boundary, extracted legacy theme, stable direct attribute API, cross-theme rendering, metadata/config contracts, selector adapters и dependency guards зафиксированы; текущий AdminLTE 3 UI остаётся рабочим через isolated legacy theme. Точка возобновления перенесена на независимые core/feature/theme bundles этапа 3 | текущий commit |
| 2026-09-06 | Этап 3 / bundle topology | Laravel Mix читает единую декларативную build matrix и выпускает отдельные `core`, `feature:forms`, `feature:table`, `theme:legacy-adminlte` и `theme:tailwind` JS/CSS entries, сохраняя пять legacy outputs до переключения resolver. Новые Sass roots задают только cascade layers и не импортируют старый монолит; compiled-contract проверяет content hashes и отсутствие jQuery/Vue/Bootstrap/AdminLTE/DataTables в core. Production build успешен; полный PHP gate: 395 tests, 1456 assertions, 2 прежних TODO-skip; frontend gate: 29 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / Sass modules | Каждый modern core/feature/theme entry загружает только соседние `_variables.scss` и `_colors.scss` через `@use`; размеры/типографика/motion отделены от цветов, все build-time tokens объявлены с `!default`, включая независимые sidebar defaults обеих тем. Contract tests проверяют наличие локальных partials и overridable declarations. Production build успешен; полный PHP gate: 395 tests, 1456 assertions, 2 прежних TODO-skip; frontend gate: 39 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / handwritten CSS | Единственный handwritten plain CSS source `files.css` перенесён в owner-local `feature:forms` Sass и разложен на небольшие label/grid/icon/action/name/vertical partials. Параметризованный aggregate mixin сохраняет публичные file-element selectors в modern forms bundle и legacy aggregate, цвета вынесены в bundle-local `_colors.scss`; guard запрещает новые handwritten `.css` вне явных generated/vendor roots. Production build успешен; полный PHP gate: 395 tests, 1456 assertions, 2 прежних TODO-skip; frontend gate: 41 Vitest + 12 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / runtime tokens | Core, forms, table, AdminLTE и Tailwind публикуют owner-local `:root` properties только в namespace `--soa-*`; темы меняют palette через `data-soa-color-scheme`, а component fallback берётся из Sass tokens. Добавлены строгий `CssColor`, allowlisted `ThemeCssVariables`, config key `sidebar_background_color` и общий runtime-properties view; legacy aggregate уже потребляет `--soa-sidebar-bg` без rebuild. Browser test подтвердил computed color в light/dark и исправил первый toggle при пустом localStorage. Production build и обе config validations успешны; полный PHP gate: 402 tests, 1495 assertions, 2 прежних TODO-skip; frontend gate: 44 Vitest + 13 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / asset manifest | Production build теперь атомарно генерирует schema-1 `asset-manifest.json` из единой build matrix: Composer package version, build id, logical core/feature/theme entries, content versions и SHA-256. Узкие PHP value objects валидируют logical ids и безопасные relative paths; отдельные loader/resolver дают versioned CDN-aware URLs и диагностируют missing/corrupt/incompatible manifest через `sleepingowl:update`. `TemplateDefault` пока остаётся на legacy aggregate до profile/registry milestones. Production build успешен; полный PHP gate: 410 tests, 1521 assertions, 2 прежних TODO-skip; frontend gate: 55 Vitest + 13 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / asset profiles | `npm run production` воспроизводимо собирает оба modern-профиля: development без minify с внешними source maps и production minified без maps; manifest объединяет одинаковые logical ids под изолированными `profiles/<profile>` paths. `AssetProfileSelector` сохраняет контракт `ADMIN_DEV_ASSETS`/`sleeping_owl.dev_assets`, а container resolver выбирает профиль целиком и не смешивает URL. Полный PHP gate: 413 tests, 1529 assertions, 2 прежних TODO-skip; frontend gate: 75 Vitest + 13 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / first-party asset foundation | Добавлены независимые `Asset`, стабильный dependency sorter/registry, package registry и отдельные HTML/meta renderers без наследования или imports из `KodiCMS\Assets`. Unknown/circular dependencies не теряют элементы, duplicate handles заменяются, head/footer изолированы, пользовательские attributes экранируются на render boundary. Manifest resolver остаётся отдельной подсистемой; переключение public adapters/provider отложено до следующего пункта. Полный PHP gate: 419 tests, 1544 assertions, 2 прежних TODO-skip; frontend gate: 75 Vitest | текущий commit |
| 2026-09-06 | Этап 3 / first-party asset adapters | `Templates\Assets`, `Templates\Meta`, asset trait, WYSIWYG package PHPDoc, provider bindings, first-party facades и installation stub переведены на composition поверх собственного registry/renderers. Сохранены container keys, fluent Meta API, handles/dependencies, head/footer, packages, global config и last-registration-wins; исправлена старая передача CSS attributes как dependencies в trait. В runtime `src`/resources/stubs больше нет `KodiCMS\Assets`; legacy config aliases остаются отдельным compatibility-пунктом. Полный PHP gate: 421 tests, 1554 assertions, 2 прежних TODO-skip; frontend gate: 75 Vitest | текущий commit |
| 2026-09-06 | Этап 3 / legacy asset aliases | Default config переведён на first-party `Assets`, `Meta` и `PackageManager` facades. Узкий `AssetAliasNormalizer` до Laravel AliasLoader заменяет только три точных старых `KodiCMS\Assets\Facades\*` значения, сохраняя имена и все custom aliases. Полный long-lived config fixture загружается без перепубликации; исходные compatibility strings не исполняются как классы. Полный PHP gate: 423 tests, 1563 assertions, 2 прежних TODO-skip; frontend gate: 75 Vitest | текущий commit |
| 2026-09-06 | Этап 3 / no-build asset publication | Общий `PublishAssets` для install/update выполняет только forced Laravel vendor publish и затем проверяет выбранный готовый профиль: manifest schema, Composer package version, наличие 10 JS/CSS, MD5 versions и SHA-256 checksums. `sleepingowl:update` повторно перезаписывает намеренно повреждённый файл и остаётся пригодным для неинтерактивных deployment scripts; regression guard запрещает вызовы npm/node/Vite/Webpack/Mix из обоих command paths. Полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 75 Vitest | текущий commit |
| 2026-09-06 | Этап 3 / native events | `Admin.Events` сохраняет `on`/`off`/`fire`, positional arguments, context и duplicate registrations, но использует нативный `EventTarget`; browser target — `document`, а `fire` отправляет настоящий `CustomEvent` с массивом аргументов в `detail`. Legacy `datatables::*` names пока сохранены, native listeners и старые callbacks работают через одну шину без jQuery. Production/development assets пересобраны; полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 80 Vitest + 14 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / DOM helpers | В core добавлены только `listen` и `delegate`: обе подписки возвращают явный teardown, а delegation ограничивает `closest`-match переданным root. Инвентаризация подтвердила повторение delegated handlers в table/tree/file controls и потребность teardown для будущего `mount`/`destroy`; обёртки над `querySelector`, `classList`, `dataset`, forms и feature-specific DOM намеренно не создавались. Production/development assets пересобраны; полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 84 Vitest + 15 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / table registry | Добавлен engine-neutral `TableRegistry`, опубликованный как `Admin.Tables`. Структурный adapter contract ограничен `element`, `engineInstance`, `reload`, `destroy`, `clearState` и `selectedRows`; registry даёт lookup/all/unregister, допускает идемпотентную регистрацию того же adapter и диагностирует double mount другого adapter без скрытого destroy. DataTables 1 пока не регистрируется и остаётся legacy implementation до декомпозиции feature. Production/development assets пересобраны; полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 96 Vitest + 16 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / table decomposition | Legacy DataTables orchestration переведён с 413-строчного closure на отдельные lifecycle/options/transport/filters/state/selection/hooks modules; registry остаётся только lookup boundary. DataTables 1 создаётся на одной legacy-границе и регистрируется через общий adapter, серверный wire protocol и filter storage key сохранены, repeated boot не создаёт второй engine, а state cleanup больше не очищает чужой localStorage. jQuery-based filter/date compatibility изолирован и не попадает в modern table profiles. Production/development assets пересобраны; полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 116 Vitest + 16 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / shared table operations | Registry получил явные scoped `reload`, `clearState` и `selectedRows`, а reload/clear без element выполняются для всех зарегистрированных adapters. Bulk/custom actions сериализуют выбранные строки через `URLSearchParams`, bulk action выбирается внутри текущей формы, action reload и auto-update обращаются только к `Admin.Tables`; `.card` lookup остаётся изолированной legacy theme boundary. В общих consumers больше нет прямого DataTables API, единственный factory call остаётся в legacy engine adapter. Production/development assets пересобраны; полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 118 Vitest + 16 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / native DOM controls | `Admin.Asset` переведён на native Promise loader с URL-aware deduplication/retry для JS/CSS; form, table и tree actions создают/отправляют формы через DOM API и передают в сохранённые события native elements. Delegated checkbox controls поддерживают динамические строки, ограничивают select-all ближайшей таблицей и публикуют `data-soa-selected`/`aria-selected`; legacy `info` остаётся adapter-owned class. Plugin-dependent tooltip/select/date/treeview adapters не смешаны с этим пунктом. Production/development assets пересобраны; полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 131 Vitest + 20 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / implicit globals | Обязательный ESLint scope расширен на все first-party legacy JS entries/admin/components/WYSIWYG с явным read-only allowlist текущих browser/plugin runtimes; vendor wrappers исключены. Исправлены утечки iterator/tab/clipboard variables, неверный Vue prop constructor `Text` и несуществующий lowercase `swal`; `urlName`/`activeFilters` уже были удалены table decomposition. Browser regressions проверяют Vue env editor, восстановление/запись tab state и custom action feedback без `ReferenceError`. Production/development assets пересобраны; полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 131 Vitest + 21 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / component lifecycle | Добавлен theme/engine-neutral `Admin.Components` с уникальными definitions и симметричными `scan(root)`, `mount(element)`, `destroy(root)`, `get` и `unregister`; repeated/re-entrant mount и destroy идемпотентны, cleanup выполняется в обратном порядке и не прекращается после первой ошибки. Initial document scan выполняется после legacy modules boot, а related groups сканируют вставленный root и уничтожают subtree до Vue removal. Read-only inventory `laluna.kit\Modules` подтвердил no-build Blade extension pattern и дал реальные teardown references для polling/storage listeners и Chart.js; документация требует footer registration, явный поздний scan и cleanup. Оба asset-профиля пересобраны; полный PHP gate: 428 tests, 1580 assertions, 2 прежних TODO-skip; frontend gate: 138 Vitest + 21 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / headless browser core | Опубликованный `admin-core.js` теперь является реальным browser runtime, а не вычищаемым tree-shaking export entry: он устанавливает на существующий `Admin` узкие `Asset`, `Components`, `Data`, `DOM`, `Events`, `Http`, `Storage` и `Tables`, не заменяя legacy adapters. Добавлены native Fetch/CSRF client, first-party Web Storage repository с прежним `SleepingOwl::` prefix и namespace-safe `clear`, отдельный pure import boundary и browser smoke без `$`, jQuery, Vue и DataTable. Core CSS сокращён до cloak/loading/visually-hidden/reduced-motion behavior; palette и typography принадлежат выбранной теме. Production copier переносит каждый фактически упомянутый license sidecar рядом с bundle, а update regression подтверждает его публикацию. Production core: 39 KiB JS / 534 bytes CSS; development: 80 KiB JS / 722 bytes CSS. `npm run production` успешен; полный PHP gate: 428 tests, 1582 assertions, 2 прежних TODO-skip; frontend gate: 149 Vitest + 23 Playwright | текущий commit |
| 2026-09-06 | Этап 3 / завершение | Минимальный browser core, независимые feature/theme bundles, Sass/runtime tokens, versioned production/development profiles, first-party assets, no-build publication, native events/DOM/registries и lifecycle зафиксированы. Core не импортирует и не публикует reset, layout framework, DataTables, Vue, Bootstrap, AdminLTE, Tailwind или theme-specific CSS; legacy UI остаётся подключаемым adapter-слоем. Точка возобновления перенесена на Vue 3 migration этапа 4 | текущий commit |
| 2026-09-06 | Этап 4 / Vue 3 compat boundary | Legacy aggregate обновлён до одной Vue 3.5.42 runtime через `@vue/compat` в строгом `MODE: 3` с тестируемым allowlist из 15 временных flags; Vue 2 compiler удалён, Vue Multiselect обновлён до 3.5.0 и изолирован за `value/input` bridge. Отдельные production/development aliases гарантируют prod runtime и настоящий dev runtime с публикуемой source map; build script восстанавливает dev bundle и его Mix hash после production build. Временный inline-template bridge предотвращает reuse первого server template между экземплярами и удаляется с последним из 9 owners. Документированы владельцы/exit conditions и 8 module Vue hosts read-only Laluna. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 428 tests, 1582 assertions, 2 прежних TODO-skip; frontend gate: 155 Vitest + 24 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / bounded Vue apps | Удалён page-wide `new Vue({ el: '#vueApp' })`: восемь legacy Blade owners получили явные верхнеуровневые `data-soa-vue-app` hosts, а небольшой идемпотентный registry создаёт, находит и демонтирует отдельный compat app для каждого host, пропуская вложенные markers. `#vueApp` сохранён только как legacy layout id; `GLOBAL_MOUNT` удалён из allowlist. Browser fixture проверяет семь независимых apps, отсутствие mount на layout/вложенном marker и прежнее поведение env/upload/multiselect/related widgets; временный custom-module contract и self-closing Laluna hosts документированы. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 428 tests, 1582 assertions, 2 прежних TODO-skip; frontend gate: 169 Vitest + 24 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / app-local Vue definitions | Семь package-owned legacy components переведены с `Vue.component`/`Vue.extend` на экспортируемые `defineComponent` definitions; side-effect imports заменены единым frozen catalog. Registry регистрирует catalog через публичный `app.component` до каждого mount; runtime-compiled Multiselect wrapper включён восьмой локальной зависимостью, потому что `inline-template` разрешает его тег в app context. Package runtime больше не вызывает глобальные component/extend APIs, `GLOBAL_EXTEND` удалён из compat allowlist; consumer globals остаются только временной compat-возможностью до публичного extension API. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 428 tests, 1582 assertions, 2 прежних TODO-skip; frontend gate: 179 Vitest + 24 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / core HTTP | Удалены `vue-resource`, глобальный `Vue.http` interceptor и зависимость из lockfile; package-owned `$http` consumers отсутствовали, поэтому временный compatibility facade не вводился. Vue islands используют существующий `Admin.Http` на native Fetch с same-origin credentials, CSRF/request headers, сохранением caller headers и typed `HttpError`; после `npm prune` `got` остался только optional dependency цепочки `popper -> ngrok`. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 428 tests, 1582 assertions, 2 прежних TODO-skip; frontend gate: 180 Vitest + 24 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / app-local translations | Удалены `Vue.prototype.$trans`, пустой legacy plugin и compat flag `GLOBAL_PROTOTYPE`. Каждый bounded app получает через `app.provide` один замороженный translator с cross-bundle `Symbol.for` key; setup-компоненты используют `useTranslation()`, а отсутствие provider диагностируется явно. Новые `globalProperties`/`window` API не вводились; существующий `window.trans` сохранён только для non-Vue legacy consumers. Unit test проверяет изоляцию двух apps, browser fixture получает `Cancel` через public `runWithContext`/`inject` и подтверждает отсутствие `$trans` на prototype. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 428 tests, 1582 assertions, 2 прежних TODO-skip; frontend gate: 184 Vitest + 24 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / env editor island | Первый legacy `inline-template` перенесён в precompiled Vue SFC: Blade оставляет пустой lifecycle host и передаёт один HTML-escaped JSON object через `data-soa-vue-props`, registry до создания app валидирует имя component/props и вызывает `createApp(component, props)`. State normalization/add/remove вынесены из component, новая строка сразу editable/deletable; locked delete сохраняет прежний toast. `vue-loader` и scoped Vue ESLint/Prettier checks включены без расширения legacy JS rule surface. Осталось 8 `inline-template` и 6 legacy definitions с runtime compiler bridge. Render-contract доказывает безопасную передачу кавычек/HTML из env data. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 429 tests, 1586 assertions, 2 прежних TODO-skip; frontend gate: 197 Vitest + 24 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / file island | File element перенесён из server `inline-template` в native Vue 3 SFC/direct host; PHP передаёт route, CSRF, upload limit, labels, messages, readonly и value одним escaped JSON object. Value/URL normalization и Dropzone options/error mapping вынесены в малые тестируемые modules. jQuery `.dropzone()` заменён constructor API, actual Dropzone constructor владеет `autoDiscover = false`, а `beforeUnmount` гарантированно вызывает `destroy`; readonly island не создаёт uploader и не показывает remove. Env/file catalog entries получили отключённые compat flags. Осталось 7 `inline-template` и 5 bridge definitions. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 431 test, 1596 assertions, 2 прежних TODO-skip; frontend gate: 201 Vitest + 26 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / image island | Image element перенесён из server `inline-template` в native Vue 3 SFC/direct host. Blade передаёт escaped typed props, включая `setAssetPrefix`, `setOnlyLink`, readonly, upload limit, route/CSRF и локализованные labels/messages. Preview/value, Dropzone adapter, data-URL/paste-buffer и native `Admin.Http` transport разделены на малые modules; общий разбор upload errors вынесен из File. jQuery `.dropzone()` и Axios удалены из Image, uploader уничтожается при unmount, временный blob очищается/revoke, readonly не создаёт driver, а only-link режим отвергает blob. Осталось 6 `inline-template` и 4 bridge definitions. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 432 tests, 1607 assertions, 2 прежних TODO-skip; frontend gate: 212 Vitest + 30 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / images island | Images element перенесён из server `inline-template` в native Vue 3 SFC/direct host с escaped props для `setAssetPrefix`, `setOnlyLink`, `setDraggable`, readonly, upload limit, route/CSRF, values и локализованного UI. Array normalization/add/replace/remove/reorder/serialization, Dropzone и Sortable adapters вынесены в малые modules; jQuery, Axios, `vuedraggable` и Magnific Popup удалены из island. Нативный `<dialog>` даёт keyboard-friendly preview с previous/next/close и порядковым счётчиком, а Dropzone/Sortable/dialog уничтожаются при unmount; readonly не создаёт drivers, only-link не создаёт uploader. Исправлен подтверждённый Laluna-дефект: вставленный blob при редактировании загружается через `Admin.Http` и заменяет выбранный индекс. Визуально проверены gallery и dialog на собранном fixture. Осталось 5 `inline-template` и 3 bridge definitions. Production/development assets пересобраны; config matrix: 113 keys; полный PHP gate с PDO SQLite: 433 tests, 1620 assertions, 2 прежних TODO-skip; frontend gate: 219 Vitest + 35 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / nested island lifecycle | Временный `VueApps` registry интегрирован с единым `Admin.Components`: первоначальный top-level Vue mount сохраняет legacy boot order, затем lifecycle принимает parent apps и сканирует их фактически отрендерированное subtree. Direct hosts защищены `v-pre` от компиляции legacy parent template. Unit contracts доказывают idempotent adoption, динамический nested mount и reverse `child -> parent` teardown; browser fixture воспроизводит реальный Laluna `hasMany(image)`, монтирует initial/dynamic Image islands и удаляет их из registry до Vue DOM removal. Документация переводит динамических consumers на `Admin.Components.scan/destroy`; глобальный поиск подтвердил отсутствие `$set`, поэтому лишний `INSTANCE_SET` удалён из оставшихся 11 compat flags. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 433 tests, 1620 assertions, 2 прежних TODO-skip; frontend gate: 221 Vitest + 35 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / select islands | Select и MultiSelect перенесены из двух `inline-template` в один precompiled `ElementSelect` поверх Vue Multiselect 3.5 native `modelValue/update:modelValue`. Чистый `select-values.js` сохраняет numeric/string/null ids, option order и immutable props; single отправляет hidden input, multiple — hidden native select. Итоговый PHP `attributesArray` передаётся прямым `v-bind` без semantic class resolver, поэтому name/id/custom classes/data attributes и disabled сохраняются. Required, readonly, limit, max и tagging покрыты browser behavior; наружу уходит native bubbling `change` без jQuery. Удалены `deselect.js`, `LegacyMultiselect` и `window.Multiselect`; осталось 3 `inline-template` и 2 bridge definitions. Laluna `Modules` подтвердил 53 select, 3 multiselect, static/model options, string/numeric usage keys и nested forms. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 437 tests, 1663 assertions, 2 прежних TODO-skip; frontend gate: 223 Vitest + 35 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / related islands | Related card/no-card shells и все пользовательские classes/attributes оставлены в theme-owned Blade; один precompiled `RelatedElements` управляет только группами, add/remove и прямым SortableJS. Server-rendered group HTML передаётся как data через `application/json` и `Illuminate\Support\Js::encode`, registry валидирует referenced payload. State, DOM/name/id rewrite, lifecycle и Sortable driver разложены на малые modules. Исправлены дубли индексов при двух последовательных add и namespace вложенных direct islands до mount; browser fixture покрывает inline/referenced props, existing/dynamic `hasMany(image)`, Select2 re-init и child-first teardown. Инертный JSON payload проверен под CSP `script-src 'none'` без nonce и не компилируется как Vue template. Удалены последние 3 `inline-template`, 2 bridge definitions, `vue-inline-template.js`, `vuedraggable` и все глобальные compat flags; package inventory теперь 0/0. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1684 assertions, 2 прежних TODO-skip; frontend gate: 234 Vitest + 36 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / runtime-only Vue 3 | Удалены `@vue/compat` из dependency/lock, compat config и component wrappers, compiler-capable aliases и временный `window.Vue`. Все Vue imports теперь разрешаются в одну `vue.runtime.esm-bundler.js` instance; `createApp`, frozen precompiled catalog и Vue Multiselect 3 находятся в отдельном Vue entry, а `admin-app(.dev).js` не владеет Vue. `ADMIN_DEV_ASSETS=false` загружает `admin-app.js` + minified `vue.js`, `true` — `admin-app-dev.js` + unminified `vue-dev.js`; build script сохраняет обе dev source maps и пересчитывает оба Mix hash. Browser contracts получают версию через owned app, подтверждают отсутствие global `Vue` и одинаковое поведение всех islands в dev/prod. Production Vue: 321176 bytes, development Vue: 1251112 bytes + 1346422-byte source map. Документация переименована в `vue-runtime.md`; следующая точка — публичный custom-island API без возврата browser global. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1682 assertions, 2 прежних TODO-skip; frontend gate: 233 Vitest + 36 Playwright | текущий commit |
| 2026-09-06 | Этап 4 / custom islands и завершение | Опубликован namespaced `Admin.Vue` API с `register`, app-scoped `use`, Vue-only `scan/destroy`, `runtime` и `version`; динамический каталог поддерживает позднюю регистрацию, duplicate protection и одну package-owned runtime instance через webpack external `['Admin', 'Vue', 'runtime']`. Неизвестные server hosts безопасно остаются pending; cross-bundle skip sentinel использует `Symbol.for`, поэтому поздний component retry работает между `admin-app` и Vue chunks. Read-only `laluna.kit\Modules` дал 8 реальных hosts и migration map; добавлены документация и копируемые Blade/SFC/Mix/Meta stubs. Browser fixture загружает custom bundle после initial/module scans, проверяет два custom apps и app-scoped plugin без перемонтирования штатного island в production/development profiles; `window.Vue` не возвращён. Этап 4 закрыт, точка возобновления перенесена на DataTables 2. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1682 assertions, 2 прежних TODO-skip; frontend gate: 246 Vitest + 38 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / DataTables 2 engine и AdminLTE adapter | Прямые dependencies точно закреплены на `datatables.net`/`datatables.net-bs4` 2.3.8 и Responsive core/BS4 3.0.8. Theme-neutral engine module загружает core/Responsive и предоставляет constructor factory/version contract; отдельный legacy AdminLTE feature adapter подключает официальные Bootstrap 4 JS/CSS adapters и проверяет identity активного engine. Самописный Bootstrap 3 renderer `libs/datatables.js`, `settings.oApi`, `pageButton` override и `window.DataTable` удалены. AdminLTE 3 пока устанавливает собственное вложенное DT1-дерево как неиспользуемую транзитивную часть монолита, но browser runtime доказан как 2.3.8/3.0.8 с `dt-bootstrap4`. Старый wire protocol и временная jQuery initialization boundary сохранены до следующего checkpoint; 9 table browser scenarios покрывают filters/state/actions/inline-edit/auto-update. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1682 assertions, 2 прежних TODO-skip; frontend gate: 252 Vitest + 38 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / DataTables 2 constructor boundary | Legacy orchestration импортирует `createDataTables2` из theme-neutral engine и передаёт factory в lifecycle adapter; live-код больше не создаёт таблицу через `$(table).DataTable(...)`. Static build contract запрещает возврат jQuery plugin call, а 9 browser scenarios подтверждают DataTables 2 runtime, filters/state/actions/inline-edit/auto-update после перехода на `new DataTable(element, options)`. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1682 assertions, 2 прежних TODO-skip; frontend gate: 253 Vitest + 38 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / DataTables 2 options | First-party `sDom`, `bStateSave` и `fnDrawCallback` заменены на `layout`, `stateSave` и `drawCallback`. Async display строит нативный DataTables 2 layout object с условными length/search и постоянными info/paging regions; browser contract проверяет все четыре controls. Отдельный option normalizer сохраняет старые пользовательские `setDatatableAttributes`/config aliases как `dom`/current names и отдаёт приоритет явно заданным современным keys. State restore и draw hooks сохранены, server wire protocol не изменён. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1682 assertions, 2 прежних TODO-skip; frontend gate: 256 Vitest + 38 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / DataTables 2 extensions | Error handling, custom `DateTime` ordering и range-search registration перенесены с `$.fn.dataTable.ext` на registries активного DataTables 2 engine. Отдельный extension module валидирует зависимости, устанавливает `ext.errMode`/`ext.order`, создаёт публичный `DataTable.Api` и читает order values через native `dataset`; legacy filter driver получает `ext.search` явной зависимостью. Static contract запрещает возврат `$.fn.dataTable`/`jQuery.fn.dataTable` в first-party orchestration и filter driver. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1682 assertions, 2 прежних TODO-skip; frontend gate: 261 Vitest + 38 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / native table filters | Text, select, date, daterange и numeric/date range drivers читают native DOM values/selected options и подписываются через `addEventListener`; execute/clear/Enter controls вынесены в отдельный native module. Server wire formats `from::to` и `value:::value`, client range predicate и публичные compatibility globals сохранены. Синтетические события старых DateTimePicker/Daterangepicker/Select2 и Moment parser изолированы в legacy AdminLTE bridge, отсутствующий в modern `feature:table`; reusable filters не импортируют jQuery или Moment. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1682 assertions, 2 прежних TODO-skip; frontend gate: 270 Vitest + 38 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / table-scoped filter state | Filter storage переведён с общего positional `Filters_/route` на стабильные `Filters_/route::<encoded table id>` keys. Save/restore/clear получают только контейнеры своей таблицы; browser fixture с двумя async DataTables доказывает независимые значения, очистку и reload. Старый positional state автоматически группируется по `data-datatables-id`, не перезаписывает current state и удаляется лишь после полного сопоставления; отдельный browser-сценарий проверяет реальную миграцию двух таблиц. Пустой range `{}` больше не сохраняется. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 439 tests, 1682 assertions, 2 прежних TODO-skip; frontend gate: 274 Vitest + 40 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / DataTables config compatibility | Зафиксированы PHP/runtime-контракты `state_datatables`, зависимого `state_filters`, `default_datatables_method`, глобальных и display-local `datatables`, `datatables_highlight` и `dt_autoupdate*`. State options и auto-update normalization вынесены из orchestration/Blade в малые тестируемые объекты; custom options и поддерживаемые Hungarian aliases проходят без ложных предупреждений. Документированы только пять проверенно удалённых в DataTables 2.3.8 options (`asStripeClasses`, `fnServerData`, `fnServerParams`, `sAjaxSource`, `sAjaxDataProp`): runtime сообщает migration hint и не передаёт мёртвый key движку. Browser contracts доказывают отключение обоих state stores и config-driven highlight. Production/development assets пересобраны, Mix/profile MD5 и SHA-256 проверены compiled-entry contract; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 449 tests, 1708 assertions, 2 прежних TODO-skip; frontend gate: 279 Vitest + 42 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / native draw hooks | Draw orchestration разделён на native lazy-image и column-highlight modules, общий ordered hook и два явно legacy AdminLTE adapters. `Admin.Events` остаётся native lifecycle contract; lazy images получают browser `loading="lazy"` и source без глобального LazyLoad вызова, а подсветка использует один idempotent delegated listener и native `classList`. Bootstrap tooltip и временный X-editable изолированы под `themes/legacy-adminlte`; inline editor больше не подписан на глобальный `datatables::draw`, а таблица напрямую сканирует только собственный redraw subtree. Сам X-editable сохраняется до отдельной замены в этапе 6. Static contract запрещает jQuery в table orchestration/reusable hooks; browser gate подтверждает draw event, tooltip, lazy image, highlight и повторный inline edit. Production/development assets пересобраны, manifest content hashes валидны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 449 tests, 1708 assertions, 2 прежних TODO-skip; frontend gate: 287 Vitest + 42 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / actions и auto-update | Bulk/form actions разделены на native delegated submit, context/serialization и HTTP lifecycle modules; прежний URL-encoded wire format и `_id[]` сохранены. Успешный JSON-ответ теперь предшествует `submitted` и `Admin.Tables.reload(table)`, failure не перезагружает таблицу и публикует `failed`; lifecycle получает native `HTMLFormElement`, а старый ABI именованных callbacks с jQuery wrapper/checkbox/select изолирован только в legacy AdminLTE adapter. Auto-update больше не генерирует inline jQuery script: Blade публикует inert config host, отдельный controller на каждую таблицу вызывает только registry reload, имеет собственный timer/close teardown, а валидированный config color передаётся через `--soa-datatables-autoupdate-color`. Production/development assets пересобраны, Mix/profile MD5 и SHA-256 проверены compiled-entry tests; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 450 tests, 1711 assertions, 2 прежних TODO-skip; frontend gate: 296 Vitest + 42 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / table presentation adapters | DataTables presentation удалён из общего legacy components tree и разложен на небольшие AdminLTE/Tailwind Sass adapters с owner-local `_variables.scss`, `_colors.scss` и `_custom-properties.scss`. `feature:table` сохраняет только driver tokens; два style-only logical entries `feature:table:theme:*` добавлены в оба manifest profiles и no-build verifier теперь проверяет 12 файлов. AdminLTE adapter включает официальные Bootstrap 4/Responsive styles внутри `sleepingowl-theme.table` и повторно используется legacy aggregate без слоя; Tailwind adapter самостоятельно оформляет layout, controls, table, responsive и auto-update без Tailwind CLI. Root palette overrides намеренно остаются вне cascade layer, selectors — внутри; browser fixture проверяет реальную каскадную границу обеих тем. Production/development assets пересобраны, manifest MD5/SHA-256 валидны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate с PDO SQLite: 450 tests, 1711 assertions, 2 прежних TODO-skip; frontend gate: 310 Vitest + 44 Playwright | текущий commit |
| 2026-09-06 | Этап 5 / sync, async, tabs и завершение | Browser fixture одновременно поднимает две независимые async-таблицы и server-rendered sync-таблицу; локальные order/search не создают HTTP-запросов, а повторный вызов legacy module сохраняет те же adapters и engines. Отдельный сценарий инициализирует DataTables 2 внутри скрытой вкладки, затем проверяет видимость, ненулевую геометрию колонок и локальный поиск после открытия; подтверждённой потребности в лишнем `columns.adjust()` coordinator нет. Static scan не находит вызовов jQuery DataTables plugin API в first-party runtime. Этап 5 закрыт. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; локальный PHP gate: 450 tests, 1687 assertions, 2 прежних TODO-skip и 8 environment-skip без PDO SQLite; frontend gate: 310 Vitest + 46 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / Select2 и AJAX select | `Select`, `MultiSelect`, `SelectAjax` и `MultiSelectAjax` используют один precompiled Vue Multiselect 3 island. Transport, response normalization, exact-id dependency lookup и raw Select2 option migration разделены на небольшие modules; AJAX сохраняет POST endpoint, `q`/`page`/`depends`/`depdrop_*` payload, debounce, cancellation/stale-response protection и CSRF через `Admin.Http`. `setSelect2()` оставлен deprecated compatibility alias без смены view или подмены пользовательских classes; шесть options имеют явное mapping, plugin/unsafe/unknown options дают migration warning, а `disabled` блокирует и widget, и submitted control. Server `custom_name` рендерится как text, HTML не исполняется. Удалены first-party Select2 JS/CSS modules, behavior scans и direct dependency; `select2@4.0.13` пока остаётся только транзитивным dependency старого `admin-lte@3.2.0` до полной theme-миграции. Raw custom `.input-select` остаётся рабочим native select. Добавлена migration matrix `select2-options.md` и отдельный browser fixture. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; локальный PHP gate: 453 tests, 1704 assertions, 2 прежних TODO-skip и 8 environment-skip без PDO SQLite; frontend gate: 321 Vitest + 49 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / date controls | `Date`, `DateTime`, `Time`, `Timestamp` и date/date-range table filters переведены на единый Air Datepicker 3.6 driver. Parsing/formatting, locale resolution, option normalization, range constraints и lifecycle разложены на отдельные modules; сохранены Moment-style форматы, seconds/month names/literals/12–24 hour time, ISO fallback, separator ` - ` и прежние range `data-*`. PHP публикует явный `data-soa-date-control`, не меняя пользовательские classes/attributes, config keys `dateFormat`/`datetimeFormat`/`timeFormat`/`timezone`, server string serialization и timezone conversion. Dynamic controls используют idempotent `Admin.Components.scan/destroy`, disabled/readonly picker не монтируют. Табличные filters перешли на native `change` и общий parser; legacy jQuery/Moment bridge, DateTimePicker/Daterangepicker modules и их Sass удалены. Moment и старые picker dependencies временно остаются только для X-editable и транзитивного AdminLTE до следующих checkpoints. Добавлена `date-controls.md`. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 454 tests, 1710 assertions, 10 skipped; frontend gate: 333 Vitest + 52 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / dependent select | `DependentSelect` и `MultiDependentSelect` переведены с jQuery `dependent-dropdown` на общий precompiled Vue Multiselect 3 island. Сохранены PHP DSL, POST payload `depdrop_parents`/`depdrop_all_params`, keyed/array `output`, optional `selected`, initializable mode и single/multiple values; пользовательские classes/attributes передаются напрямую. Transport, response normalization и value resolution разделены на малые modules; запросы используют `Admin.Http`, отмену и stale-response protection. Lifecycle публикует native bubbling `change` и `depdrop:*` CustomEvent, а related elements используют общий `Admin.Components` lifecycle. Прямой dependency и first-party jQuery wrappers удалены. Playwright request ledger изолирован по worker для детерминированного параллельного gate. Добавлена `dependent-select.md`. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 456 tests, 1728 assertions, 10 skipped; frontend gate: 341 Vitest + 54 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / inline editor | Все девять editable column types переведены с X-editable на небольшой native controller через `Admin.Components` и `Admin.Http`; сохранены PHP DSL, inline/popup modes, readonly policy и URL-encoded `name`/`pk`/`value`/`value[]` contract. Пустой checkbox/checklist отправляет явное значение, а date/datetime повторно используют общий Air Datepicker lifecycle. Options публикуются безопасным inert `application/json` payload через `Js::encode`; 422 validation остаётся внутри editor, HTTP 500 получает локализованную ошибку, активный запрос отменяется через `AbortController`, lifecycle наружу использует bubbling `CustomEvent`. Поиск editable column и backend update flow вынесены из controller в отдельные малые PHP services с recursive nested-display lookup и тестами event/404/nested value. AdminLTE/Tailwind presentation принадлежит отдельным Sass adapters и `--soa-*`; пользовательские classes/attributes передаются напрямую. Прямые `x-editable-bs4`, `bootstrap4-datetimepicker`, `moment` и `tempusdominus-core`, legacy wrappers и component Sass удалены; остатки Moment/Tempus Dominus существуют только транзитивно под `admin-lte`. Добавлена `inline-editor.md`. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 474 tests, 1848 assertions, 10 skipped; frontend gate: 351 Vitest + 58 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / Nestable tree | `DisplayTree` переведён с `nestable2`/jQuery на отдельный SortableJS driver через `Admin.Components` и `Admin.Http`; сохранены PHP DSL, max depth, initial collapsed level, scoped expand/collapse, reorder endpoint, nested URL-encoded payload, `parameters` и compatibility event `display.tree::changed`. Структура, config, transport, Sortable lifecycle, view state и legacy notifications разделены на малые modules; параметры публикуются через inert `application/json` + `Js::encode`, быстрые перемещения сохраняются последовательно. Добавлены native `tree:changed`/`tree:failed`, error state, доступные controls, независимые AdminLTE/Tailwind Sass adapters и три no-build manifest entries; пользовательские classes/attributes передаются напрямую. Удалены direct dependency `nestable2`, jQuery wrapper и legacy Nestable/panel styles; добавлена `tree.md`. Production/development assets пересобраны и проверены как 16 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 476 tests, 1863 assertions, 10 skipped; frontend gate: 384 Vitest + 63 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / Magnific Popup lightbox | Прямой `magnific-popup` dependency и jQuery wrapper удалены; отдельный `feature:lightbox` использует точно закреплённый `glightbox@3.3.1`, нейтральный marker `data-soa-lightbox` и deprecated selector `data-toggle="lightbox"` только как compatibility boundary. Один delegated controller поддерживает динамические ссылки без rescan, document-order galleries, modifier clicks, idempotent lifecycle teardown и native `lightbox:opened`/`lightbox:closed`; captions из `data-title`/`title` экранируются до передачи vendor API. Presentation разделён на независимые AdminLTE/Tailwind Sass adapters с owner-local variables/colors/`--soa-*`, добавлены три no-build manifest entries и `lightbox.md`; PHP не возвращает CSS-классы. Production/development assets пересобраны и проверены как 20 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 476 tests, 1863 assertions, 10 skipped; frontend gate: 414 Vitest + 70 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / native tabs | Bootstrap/jQuery tab API заменён отдельным theme-neutral `feature:tabs` с delegated controller для статических и динамических tab lists. Сохранены config key `state_tabs`, исторический `Tabbed_<pathname>` storage key, нормализация edit URL и compatibility events `bootstrap::tab::hidden/shown`; добавлены native bubbling `tab:hidden/shown`, ARIA/keyboard navigation, disabled и nested tab support. Package Blade использует `data-soa-tab`, прежний `data-toggle="tab"` остаётся только deprecated compatibility selector; AdminLTE/Tailwind presentation разделён на Sass adapters. Production browser entry реально устанавливает driver поверх `admin-core` без jQuery; production/development assets пересобраны и проверены как 23 файла на профиль. Config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 476 tests, 1863 assertions, 10 skipped; frontend gate: 439 Vitest + 77 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / native tooltip | Bootstrap/jQuery tooltip API заменён отдельным framework-neutral `feature:tooltip`; публичный marker `data-toggle="tooltip"`, `title`, `data-original-title` и `data-placement` намеренно сохранены без миграции пользовательских шаблонов. Один controller на `body` обслуживает статические и динамические triggers, DataTables redraw и Vue controls без per-element initialization; content выводится только через `textContent`, доступны focus, Escape, `aria-describedby`, viewport flip/clamp и native `tooltip:shown/hidden`. Общий behavior Sass и AdminLTE/Tailwind presentation adapters разделены, цвета и параметры принадлежат `_colors.scss`/`_variables.scss`/`--soa-*`. Production/development assets пересобраны и проверены как 27 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 476 tests, 1863 assertions, 10 skipped; frontend gate: 469 Vitest + 82 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / native dropdown | Bootstrap/jQuery dropdown API заменён отдельным framework-neutral `feature:dropdown` с одним delegated controller для статической и динамической разметки. Для мягкого перехода публичный `data-toggle="dropdown"` и структурные `.dropdown`/`.btn-group`/`.dropdown-menu`/`.dropdown-item` сохранены без переименования; никакие replacement `data-soa-dropdown*` attributes не введены. Driver владеет `aria-haspopup`, `aria-expanded`, `hidden`, `show` и `open`; поддерживает один открытый menu, outside click/focus, form controls, disabled items, Arrow Up/Down, Home/End, Escape с возвратом focus и cancelable native lifecycle events. Bootstrap jQuery data API не исполняется, legacy aggregate предоставляет тот же controller как `Admin.Dropdowns`. Общий behavior Sass и независимые AdminLTE/Tailwind adapters используют owner-local `_colors.scss`/`_variables.scss`/`--soa-*`; старые dropdown style owners удалены. Production/development assets пересобраны и проверены как 31 файл на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 477 tests, 1872 assertions, 10 skipped; frontend gate: 504 Vitest + 90 Playwright | текущий commit |
| 2026-09-06 | Этап 6 / native sidebar | AdminLTE PushMenu/Treeview и jQuery cookie wrapper заменены отдельным theme-neutral `feature:sidebar` через единый delegated `Admin.Components` controller. Для мягкого перехода сохранены публичные `data-widget="pushmenu"`/`data-widget="treeview"`, `data-accordion`, структурные классы и исторический `sidebar-state`; replacement `data-soa-sidebar*` не вводились. Сохранены desktop preference, cookie/localStorage compatibility и responsive collapse без перезаписи предпочтения; overlay и Escape возвращают focus. Navigation tree поддерживает dynamic scan, non-accordion branches, ARIA и полную keyboard navigation. Native и AdminLTE-compatible lifecycle events cancelable; delayed timer очищается при destroy. Общий behavior Sass и независимые AdminLTE/Tailwind presentation adapters декомпозированы; `Sidebar` добавлен восьмой theme capability. Исполнение `admin-lte` JavaScript полностью удалено, dependency временно остаётся источником legacy Sass до этапа тем. Production/development assets пересобраны и проверены как 35 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 477 tests, 1872 assertions, 10 skipped; frontend gate: 535 Vitest + 97 Playwright | текущий commit |
| 2026-09-07 | Этап 6 / native Files | Последний файловый jQuery island `Files` заменён декомпозированным native lifecycle controller; `File`, `Image` и `Images` остаются Vue 3 islands. Для мягкого перехода без изменений сохранены PHP DSL, submitted JSON `{url,title,desc,orig}`, upload endpoint, classes `.fileUploadMultiple`/`.files-group`/`.fileBrowse`/`.fileValue`/`.fileThumbnail`, `data-id`, link/remove/drag controls и legacy module `form.elements.files`; новые `data-soa-files*` не вводились. Старый исполняемый `new Function` template renderer заменён inert DOM clone с заполнением через properties/`textContent`. Flow.js удалён из source/dependencies/lock: native `FormData` через `Admin.Http` сохраняет `file`, `_token`, CSRF и selection order; uploader поддерживает click/keyboard/drop, abort и полный destroy/rescan. Добавлены bubbling `files:changed/uploaded/failed`, документация и browser upload/422/lifecycle contracts. Production/development assets пересобраны и проверены как 35 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 477 tests, 1872 assertions, 10 skipped; frontend gate: 541 Vitest + 100 Playwright | текущий commit |
| 2026-09-07 | Этап 6 / WYSIWYG lifecycle | Общий jQuery scan и SimpleMDE `$()` заменены декомпозированными registry/config/component modules и четырьмя маленькими native adapters. Для мягкого перехода сохранены `textarea[data-wysiwyg-editor]`, `data-wysiwyg-parameters`, `data-wysiwyg-inited`, имена `ckeditor`/`ckeditor5`/`tinymce`/`simplemde`, config/asset manager, compatibility module, события и `Admin.WYSIWYG.add/register/get/switchOn/switchOff/exec`; добавлены только optional `scan` и `editor`. Editor globals разрешаются лениво, поэтому общий bundle безопасен без неиспользуемых CDN scripts. Registry нормализует sync instance, Promise и TinyMCE array; switch/destroy корректно работают во время async startup, CKEditor 5 insert использует model API. Dynamic related forms используют единый idempotent `Admin.Components` teardown; старые закомментированные inline scripts/views удалены. Production/development assets пересобраны и проверены как 35 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 477 tests, 1872 assertions, 10 skipped; frontend gate: 549 Vitest + 102 Playwright | текущий commit |
| 2026-09-07 | Этап 6 / native action callbacks | Последний jQuery boundary в табличных actions удалён: именованный `__callback` по-прежнему разрешается на `window`, bulk callback сохраняет четыре, а form callback два позиционных аргумента в прежнем порядке, но wrapper/select теперь native elements, а checkboxes — обычный массив. Добавлена migration table для типичных `.find()`/`.each()`/`.val()`/`.addClass()`; chainable mini-jQuery намеренно не создаётся. Удалены неиспользуемый `jquery-form` из source/dependencies/lock, пустой Noty wrapper/imports и отключённый jQuery draft table filters. `data-toggle="dropdown"` и остальные согласованные compatibility markers не менялись; `data-soa-dropdown*` не вводился. Следующий boundary — native `data-dismiss="alert"`, после него глобальные jQuery/Bootstrap wrappers. Production/development assets пересобраны и проверены как 35 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 479 tests, 1875 assertions, 10 skipped; frontend gate: 554 Vitest + 102 Playwright | текущий commit |
| 2026-09-07 | Этап 6 / native alert и jQuery globals | Bootstrap alert data API заменён behavior-only `feature:alert` через delegated `Admin.Components` controller. Для мягкого перехода сохранены `data-dismiss="alert"`, `.alert`/`.fade`/`.show`, `data-target`/`href`, cancelable native `alert:close` и Bootstrap-compatible `close.bs.alert`/`closed.bs.alert`; `data-soa-alert*` не вводился. Dynamic alerts работают без rescan, transition имеет вычисляемый timeout fallback, destroy очищает listeners/timers, а `Admin.Alerts.close/scan` доступен legacy aggregate. Удалены `libs/jquery.js`, `libs/bootstrap.js`, их imports, прямой `jquery` dependency и ESLint globals; Bootstrap package временно остаётся только источником legacy Sass, jQuery в bundle — закрытая vendor-деталь DataTables 2. Browser contracts переведены с jQuery plugin API на `Admin.Tables`; legacy aggregate подтверждён без `$`/`jQuery` globals. Этап 6 закрыт. Production/development assets пересобраны и проверены как 36 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 479 tests, 1875 assertions, 10 skipped; frontend gate: 563 Vitest + 106 Playwright | текущий commit |
| 2026-09-07 | Этап 7 / Sass ownership и shared icons | Монолитные Bootstrap 4/AdminLTE 3 imports убраны из общего legacy entrypoint под явный `_legacy-build.scss` владельца темы; переменные файлового адаптера читаются через namespace, а structural selectors и прежний порядок cascade сохранены контрактными тестами. Font Awesome отделён от AdminLTE и Tailwind в общий `shared:icons` logical asset с самостоятельными production/development CSS и source map только в development; legacy `admin-app.css` продолжает включать иконки в прежней позиции. Theme asset contract расширен общими `shared:*` entries, default legacy theme явно требует `shared:icons`; готовые AdminLTE/Tailwind classes подключат тот же entry. Font Awesome обновлён с `7.2.0` до проверенной через npm registry стабильной `7.3.1`. Публичный `data-toggle="dropdown"` сохранён, `data-soa-dropdown*` не введён. Production/development assets пересобраны и проверены как 37 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 480 tests, 1877 assertions, 10 skipped; frontend gate: 575 Vitest + 106 Playwright | текущий commit |
| 2026-09-07 | Этап 7 / built-in AdminLTETheme boundary | Добавлена прямая `AdminLTETheme`, одновременно реализующая новый theme contract и прежний template contract; новый config default выбирает её через неизменный `sleeping_owl.template`, а опубликованные config с `TemplateDefault` остаются рабочими через legacy adapter. Тема явно объявляет `shared:icons`, собственный theme entry, семь component presentation adapters и все существующие capabilities без PHP-преобразования icon/CSS classes. Standalone `theme:legacy-adminlte` теперь содержит Bootstrap/AdminLTE и прежнюю разметку, но не Font Awesome; Dropzone/Vue Multiselect CSS встроен Sass-сборкой без runtime imports из `node_modules`. Framework CSS помещён в более низкий cascade layer через отдельный Sass wrapper, поэтому подключаемые feature adapters предсказуемо переопределяют presentation. Compatibility aggregate пока остаётся runtime default внутри унаследованного `initialize()` до подготовки самодостаточных browser entries; этот незавершённый шаг отмечен отдельно. Production/development assets пересобраны; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 483 tests, 1886 assertions, 10 skipped; frontend gate: 576 Vitest + 106 Playwright | текущий commit |
| 2026-09-07 | Этап 7 / logical asset registrar | Versioned manifest resolver связан с first-party meta/asset registry отдельным `LogicalAssetRegistrar`: resolver по-прежнему только выбирает и строит URL, registrar только регистрирует готовые CSS/JS. Handles детерминированы по package asset path и не меняются между production/development profiles или при новой content version; внутри каждого типа создаётся явная dependency chain, поэтому manifest order сохраняется asset sorter-ом. Сервис зарегистрирован в container, но `AdminLTETheme` пока не переключена на logical entries до готовности browser boot bundles. Пользовательские assets и legacy `TemplateDefault` не менялись. Config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 485 tests, 1898 assertions, 10 skipped; frontend gate: 576 Vitest + 106 Playwright | текущий commit |
| 2026-09-07 | Этап 7 / profile-aware shared Vue | Vue 3 runtime, precompiled package islands и публичный `Admin.Vue` extension API вынесены из legacy source tree в самостоятельный `shared:vue` browser entry. Manifest содержит один и тот же `js/shared/vue.js` внутри обоих изолированных profiles: development поставляется несжатым с diagnostics/source map, production — minified без map; выбор остаётся только за `ADMIN_DEV_ASSETS`. Прежние `vue.js`/`vue-dev.js` теперь тонко используют тот же source и остаются рабочими для `TemplateDefault`. Прямая браузерная проверка обоих logical profile files монтирует package/custom islands без `window.Vue`; `AdminLTETheme` объявляет `shared:vue`, но runtime switch пока не выполнен. Production/development assets пересобраны и проверены как 38 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 485 tests, 1898 assertions, 10 skipped; frontend gate: 581 Vitest + 108 Playwright | текущий commit |
| 2026-09-07 | Этап 7 / shared compatibility runtime | Legacy browser API отделён от headless core в самостоятельный profile-aware `shared:compatibility`: чистая функция установки не auto-bootится внутри старого aggregate, а browser entry требует ранее загруженный core. Сохранены `Admin.Config/Url/User`, `Admin.Messages/Modules/WYSIWYG`, `_`, `axios`, `Swal`, `trans`, CSRF/config semantics и identity всех core services. `AdminLTETheme` объявляет compatibility перед `shared:vue`; сам bundle не создаёт `$`/`jQuery`, Vue, DataTables или Bootstrap/AdminLTE globals. Прямые browser contracts проверяют оба готовых профиля. Production/development assets пересобраны и проверены как 39 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 485 tests, 1898 assertions, 10 skipped; frontend gate: 586 Vitest + 110 Playwright | текущий commit |
| 2026-09-07 | Этап 7 / lightbox и tree browser entries | `feature:lightbox` и `feature:tree` переведены с library-only `index.js` на отдельные side-effect browser entries, а публичные `index.js` остались чистыми для программного импорта. Оба entry сами устанавливают lifecycle definitions и выполняют initial scan поверх `admin-core`; доступны `Admin.Lightboxes`/`Admin.Trees`. Tree labels читаются через optional `trans` с английским fallback, но AdminLTE notification policy намеренно остаётся в legacy aggregate до отдельного theme runtime adapter. Прямые Chromium contracts загружают именно опубликованные production/development core + feature files, открывают lightbox, монтируют оба дерева и подтверждают отсутствие `$`/`jQuery`, Vue, DataTables и Bootstrap/AdminLTE globals. Production/development assets пересобраны и проверены как 39 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 485 tests, 1898 assertions, 10 skipped; frontend gate: 588 Vitest + 114 Playwright | текущий commit |
| 2026-09-07 | Этап 7 / forms browser entry | `feature:forms` переведён с library-only entry на самостоятельный browser runtime поверх `admin-core + shared:compatibility`; чистый `index.js` остаётся API для программного импорта. Единый `Admin.Forms.scan(root)` устанавливает form buttons, Air Datepicker, Files, WYSIWYG и password/text generators; прежний `Admin.WYSIWYG.scan` сохранён. Form buttons и generators используют общий idempotent lifecycle, работают со всеми элементами, публикуют native `input`/`change` и сохраняют прежние markers/classes/options. CKEditor 4/5, SimpleMDE и TinyMCE регистрируются лениво, поэтому неиспользуемые editor globals не требуются. Browser fixture проверяет submit/CSRF, несколько генераторов, date, Files serialization, CKEditor lifecycle, dynamic scan/destroy и отсутствие `$`/`jQuery`, Vue, DataTables и Bootstrap/AdminLTE globals в обоих готовых профилях. Production/development assets пересобраны и проверены как 39 файлов на профиль; config matrix: 113 keys и legacy/minimal fixtures валидны; полный PHP gate: 485 tests, 1898 assertions, 10 skipped; frontend gate: 591 Vitest + 116 Playwright | текущий commit |
