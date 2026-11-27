# Keyboard shortcuts: adoption and product value — 2026-11-27

## Question and observed evidence
The owner reports never using the showcase's letter sequences and questions their value. This is qualitative evidence from one user; frequency, time saving and adoption are unmeasured. Earlier [research](keyboard-help-placement-2026-11-22.md) addressed placement and accessibility, not empirical validation of the assigned letter map. The current map uses Linear/GitHub-style G sequences, a 1.8s deadline, physical Latin key codes, opt-out and existing contextual help. The exact eight destinations were locally assigned, not a standard. The navigation has nine chapters; agents is absent from the shortcut map.

## Primary references and research
- Linear, [Invisible details — Building contextual menus](https://linear.app/now/invisible-details): acknowledges learning cost and exposes commands/shortcuts in context. [Descript's internal guide](https://linear.app/now/descript-internal-guide-for-using-linear) provides a concrete team example of frequent G+M, inbox and list commands. It does not establish adoption percentages or usefulness for a documentation showcase.
- GitHub [Keyboard shortcuts](https://docs.github.com/en/get-started/accessibility/keyboard-shortcuts): sequential navigation and discoverable help are precedents. Actual Vanya destinations are local choices.
- Apple [Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards/): prioritize familiar system commands and custom shortcuts for frequently used app-specific tasks.
- shadcn/ui [Sidebar](https://ui.shadcn.com/docs/components/radix/sidebar): a contextual Cmd/Ctrl+B shortcut toggles a real sidebar. Component anatomy and behavior are an engineering reference, not evidence that every app needs a letter-navigation layer.
- [With practice, keyboard shortcuts become faster than menu selection: A crossover interaction](https://pubmed.ncbi.nlm.nih.gov/26651347/), 2015: experimental learning curve and eventual shortcut speed benefit. Different task from this showcase; no transfer of numerical results claimed.
- [Satisficing and the Use of Keyboard Shortcuts: Being Good Enough Is Enough?](https://doi.org/10.1093/iwc/iwt016), 2013: infrequent usage persists even with knowledge/time pressure; learning assistance can increase adoption.
- Nielsen Norman Group [Accelerators Maximize Efficiency in User Interfaces](https://www.nngroup.com/articles/ui-accelerators/): contextual hints and visible discovery support experts; maintain ordinary access and accessibility.
- [WCAG 2.1.4 Character Key Shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html): single character sequences require an off/remap/focus-scoped alternative.

All sources reference-only; independently authored synthesis, no copied assets or text.

## Decision proposal (owner approval pending)
Remove arbitrary chapter numbers and global G+letter navigation from the documentation showcase, retain ordinary named fragment links, standard keyboard navigation and the reusable Kbd/ShortcutKeys display components. Keep genuine context commands such as Escape. If retaining optional letter shortcuts as a deliberate demo, label the actual destination, provide discoverable pointer-accessible help, reconcile the destination map and guard interaction scope. Do not introduce G+number or a command palette without an observed repeated navigation problem. Preserve existing code until owner confirms deletion; distinguish accessibility from optional accelerators in the canon.

## Lightweight future validation
Observe a representative real session: which actions repeat, how users reach them, why the existing path is sufficient or slow. For a justified command, compare success, time, errors, discovery and voluntary reuse after practice against the ordinary UI. No telemetry added by default, no keystroke capture; use explicit task observation or opt-in aggregated command activation if a measurement need is established. The user observation and reference research support a deletion hypothesis, not a numerical causal estimate.

## Accepted follow-up
The owner directed execution of remaining review findings. Remove the showcase-specific global letter bindings and help/settings, decorative numbers and unused runtime files. Preserve native navigation, anchors, standard keyboard accessibility and reusable keycap notation. No numeric shortcuts or command palette introduced. This decision follows the observed low value in this documentation context; no general conclusion about shortcut usage in other products.
