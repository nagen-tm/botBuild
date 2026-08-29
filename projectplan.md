# Project Plan Template

## 1. Overview

Build a modular, async Python Twitch chat bot capable of handling commands, moderation, and 
event reactions. Target a production-ready bot deployable on a VPS or home server.

---

## 2. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Language | Python 3.11+ | Async support, rich ecosystem |
| Bot Framework | **twitchio** | Modern, async, well-maintained |
| Database | **SQLite** (dev) → **PostgreSQL** (prod) | Simple → scalable |
| ORM | **SQLAlchemy 2.0** | Type-safe, async support |
| Config | **pydantic-settings** + `.env` | Typed env vars, validation |
| Logging | **structlog** | Structured, JSON-ready logs |
| Testing | **pytest** + **pytest-asyncio** | Async-aware test runner |
| Linting | **ruff** + **mypy** | Fast lint + static types |
| Packaging | **uv** (or poetry) | Fast resolver, lockfiles |
| Deployment | **systemd** or **Docker** | Process supervision / portability |

---

## 3. Architecture (High-Level)

```
┌─────────────────────────────────────────────────┐
│                   twitchio client               │
├──────────┬──────────┬───────────┬───────────────┤
│ Command  │  Event   │Moderation │  Scheduling   │
│ Engine   │ Handlers │  Module   │  (APScheduler)│
├──────────┴──────────┴───────────┴───────────────┤
│              Command Registry (plugin loader)    │
├─────────────────────────────────────────────────┤
│           SQLAlchemy async engine + models      │
├─────────────────────────────────────────────────┤
│        Config (pydantic-settings) / Logging     │
└─────────────────────────────────────────────────┘
```

- **Plugin system**: each command module is a Python package under `src/bot/commands/`. A 
registry auto-discovers and registers them at startup.
- **Events**: sub, raid, follow, timeout, etc. hook into dedicated handlers.
- **Stateless by default**; persistent state (timers, cooldowns, points) lives in the DB.

---

## 4. Phases & Milestones

### Phase 0 – Setup & Scaffolding (Week 1)
- [ ] Repo init, `pyproject.toml`, CI (GitHub Actions: lint + test on push)
- [ ] `uv venv`, install `twitchio`, `sqlalchemy`, `pydantic-settings`, `structlog`
- [ ] Project layout:

```
twitch-bot/
├── src/bot/
│   ├── __main__.py          # entry point
│   ├── client.py            # twitchio Client subclass
│   ├── config.py            # pydantic-settings
│   ├── db/
│   │   ├── engine.py
│   │   └── models.py
│   ├── commands/
│   │   ├── __init__.py      # registry / loader
│   │   ├── greet.py
│   │   ├── points.py
│   │   └── ...
│   ├── events/
│   │   ├── subs.py
│   │   ├── raids.py
│   │   └── ...
│   ├── moderation/
│   └── utils/
├── tests/
├── .env.example
├── Dockerfile
└── README.md
```

- [ ] `.env.example` with `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `TWITCH_OAUTH_TOKEN`, 
`DB_URL`, `COMMAND_PREFIX`
- [ ] **Milestone:** bot connects to channel, echoes a "Connected!" message, disconnects 
cleanly.

---

### Phase 1 – Core Command Engine (Week 2)
- [ ] Implement command decorator: `@command("hello", aliases=["hi"], cooldown=5)`
- [ ] Auto-discovery loader (scan `commands/` package, import, register)
- [ ] Per-user & per-channel cooldowns (in-memory LRU + optional DB persistence)
- [ ] Permission tiers: viewer → moderator → channel-owner (read from DB or `--perms` flag)
- [ ] Graceful error handling (missing args, auth failures, unknown command)
- [ ] **Milestone:** 3+ working commands (`/hello`, `/time`, `/coinflip`), cooldowns enforced, 
unit tests pass.

---

### Phase 2 – Database & Persistent Features (Week 3)
- [ ] SQLAlchemy async setup, Alembic migrations
- [ ] Models: `User`, `Channel`, `Timer`, `Points`, `CommandLog`
- [ ] Implement:
  - **Points system** (`/points add 50`, `/points top`, earn-per-message)
  - **Timers** (`/timer add <name> <text>`, `/timer list`)
  - **Custom commands** stored in DB (mod+ only)
- [ ] **Milestone:** bot restarts and all persistent data survives; migration pipeline tested.

---

### Phase 3 – Event Handlers (Week 4)
- [ ] Subscribe to `twitchio` events:
  - `on_sub`, `on_sub_anniversary`, `on_resub`
  - `on_raid` (log, thank-raider, optional raid-party tracker)
  - `on_follow`
  - `on_message` (filter pipeline)
- [ ] Configurable welcome messages (DB-stored, channel-scoped)
- [ ] Optional: webhook to Discord for sub/raid notifications (httpx POST)
- [ ] **Milestone:** all major IRC events handled; Discord webhook fires on sub.

---

### Phase 4 – Moderation & Safety (Week 5)
- [ ] Anti-spam: N-gram / shingle window, configurable threshold
- [ ] Caps-lock / emoji-ratio filter
- [ ] Auto-timeout / auto-ban rules engine (simple rule objects, evaluated per message)
- [ ] `!mod` commands: `/timeout <user> <mins>`, `/clear` (if mod), `/broadcastercast`
- [ ] Audit log table for every mod action
- [ ] **Milestone:** spam-burst test (flood 50 msgs/sec) triggers auto-timeout within 2 s; 
audit log populated.

---

### Phase 5 – Polish, Observability, Deployment (Week 6)
- [ ] Structured JSON logs with trace IDs per message
- [ ] Prometheus metrics endpoint (`/metrics`): msgs/s, cmd latency, error rate
- [ ] `/stats` in-chat command (uptime, msg count, top commands)
- [ ] Graceful shutdown (SIGTERM → close DB pool → disconnect)
- [ ] Dockerfile (multi-stage, non-root), `docker-compose.yml` with optional Postgres
- [ ] systemd unit file alternative
- [ ] **Milestone:** bot runs 48 h unattended on a VPS; metrics dashboard (Grafana optional) 
showing healthy stats.

---

### Phase 6 – Docs & Handoff (Week 7 – partial)
- [ ] `README.md`: setup, config reference, how to add a command, deploy guide
- [ ] `CONTRIBUTING.md` (if multi-dev)
- [ ] Tag `v1.0.0`

---

## 5. Testing Strategy

| Level | Scope | Tool |
|-------|-------|------|
| Unit | Command logic, cooldown math, rule engine | pytest (mock `context`) |
| Integration | DB round-trips, migration up/down | pytest + `aiosqlite` / `pytest-postgresql` 
|
| E2E (smoke) | Connect to a test channel (or twitchio test harness), send 5 canned messages | 
pytest-asyncio, `twitchio` test utilities |
| Load | 1 000 msg/min synthetic flood | Locust or custom script against a staging instance |

CI runs unit + integration on every push; E2E nightly.

---

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Twitch API / token changes | Pin `twitchio` version; abstract behind `client.py` |
| Rate-limiting by Twitch (25 msgs / 30 s) | Outgoing message queue with token-bucket limiter 
|
| DB contention under load | Connection pool tuning; async SQLAlchemy |
| Single-host SPOF | Docker + easy re-deploy; optional second instance for a second channel |
| Scope creep (game-integration, !twitchplay, etc.) | Park in a `v2-ideas` branch; keep v1 
command set ≤ 12 |

---

## 7. Out-of-Scope for v1 (parking lot)

- !twitchplay / game-integration commands
- Whisper-based private commands
- Multi-language / i18n
- Web dashboard (admin panel)
- LLM-assisted responses (e.g., GPT-backed "ask the chat")

---

## 8. Timeline Summary

```
Week 1  ████  Setup + skeleton
Week 2  ████  Command engine
Week 3  ████  DB + persistent features
Week 4  ████  Event handlers
Week 5  ████  Moderation
Week 6  ████  Observability + deploy
Week 7  ██    Docs + 1.0.0
```

**Total: ~7 weeks** (solo dev, part-time ~20 h/wk). Compress to ~4 weeks at full-time.
