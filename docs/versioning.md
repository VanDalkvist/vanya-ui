# Версионирование Vanya Arc / UI

Пакет исходников — `@vanya/ui`; [ui.vanya-arc.dev](https://ui.vanya-arc.dev/) — обновляемая документация. **Деплой сайта из main не равен релизу пакета.** Релиз считается опубликованным только при наличии проверенного коммита и тега `vX.Y.Z`. GitHub Release может дополнительно оформлять опубликованный тег. npm-публикация пока не настроена.

## SemVer

- `MAJOR.MINOR.PATCH`. Пока API имеет версию `0.x`, несовместимые изменения поднимают MINOR; совместимые исправления — PATCH. Совместимые новые возможности могут повышать MINOR. После 1.0 несовместимость означает MAJOR.
- Номер меняется намеренно, вместе с [CHANGELOG](../CHANGELOG.md). Тег указывает только на коммит, прошедший проверку; не передвигайте опубликованные теги.
- `0.2.0` включает совместимый параметр `WorkspaceContextHeader.breadcrumbSize="large"`. Исходное значение `default` сохранено. У проекта нет обязательной миграции на новые размеры.
- `@vanya/brand` живёт отдельно: её SHA и права на фирменный рисунок не меняются автоматически при выпуске Vanya UI.

## Воспроизводимый ручной выпуск

1. Закрыть реализацию, проверку публичности, тесты и браузерный QA. Использовать [portable UI skill](../skills/vanya-ui/SKILL.md), а не автоматические GitHub Actions.
2. Обновить версию в `package.json`, раздел `CHANGELOG.md` с точной датой и сведениями о совместимости. Например `npm version 0.2.1 --no-git-tag-version` меняет номер **без** неявного Git-тега; проверить дифф.
3. Выполнить на любой машине `node scripts/check-release.mjs`, `bun run test`, `bunx tsc --noEmit -p tsconfig.build.json`, `bun run build`. Дополнительно проверить фактический UI в браузере и что публичная сборка не раскрывает секреты.
4. Закоммитить изменения. Сверить SHA текущего successful Cloudflare Workers Build с коммитом. Только после этого явно создать **annotated tag** на проверенном SHA:
   
   ```sh
   git fetch origin main
   git tag -a v0.2.0 VERIFIED_COMMIT_SHA -m "Vanya UI v0.2.0"
   git push origin v0.2.0
   ```

   Здесь `v0.2.0` — пример для текущей версии, `VERIFIED_COMMIT_SHA` — подтверждённый полный hash. Команды требуют обычного Git-доступа, **не** CI. Если тег не создан — статус **UNTAGGED**, даже если package.json и сайт обновлены.
5. Обновить каждое приложение **отдельно**: выбрать подтверждённый 40-символьный SHA, заменить ссылку на `@vanya/ui`, обновить lockfile и выполнить локальные build + browser + visual проверки. Никакого фонового обновления всех продуктов.

## Исторический проверенный тег

Исторический проверенный релиз от 2026-11-25 — [v0.4.1](https://github.com/VanDalkvist/vanya-ui/tree/v0.4.1), SHA `71bcc0fa7ef7f77d908feb5745b642790a9a7482`, [отчёт приёмки](verification/71bcc0fa7ef7f77d908feb5745b642790a9a7482/README.md). Более новые версии CLI/гайдов в main могут использоваться локально; API выбирается по фактически установленному пакету. При выпуске нового проверенного тега обновите эту ссылку. Публикация сайта сама по себе не меняет подтверждённый релиз.

## Как закреплять зависимость

В отсутствие npm-релиза используйте source tarball, закреплённый полным commit SHA, как в существующих приложениях:

```json
{
  "dependencies": {
    "@vanya/ui": "https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/<verified-40-char-commit-sha>"
  }
}
```

Сохраняйте `@vanya/ui/tokens.css` и актуальные экспорты установленной версии. Не используйте движущийся `main`, необоснованные ranges, и не считайте публикацию витрины автоматическим обновлением потребителей.

## Контракт поставки

Текущий пакет поставляется исходниками ESM: публичные пути — `@vanya/ui` и `@vanya/ui/tokens.css`. Все поля разрешения главного модуля ведут к `src/index.ts`; условие `types` объявлено первым. `dist/` — production-витрина, её HTML и assets не являются библиотечным артефактом.

Потребитель должен компилировать TS/TSX из зависимостей, использовать React 18/19 и Tailwind 4, регистрировать исходники UI через `@source`. Для TypeScript используйте `moduleResolution: "bundler"`. Для SSR сборщик должен трансформировать пакет (например, Vite `ssr.noExternal` при необходимости). CommonJS и прямой запуск source TSX в Node без трансформации не входят в контракт. Установка закрепляется полным SHA и lockfile.

Проверка метаданных исходников выполняется вместе с Node-тестами. Фактическая совместимость каждого менеджера/сборщика и SSR подтверждается отдельным consumer-smoke; пока эти проверки не выполнены, поддержка соответствующей комбинации остаётся NOT_VERIFIED.

## Consumer-smoke перед тегом

Ручной запуск на машине с доступом к GitHub/codeload/npm registry, Node 22.12+ и Bun:

~~~sh
npm run test:consumer -- FULL_40_CHAR_SHA
# For harness-capable versions (0.5.0+):
npm run test:consumer -- FULL_40_CHAR_SHA --harness
~~~

Скрипт создаёт две временные директории вне репозитория: npm + React 18 и Bun + React 19, обе с Vite 8 / Tailwind 4. Каждая устанавливает source tarball конкретного SHA, проверяет точное разрешение прямой зависимости в lockfile, имя установленного пакета, TypeScript bundler resolution, клиентскую сборку и CSS, SSR build и фактическую HTML-разметку. Лог и receipt.json сохраняются рядом с lockfiles. Перед публикацией выписки проверьте локальные пути, параметры окружения и сведения инфраструктуры; исходные логи оставляйте локально. Результат FAIL/BLOCKED требует выяснения причины; тест не изменяет реальные потребители. Для просмотра исходников стенда без установки добавьте `--prepare-only`: этот режим оставляет статус NOT_RUN.

Перед тегом проверить обе комбинации на точном SHA, затем выполнить отдельную визуальную/браузерную приёмку. Миграция с 0.2.x: проверить все SegmentedControl, которым нужны настоящие вкладки, передать `semantics="tabs"`, `tabId/panelId` и связанные панели; фильтры сохраняют обычные кнопки. Метаданные entrypoint теперь согласованы с source package; для SSR настроить трансформацию зависимостей. Продукты обновляются индивидуально.

## Миграция CraftCard в 0.4.0

`isInteractive={false}` теперь явно отключает действие карточки, даже если передан `onClick`. Если действие должно работать, уберите флаг или передайте true и реальный обработчик. Без обработчика карточка пассивна. Вложенные интерактивные элементы больше не запускают действие родительской карточки через всплытие click. Для карточек с независимыми действиями используйте пассивную поверхность и отдельные кнопки/ссылки; не задавайте вручную role=button/tabIndex для пассивной карточки. Свои обработчики и классы проверяйте при обновлении. Существующие продукты сохраняют закреплённые SHA.

## Независимые критерии

- `PACKAGE_VERSION`: SemVer и changelog совпадают.
- `BUILD_VERIFIED`: тесты, типы, build прошли на конкретном SHA.
- `UI_VERIFIED`: UI открыт и визуально проверен в браузере.
- `TAGGED`: существует Git-тег именно этого SHA.
- `CONSUMER_UPDATED`: отдельный результат для каждого продукта.

Первая осмысленная исходная версия — `0.2.0`. Номер сам по себе **не означает**, что тег создан.

## История проверки харнесса

0.5.0 и 0.6.0 — предыдущие проверенные кандидаты. Для текущего подключения используйте 1.0.0 ниже и [harness quickstart](patterns/design-harness-quickstart.md). Существующие продукты сохраняют закреплённые версии до отдельного решения.

### Проверенный кандидат для явного пилотного подключения

**0.5.0 / BUILD_VERIFIED / UNTAGGED** — [`3d344042218c6a5323e2c51da0e7582bdca1d30a`](https://github.com/VanDalkvist/vanya-ui/commit/3d344042218c6a5323e2c51da0e7582bdca1d30a), 2026-11-25. Cloudflare CI: 125 Vitest, 37 Node, 3 harness E2E; реальные npm/React 18 и Bun/React 19 consumer smoke, включая отрицательные тесты линтинга и compiled CSS, прошли. Этот неизменяемый SHA доступен для явно согласованного пилотного внедрения. UI_VERIFIED и релизный тег открыты; текущий опубликованный релиз остаётся 0.4.1. Установка кандидата через `https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/3d344042218c6a5323e2c51da0e7582bdca1d30a` с lockfile. Существующие продукты сохраняют закреплённые версии до отдельного решения.

## Identity-capable candidate
The 0.5.0 verified harness pin above predates `productMark` and contributor mode. The 0.6.0 candidate [`260a680c0fecb0491d3ccad3d176af11a090ca76`](https://github.com/VanDalkvist/vanya-ui/commit/260a680c0fecb0491d3ccad3d176af11a090ca76) passed Cloudflare CI: 131 Vitest, 46 Node, zero new design-lint findings, negative fixtures and both React/npm/Bun consumer combinations. Existing lockup defaults remain compatible. New identity work selects an approved mark explicitly; older pins use available APIs and existing approved assets. No automatic upgrades.

## 1.0.0 — first stable major

Owner approved merge and major promotion on 2026-11-25 based on the preceding green CI. Follow-up independent architecture/product review, visual regression review and live agent exercise are explicitly deferred. The 1.0.0 change is release metadata/documentation; the tested component and CLI implementation and dependency pin are preserved. The owner accepts the outstanding visual/agent risks for this release only. Product upgrades remain separate.

### Статус 1.0.0 на 2026-11-26

| Критерий | Результат |
| --- | --- |
| PACKAGE_VERSION | PASS 1.0.0 |
| BUILD_VERIFIED | Production main [`7dad3ad810dcaedbca050b93c1e46e0995b590a8`](https://github.com/VanDalkvist/vanya-ui/commit/7dad3ad810dcaedbca050b93c1e46e0995b590a8), Cloudflare build `c6d6ecf8-968e-4930-984d-6cd029e9fde9`: 131 Vitest, 46 Node, types, compiled build, 0 новых нарушений дизайн-линтинга, deploy SUCCESS |
| CONSUMER_SMOKE | PASS для [`a7c5a86356980e3319326d1a98e28f9f0b9a1d8b`](https://github.com/VanDalkvist/vanya-ui/commit/a7c5a86356980e3319326d1a98e28f9f0b9a1d8b), build `64bde9dd-2af7-4fc7-a763-2eec65dc1716`, npm/React 18.3.1 и Bun/React 19.0.0: install, CLI, harness lint + negative, types, compiled CSS + negative, client, SSR |
| UI_VERIFIED | NOT_VERIFIED для отдельной финальной визуальной приёмки |
| LIVE_AGENT_EVAL | NOT_RUN, отложен |
| TAGGED / GitHub Release | UNTAGGED / отсутствует на момент проверки; [текущий список релизов](https://github.com/VanDalkvist/vanya-ui/releases) |

Для явно согласованного подключения используйте SHA с фактическим consumer-smoke 1.0.0:

~~~sh
bun add 'https://codeload.github.com/VanDalkvist/vanya-ui/tar.gz/a7c5a86356980e3319326d1a98e28f9f0b9a1d8b'
~~~

Итоговый main SHA проверен production CI отдельно. Тег должен указывать на согласованный проверенный коммит; наличие тега проверяется отдельно. Документационные обновления после сборки не меняют эти закреплённые SHA.


## Intentional site release checkpoint (2026-11-26)

Commit and push coherent work freely. Production Cloudflare Builds on `main` watches `release/vanya-ui.trigger`. Create or update it with a short release description at an intentional release checkpoint after relevant verification and required approval, or explicitly start the existing trigger for the approved exact main SHA. First marker creation requests a build. Confirm terminal build outcome and active version separately. Native path filters may be bypassed for empty pushes, 20+ commits or 3000+ changed files. The site checkpoint preserves the package version/tag policy; non-main validation, consumer smoke, public artifact and licensing checks remain unchanged.
