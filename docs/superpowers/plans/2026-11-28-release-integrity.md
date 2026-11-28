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
- [x] VART-01: получить screenshot POST /browser-rendering/screenshot, URL публичной витрины, PNG, viewport 1440x900, DPR 1, version selector 3.0.0. Прямой binary response. Проверить signature, IHDR dimensions, длину и SHA-256, попытаться передать целый PNG в интерфейс ревью. PASS транспорта только при полном получении и проверке; review отдельно.
- [x] Зафиксировать исход, включая возможные лимиты connector и отсутствие durable persistence. VART-02: один реальный PNG из pinned browser-qa workspace, scoped target, upload → independent read → SHA-256 equality; storage lifecycle/permissions и доступ к полным bytes обязательны. Scope расширения только после отдельного решения владельца. Без новых dependency, CI workflow, production deploy, public raw logs, baseline promotion.
- [x] Ledger, память, следующий шаг. Source review и author observation отдельно от independent S9. Бюджет: один screenshot API request, один повтор только после подтверждённой устранимой ошибки. Public synthetic fixture only, никаких персональных данных/credentials.

Plan review: VART-01 проверяет отдельную возможность без изменения приложения и провайдера. Не подменяет VART-02; Cloudflare Browser Rendering отличается от pinned Playwright по engine/fonts; сравнение pixel-to-pixel между ними запрещено. Никаких production side effects.


### VART-01 — PASS direct capture/transport; VART-02 — BLOCKED
- 28.11.2026, один native Browser Rendering API POST screenshot на публичную витрину 3.0.0, URL https://ui.vanya-arc.dev/?release=3.0.0, PNG, viewport 1440x900, DPR 1, waitForSelector data-ui-version=3.0.0.
- Получен реальный Uint8Array: PNG signature 137,80,78,71,13,10,26,10; IHDR 1440x900; 87826 bytes; WebCrypto SHA-256 `0c9b1baf3a81f9da3d41e9ac5c10da9b27265e17a5519f0f86a3edb5b86a0884`. Binary result передан полностью (117104 base64 chars) в интерфейс ревью и фактически декодирован/просмотрен; отдельный receiver SHA и durable read-back NOT_RUN. Raw image не публиковался в Git и не сохранён в постоянное storage. Cost/engine exact version UNKNOWN.
- Author observation: виден header marker v3.0.0, nav, заголовок, waveform, две карточки и distance slider; явного обрезания/перекрытия на этом кадре не выявлено. Один desktop светлый кадр, динамические события; не golden, не paired comparison, независимая приёмка NOT_VERIFIED.
- Source review VARC assets@70e98ff: actual port/CLI and adapter tests (in-memory + injected cf calls) inspected; contract scoped immutable hash key, no overwrite local output, read SHA, 32 MiB cap. cf runtime and actual native upload NOT_RUN. Adapter intentionally filters env and uses local named cf profile; build-side credentials/runner wiring not established. Existing config only lib collection/originals/. Live bucket list has no UI-owned target. Existing manual ui-contract-selftest workflow runs Node self-tests only, no artifact publication/dispatch path in current connector. Avoid changing its responsibility.
- Decision: reuse existing project-owned asset concept and native R2 transport where appropriate; retain UI-owned visual manifest and Playwright runner. No second storage framework or log export. For VART-02 propose dedicated private UI QA R2 target (no public domain), exact scoped read/write authorization from validation build and independent readback, separate unapproved-run lifecycle and reviewed immutable goldens. Need explicit approval of new resource and credential scope before mutation. Do not extend Library target or reuse its credentials. Test one synthetic screenshot from actual pinned build, fail if mismatched digest or no retrieval; then expand to 176 only after PASS. Direct Browser Rendering usable now for production inspection, no replacement for paired native screenshots.
- S9: author-only observation; independent reviewers and actual durable artifact store remain BLOCKED. No production redeploy, no resource/credential changes, no package/code/consumer changes.


## Срез 3 — VART-02: owner approved private QA storage
28.11.2026: владелец разрешил создать отдельный bucket и настроить scoped access. Scope: public synthetic UI screenshots only; no production deployment, consumer migration or new worker. Infrastructure owner cloudflare-deploy; QA owner vanya-ui. Source base b4da8b4; infra b9d7836; workflow eeda1921e0cace214c2e04306db4e1dce82bb300. AP-075/076: walking skeleton before bulk. 
- [ ] Создать R2 Standard bucket vanya-ui-qa, проверить managed/custom domains disabled; data class public-content/synthetic, private storage. Сохранять оригиналы под runs/; goldens только после ревью. Без автоматического удаления в первом эксперименте.
- [ ] VART-02a: реальный PNG Browser Rendering -> private R2 PUT -> separate GET and SHA-256 comparison. Key includes digest, no overwrite different bytes. Проверить bytes and image dimensions. 
- [ ] VART-02b: credential preflight. Use bucket-only Workers R2 Storage Bucket Item Write via S3 API, no account-wide token grant, secret values never leave authorized secret store. Native S3 client (curl SigV4 or installed official SDK; check native version first), no bespoke signing. Scoped validation-only build secret; no production credentials or existing token rotation. If token management unavailable, document blocker. 
- [ ] Actual pinned Playwright screenshot in existing validation-only build, export original PNG before scratch cleanup, independent GET and digest equality. Preserve original Playwright result. Expand to complete paired run only after transport PASS. No automatic baseline promotion. 
- [ ] S9 read-back, author/independent evidence distinction, ledger/memory, infrastructure reconstruction note. Keep 3.0.0 production unchanged.
S7 review: one authorized storage target, existing native provider, no new public access, no framework; don't issue broad credentials or use other projects' buckets. VARC assets local cf adapter is not build-side S3 authorization; reuse semantics, adapter only when needed. References https://developers.cloudflare.com/r2/api/tokens/ and https://developers.cloudflare.com/r2/api/s3/conditional-operations/. 


### VART-02a — PASS, VART-02b — access gate
- Private Standard R2 vanya-ui-qa created; managed r2.dev disabled, zero custom domains; no changes to other buckets. Browser Rendering screenshot 87826 bytes 1440x900 saved at runs/vart-02a/live-3.0.0-0c9b1baf3a81f9da3d41e9ac5c10da9b27265e17a5519f0f86a3edb5b86a0884.png; independent R2 GET returned identical SHA-256 and bytes. This proves durable direct capture path, not Playwright provenance.
- Account token permission groups GET returned 403 / code 9109: connector missing account-api-tokens.write. Official R2 docs: bucket-item scopes are S3-only; do not broaden account token, use another project's key, or transfer secret in chat. No new tokens issued.
- VART-02c bounded diagnostic: existing validation-only trigger on exact 3.0.0 source SHA 8fc08b24a40e978bf2d4e0900069f1488baf0ca0; one existing native Playwright visual context (light 1440), local compiled candidate, original identity-light-1440.png with digest checked against context capture receipt. Emit exactly one synthetic image in numbered base64 chunks with begin/end/count/hash. Existing authenticated build logs read and exact PNG reconstructed in connector, then write into private bucket and independent GET hash verification. No private logs or credential output, no bulk log relay, no permanent trigger changes. If capture incomplete, do not store or retry blindly; record failure. This is one diagnostic transport experiment under current permissions; direct build-to-R2 export still requires scoped S3 token or equivalent native artifact access. No new runner or test files. Partial context does not seal or approve baseline.

VART-02c attempt 1: temporary long build_command PATCH rejected HTTP 400 / 12002, no build accepted; subsequent GET verified original validation and production commands intact. Upstream evidence: https://developers.cloudflare.com/workers/ci-cd/builds/troubleshoot/ and https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/ document generic validation failure, exact command size limit unconfirmed. Hypothesis: provider rejects long command. One discriminating retry uses existing Bash adapter plus native sha256sum/base64/nl and capture receipt grep in a shorter command, same SHA and validation-only trigger, no code changes. Build-minute limit not reached. Stop if rejected or incomplete. 

VART-02c attempt 2: validation-only build accepted exact release SHA, then terminal FAIL before browser execution: /bin/sh: 1: set: Illegal option -o pipefail. Trigger restored. Root cause native shell option incompatibility (see https://www.shellcheck.net/wiki/SC3040); local sandbox sh supports this option, so not equivalent to provider. Correct with set -eu and separate base64 output file and nl commands, preserving failure propagation, exact SHA and scope. No Playwright result or PNG from failed attempt. One focused retry after diagnosed failure.
