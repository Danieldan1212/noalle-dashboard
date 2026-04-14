# Decision: Hybrid Social Media Approach

## Date
2026-04-13

## Context
Evaluated 4 approaches for social media management for an Israeli jewelry brand:
- A: All-in-one SaaS (Buffer, Predis, Hootsuite)
- B: Fully custom pipeline
- C: Hybrid (SaaS scheduling + custom AI)
- D: Platform-native tools only

## Decision
Mix of C + B: Custom dashboard for CRM + Hebrew captions + photo enhancement + analytics. Free native tools (Meta Business Suite, Pinterest Business) for actual posting and scheduling.

## Rationale
1. No SaaS tool supports Hebrew AI caption generation
2. Predis AI specifically does NOT support Hebrew (confirmed via API docs)
3. Meta Business Suite is free and proven for scheduling IG + FB
4. Direct API posting is fragile (Meta changes APIs frequently)
5. Our dashboard adds value where no free tool exists: CRM, unified analytics, Hebrew content

## Consequences
- User copies captions from dashboard → pastes into Meta Business Suite
- Analytics APIs still needed (read-only) for unified dashboard
- Two fewer API integrations to maintain (no posting via Meta/Pinterest APIs)
- Monthly cost: ~$5-10 (Anthropic + fal.ai) instead of $40+ (SaaS tools)
