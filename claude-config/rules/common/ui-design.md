# UI/UX Design Auto-Activation

## When to Activate

When the task involves ANY of the following, invoke the `ui-ux-pro-max` skill BEFORE writing UI code:

- Designing new pages (landing pages, dashboards, admin panels, e-commerce, SaaS, portfolios, mobile apps)
- Creating or refactoring UI components (buttons, modals, forms, tables, charts, navbars, sidebars, cards)
- Choosing color schemes, typography, spacing, or layout systems
- Reviewing UI code for visual quality, accessibility, or consistency
- Implementing navigation, animations, or responsive behavior
- Making product-level design decisions (style, hierarchy, brand expression)

## Mandatory Design System Step

Before writing any UI/frontend code, run the design system generator to get tailored recommendations:

```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<product-type-or-description>" --design-system
```

Present the output inline (recommended style, colors, typography, layout pattern, effects, anti-patterns) and wait for user review before proceeding to implementation.

## Priority

This rule works alongside the ui-ux-pro-max skill's built-in activation triggers. If the skill is already invoked, still ensure the design system generator step runs before any code is written.
