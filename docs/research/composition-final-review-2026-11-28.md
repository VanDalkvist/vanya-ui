# Composition — итоговое ревью, 2026-11-28

## Объём и основания

Ревью исходников, потребительских контрактов и фактического поведения витрины относительно production [2.0.0, 6ae7c4e](https://github.com/VanDalkvist/vanya-ui/commit/6ae7c4ed06bb4905ba350ecd69009ff6f3c366dd). Исходный кандидат ревью — [3c77412](https://github.com/VanDalkvist/vanya-ui/commit/3c7741239d1feebc836df827031c1969c4fd8f1a): 118 изменённых путей, 160 коммитов от production; с функционального GREEN 8578a0b изменялись только QA и журнал. Правила: AGENTS.md, DESIGN.md, docs/patterns/regression-gate.md, docs/versioning.md; закреплённые arch skills VanDalkvist/arch-improvement-skills@eeda1921e0cace214c2e04306db4e1dce82bb300. Работа в main, внешние потребители сохраняют pins.

## Архитектурная оценка

- Композиция: CatalogSection остаётся приватным каркасом витрины; компоненты библиотеки не зависят от него. WorkspaceSplit и WorkspaceContextHeader сохраняют собственные контрактные границы.
- Примитивы: Badge/Tag являются пассивными метаданными; Disclosure использует нативный details. Таксономия категорий и данные радара принадлежат потребителю. Удалённые публичные имена и миграции перечислены в CHANGELOG.
- Диалоги: общий приватный modal lifecycle владеет scroll lock и возвратом фокуса, вызывающие компоненты владеют содержимым и закрытием. Обнаружен отдельный случай всплытия Escape при вложении React-дерева; см. ниже.
- Поставка: package exports, 45 записей генерируемого registry и Markdown-карта публикации проверены по исходникам. Registry используется как discovery index; отдельная автономная установка через shadcn не заявлена, расширение формата не входит в цикл.
- Совместимость: React 18/19 и CSS-токены сохраняют заявленный контракт с перечисленными major-миграциями. Установленный пакет на точном SHA 8ad559f проверен в двух комбинациях npm/React 18 и Bun/React 19, включая Harness, клиентскую сборку и SSR.

## Находки и решения

| Находка | Приоритет | Решение |
|---|---|---|
| Keyboard oracle хлебных крошек допускал принудительный focus | P2 | Исправлен в 1339c3f; реальный Shift+Tab, отрицательный контроль tabindex=-1 и восстановление. Cloudflare 4/4 PASS при ширинах 1440/1024/390/320, точный SHA 96e5f1986b53a8396861185789985de2197f2c7d. |
| Escape во вложенном React-диалоге может закрыть внешний | P2 | Минимальный stopPropagation для Escape/cancel в fa36e4e; unit-сценарий 14c4c36, нативный сценарий 8ad559f. PASS: unit и нативный вложенный Escape; прежние два sibling-dialog сценария также прошли. |
| README выдавал историческую версию 1.0.0 за текущую | P2 | Исправлено e9228cd и 96e5f19; ссылка на package.json и фактический production. |
| Полноразмерная визуальная приёмка | P2 evidence | Все 176 пар сравнивались; 13 совпали, 163 различались. Просмотрены восемь контактных листов. Повтор 66 тёмных сцен сохранил все статусы. Дополнительный native compare 66 desktop/mobile сцен: 5 matched, 61 different, 0 missing. Cloudflare прервал вывод оригинальных PNG в лог после первого полного кадра и начала второго; детальная пара недоступна. Эталон неизменён. |
| Независимое arch/product/design ревью | P2 evidence | Текущая авторская проверка выполнена. Отдельный подтверждённый Pi Durable reviewer не доступен в текущем интерфейсе; независимая приёмка остаётся NOT_VERIFIED. |

## Визуальные изменения

По восьми обзорным листам: общий каркас и spacing секций, типографика, навигация и переносы, семантические Badge/Disclosure, группировка форм и рабочих поверхностей соответствуют заявленным изменениям. Явного исчезновения секций или крупного перекрытия не выявлено. ReceiptDigestModal совпал в восьми контекстах, мобильный InspectDrawer в четырёх. Детали desktop drawer, reading inspector и узкой шапки требуют полноразмерной проверки. Просмотр уменьшенных изображений ограничивает выводы по мелкому тексту, контрасту и clipping. Strict pixel gate сохраняет FAIL; автоутверждения и обновления baseline нет.

## Граница выпуска

Ранее подтверждено 139 Playwright + 155 Vitest + 55 Node + 3 Harness E2E на 8578a0b; 8 visual cases запускаются отдельно. Финальный кандидат исходников 8ad559f31548973f5e83dac3a7615ce54afdab93 добавляет исправление nested Escape и проверки. Отдельная Cloudflare validation-only сборка завершилась SUCCESS: 156/156 Vitest, 55/55 Node, 3/3 Harness E2E, оба typecheck, 7/7 targeted Playwright (4 keyboard, 2 sibling dialogs, 1 nested dialog), compiled Vite preview, design lint без новых нарушений. Installed consumer smoke: 2/2 PASS, npm 10.9.2/React 18.3.1 и Bun 1.4.4/React 19.0.0 на Node 24.22.1; в обоих случаях install, CLI, types, harnessLint, harnessNegative, compiledCss, compiledCssNegative, client, SSR PASS. RED-прогон старого hook через длинную команду отклонён API HTTP 400; результат RED отсутствует, причинность установлена по исходникам. Первый targeted browser build завершился на скачивании Chromium до тестов; следующая сборка дала 4/4 PASS для keyboard. Отдельная попытка consumer smoke была пропущена платформой. Точные результаты записаны в [ledger](../arch-improvement/ledger.md). Production trigger и release marker не изменялись. Нет новых CI, storage или внешних миграций. Версионирование 3.0.0, immutable tag и deploy остаются за gate. До независимой и требуемой визуальной приёмки статус цикла NOT_VERIFIED; возможное исключение требует отдельного явного решения владельца.


## Финальный результат выпуска
Владелец явно одобрил принятие остаточного риска и выпуск 3.0.0. Точный versioned SHA 8fc08b24a40e978bf2d4e0900069f1488baf0ca0 прошёл полный production gate: 156 Vitest, 55 Node, 3 Harness E2E, два consumer smoke и 140 native Playwright functional scenarios. Cloudflare terminal SUCCESS; 100% active traffic; публичный HTML подтверждает 3.0.0. Визуальная и независимая приёмки сохраняют исходный статус; исключение относится только к данному checkpoint. TAGGED: UNTAGGED (нет операции создания annotated tag в текущем connector). Итоговые детали в ledger.
