# Release Integrity — Arch Loop после Composition

> Для исполнителя: superpowers:executing-plans; сохранять фактические результаты каждого шага.

**Цель:** устранить неоднозначность статуса 3.0.0 и восстановить воспроизводимость полного функционального production gate.
**Архитектура:** библиотека владеет контрактом выпуска и QA, приватный cloudflare-deploy — конфигурацией Builds; действующий Cloudflare Worker обслуживает проверенный SHA. Используем уже выполненную команду production build, существующий browser-qa и consumer-smoke.
**Исходники:** main a82996d3852d3f92912a3718c848e5fd0d6d24a2; release 8fc08b24a40e978bf2d4e0900069f1488baf0ca0; arch workflow eeda1921e0cace214c2e04306db4e1dce82bb300; AGENTS.md, docs/versioning.md, docs/patterns/regression-gate.md, docs/arch-improvement/memory.md и ledger. Стадия: active development / production showcase. AP-054/056/057/068/069/075/076; проверка источников и actual provider read-back.
**Основание:** владелец запросил повторную проверку и выполнение предложенного релизного хвоста по Arch Loop.

## S4/S5 — findings
- P2 fix-now: versioning.md оставляет Composition в состоянии кандидата; план содержит исторические незавершённые пункты без краткой карты их фактического результата. Исправить текущий статус, исторические доказательства сохранить.
- P2 fix-now: production trigger запускает unit/type/build/lint, но упускает полный native browser и installed-package smoke; ручной build exact 3.0.0 включал оба и прошёл. Установить ту же доказанную команду в существующий production trigger. Конфигурация и rollback в приватном cloudflare-deploy; сохранить маркер, deploy command, ветки, кэш и остальные поля. Изменение настройки без запуска production build.
- P2 blocked: annotated tag отсутствует, GitHub connector не создаёт annotated tag; native Git в текущей среде не разрешает github.com. Только разрешённый обычный Git, точный release SHA.
- P2 blocked: полноразмерные визуальные артефакты 2.0.0 → 3.0.0 были временными; baseline 3.0.0 требует фактической приёмки. Не утверждать скриншоты автоматически. Сначала подтвердить существующий scoped artifact transport, доступ чтения, retention и реальную доставку одного изображения; не заводить storage в этом срезе.
- P2 blocked: независимый reviewer недоступен; varc remote execution ещё не принят (см. vanya-os execution plan). Исключение Composition не распространяется на следующие релизы.
- P3 log-only: миграции потребителей отдельны.

## S6 — bounded plan
- [x] Исправить docs/versioning.md и итоговую сводку существующего Composition plan: статус production PASS, точный SHA, tag UNTAGGED, visual/independent NOT_VERIFIED, исторический strict FAIL, фактические результаты финального gate. Проверить источник и read-back; сохранить прошлые теги и исходные чекбоксы как историю.
- [x] В приватном cloudflare-deploy/docs/ui-publication.md сохранить желаемую команду и прежнюю команду отката, границы изменения и provenance. В Cloudflare прочитать текущие настройки, изменить только build_command существующего production trigger; подтвердить точное соответствие уже успешно выполненной команде на 3.0.0 и сохранность прочих полей, активного deployment и validation trigger. Не трогать marker, версию пакета, deploy command, секреты, DNS, новые ресурсы или consumer pins.
- [x] Записать S9/S10/S11: read-back GitHub/Cloudflare; проверка неизменности активного deployment; fresh full build на будущей намеренной версии, независимый review и visual artifact walking skeleton остаются открытыми до фактического исполнения. Не заявлять общий PASS.

## S7 — review плана
Выбраны две ограниченные правки документации и конфигурации. Не добавляем новый runner, CI workflow, хранилище, зависимости или публичные API. Изменённые опубликованные гайды попадут в следующий намеренный SemVer checkpoint; текущий production сохраняем. Синтетические публичные fixtures, никаких новых потоков данных. Scope storage/credentials требует отдельного подтверждения реализации. Команда production использует существующие нативные проверки; не уменьшает coverage. Для config-only изменения проверка — точное сравнение поля и остальных полей, плюс неизменный active deployment. Fresh build и независимые S9 circuits отдельно NOT_RUN/NOT_VERIFIED.


## S9–S12 — результат среза
- [x] Документация: 5f00657, 8fea86e; GitHub read-back всех статусов, SHA, исторического тега и исключений PASS.
- [x] Production trigger: CONFIG_VERIFIED; точная команда совпадает с успешным production build 3.0.0. Остальные поля, validation trigger и активный deployment сохранены. Приватный desired state и rollback: cloudflare-deploy@b9d7836, docs/ui-publication.md.
- [x] Ledger: a9a12b9, findings, fixes, evidence, lessons.
- [ ] Annotated tag — BLOCKED: native Git DNS, connector capability.
- [ ] Durable visual artifact walking skeleton, затем full-resolution review и approved baseline — BLOCKED без подтверждённого транспорта.
- [ ] Независимые S9 reviewers — NOT_VERIFIED; remote execution ещё не принят.
- [ ] Fresh full build через постоянный gate — NOT_RUN до следующего намеренного checkpoint.

VERDICT: OPEN (срез документации и конфигурации завершён, независимая приёмка и доказательства остаются открытыми). Production 3.0.0 и consumer pins сохранены. Нового deploy нет.


## Срез 2 — эксперимент транспорта визуальных артефактов

Контекст: vanya-ui@62c5d3d4208ec79358b9067941877c74570218f5, vanya-os@70e98ff1bad3412b7a209de6ae2e27e32b041b7a, harness-settings@e51b4ac2280f11609c5333e104427ab09655bd2b, cloudflare-deploy@b9d78365d3667bec19f8c0a99315207406cbec64. Сохраняем существующий Arch Loop, S1/S2 из первого среза; owner scope — продолжить визуальный транспорт. AP-075/076: walking skeleton с реальными байтами.

### S4/S5 — кандидаты и решения
- P2 blocked: исходный Workers Builds paired runner использует scratch, удаляет его при выходе; API Builds status/logs не предоставляет артефактный download endpoint. Ранее bulk log export обрывался. Повторять логовый экспорт нецелесообразно.
- P2 blocked: существующий [VARC assets](https://github.com/VanDalkvist/vanya-os/tree/70e98ff1bad3412b7a209de6ae2e27e32b041b7a/modules/assets-integrations) реализует scoped AssetStore, hash-addressed put/get/verify, native cf adapter. Конфиг harness-settings содержит только Library target; live R2 inventory: три bucket, ни одного UI/QA target. Профиль cf и реальный upload из plugin ранее не подтверждены. Не записывать в чужие buckets, не выпускать credentials и не создавать ресурсы в этом срезе. Кандидат reuse/adapt при отдельном согласовании scoped storage и проверке build-side authorization.
- P2 fix-now experiment VART-01: прямой native Browser Rendering screenshot для публичной витрины 3.0.0; проверить получение PNG bytes без логов и полную размерность 1440x900, compute SHA-256 на возвращённых байтах, показать фактический кадр автору ревью. Это диагностический снимок production, другой runtime, не Playwright golden и не доказательство export из Workers Builds.
- P2 blocked VART-02: durable upload/download из реального build workspace по project-owned target с независимым SHA-256, затем матрица. Только после подтверждения storage boundary/credential scope. Independent S9 остаётся открытым.

### S6/S7 — план эксперимента
- [ ] VART-01: получить screenshot POST /browser-rendering/screenshot, URL публичной витрины, PNG, viewport 1440x900, DPR 1, version selector 3.0.0. Прямой binary response. Проверить signature, IHDR dimensions, длину и SHA-256, попытаться передать целый PNG в интерфейс ревью. PASS транспорта только при полном получении и проверке; review отдельно.
- [ ] Зафиксировать исход, включая возможные лимиты connector и отсутствие durable persistence. VART-02: один реальный PNG из pinned browser-qa workspace, scoped target, upload → independent read → SHA-256 equality; storage lifecycle/permissions и доступ к полным bytes обязательны. Scope расширения только после отдельного решения владельца. Без новых dependency, CI workflow, production deploy, public raw logs, baseline promotion.
- [ ] Ledger, память, следующий шаг. Source review и author observation отдельно от independent S9. Бюджет: один screenshot API request, один повтор только после подтверждённой устранимой ошибки. Public synthetic fixture only, никаких персональных данных/credentials.

Plan review: VART-01 проверяет отдельную возможность без изменения приложения и провайдера. Не подменяет VART-02; Cloudflare Browser Rendering отличается от pinned Playwright по engine/fonts; сравнение pixel-to-pixel между ними запрещено. Никаких production side effects.
