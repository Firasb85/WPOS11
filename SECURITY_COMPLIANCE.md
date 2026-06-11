# WPOS — Security, Compliance & API Documentation

## 🔒 Data Security Architecture

### Encryption

| Layer | Method | Standard |
|-------|--------|----------|
| **Data at Rest** | AES-256-GCM field-level encryption | ISO 27001 A.10.1 |
| **Data in Transit** | TLS 1.3 (Supabase enforced) | ISO 27001 A.13.1 |
| **Passwords** | scrypt (OWASP recommended) | NIST SP 800-63B |
| **Key Derivation** | PBKDF2 (310,000 iterations) | NIST SP 800-132 |
| **Hashing** | SHA-256 for comparison | FIPS 180-4 |
| **API Keys** | Random 256-bit tokens | ISO 27001 A.9.4 |

### Access Control (3 Layers)

```
Layer 1: UI Guards (PermissionGuard component)
  ↓ Blocks unauthorized navigation
Layer 2: API Middleware (auth-middleware.ts)
  ↓ Validates JWT on server functions
Layer 3: Database RLS (40+ policies)
  ↓ Enforces row-level security per role
```

| Role | Employees | Snapshots | Evidence | Diagnostics | Cases | Admin | Audit |
|------|-----------|-----------|----------|-------------|-------|-------|-------|
| ADMIN | CRUD+Delete | CRUD | CRUD | CRUD | CRUD | Full | Read |
| CEO | Read all | Read | Read | Read | Read | Read | Read |
| MANAGER | Read all, Write | Read, Write | Read, Write | Read, Write | Read, Write | ❌ | ❌ |
| USER | Own only | ❌ | Own only | ❌ | ❌ | ❌ | ❌ |

### Security Controls

| Control | Implementation | File |
|---------|---------------|------|
| MFA (TOTP) | Supabase Auth + custom TOTP | `src/lib/security/mfa.ts` |
| Session Management | JWT + max concurrent sessions | `src/lib/security/session.ts` |
| Rate Limiting | 5 login attempts, 15min lockout | `src/lib/security/rate-limit.ts` |
| Security Headers | CSP, HSTS, X-Frame-Options, etc. | `src/lib/security/headers.ts` |
| Feature Flags | Gradual rollout control | `src/lib/security/feature-flags.ts` |
| Field Encryption | AES-256-GCM for sensitive fields | `src/lib/security/encryption.ts` |

## 📋 Compliance

### GDPR (General Data Protection Regulation)

| Article | Requirement | WPOS Implementation |
|---------|------------|---------------------|
| Art 15 | Right of Access | `exportUserData()` — exports all user data as JSON |
| Art 17 | Right to Erasure | `deleteUserData()` — soft-deletes + anonymizes |
| Art 20 | Data Portability | JSON export of all personal data |
| Art 25 | Privacy by Design | RLS policies, field encryption, minimal data collection |
| Art 30 | Records of Processing | Audit logs with 365-day retention |
| Art 32 | Security of Processing | AES-256, TLS, RBAC, MFA |
| Art 33 | Breach Notification | Health check monitoring, audit trail |

**File:** `src/lib/compliance/gdpr.ts`

### ISO 27001:2022

| Clause | Control | Status |
|--------|---------|--------|
| A.5.1 | Information Security Policy | ✅ Implemented |
| A.6.1 | Roles & Responsibilities | ✅ Implemented |
| A.7.2 | Employee Performance Management | ✅ Implemented |
| A.8.1 | Data Classification | ✅ Implemented |
| A.9.1 | Access Control Policy | ✅ Implemented |
| A.9.4 | MFA & Authentication | ✅ Implemented |
| A.10.1 | Data Encryption | ✅ Implemented |
| A.12.4 | Audit Logging | ✅ Implemented |
| A.12.6 | Vulnerability Management | ✅ Implemented |
| A.13.1 | Network Security | ✅ Implemented |
| A.18.1 | GDPR Compliance | ✅ Implemented |
| A.18.2 | Data Retention | ✅ Implemented |

**Compliance Score: 100%** (12/12 controls implemented)
**File:** `src/lib/compliance/iso27001.ts`

## 🔌 Open API (REST)

### Base URL
```
https://your-domain.com/api/v1
```

### Authentication
```
Authorization: Bearer <supabase_jwt_token>
```
or
```
X-API-Key: <api_key>
```

### Endpoints (16 total)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|-----------|
| `GET` | `/employees` | List employees | 100/min |
| `GET` | `/employees/:id` | Get employee | 100/min |
| `POST` | `/employees` | Create employee | 30/min |
| `PATCH` | `/employees/:id` | Update employee | 30/min |
| `GET` | `/kpis` | List KPIs | 100/min |
| `POST` | `/kpis` | Create KPI | 30/min |
| `GET` | `/snapshots` | List snapshots | 100/min |
| `POST` | `/snapshots` | Record snapshot | 30/min |
| `GET` | `/diagnostics` | List diagnostics | 100/min |
| `POST` | `/diagnostics` | Create diagnostic | 10/min |
| `GET` | `/evidence` | List evidence | 100/min |
| `POST` | `/evidence` | Submit evidence | 30/min |
| `GET` | `/cases` | List cases | 100/min |
| `POST` | `/ai/analyze` | AI analysis | 10/min |
| `POST` | `/webhooks` | Register webhook | 5/min |
| `GET` | `/health` | Health check | 60/min |

**File:** `src/lib/api/open-api.ts`

### Webhook Events (12 types)

```
kpi.breach          — KPI falls below target
kpi.recovery        — KPI returns to target
snapshot.created     — New performance snapshot
diagnostic.created   — New diagnostic report
diagnostic.approved  — Manager approves diagnostic
diagnostic.rejected  — Manager rejects diagnostic
case.created         — New case opened
case.resolved        — Case resolved
employee.created     — New employee added
employee.updated     — Employee record updated
intervention.started — Intervention begins
intervention.completed — Intervention completed
```

## 🧪 Testing

### Test Coverage

| Category | Files | Tests | Coverage |
|----------|-------|-------|----------|
| Security (encryption, rate-limit) | 3 | 9 | Encryption, hashing, config |
| AI Engine (local analysis) | 1 | 7 | Diagnose, predict, recommend, cache |
| ML Predictions | 1 | 8 | Regression, trends, forecasting |
| Auth Smoke Tests | 1 | 7 | Login, role routing, labels |
| Diagnostic Workflow | 1 | 6 | Full pipeline |
| RBAC | 2 | 12 | Permissions, guards |
| Core Services | 14 | 84 | CRUD, export, audit |
| **Total** | **25** | **133+** | — |

### Performance Testing Approach

| Test Type | Tool | Metric | Target |
|-----------|------|--------|--------|
| Build Performance | Vite build timer | Build time | < 15s |
| Bundle Size | Vite output | Client CSS+JS | < 500KB gzip |
| Database Queries | Supabase monitoring | Avg latency | < 100ms |
| Concurrent Users | Load test (k6) | Response time P95 | < 500ms |
| Memory | Chrome DevTools | Heap usage | < 50MB |

### Safe Update Process

```
1. Feature branch: git checkout -b feat/update-name
2. Develop + test locally: npx vitest run
3. TypeScript check: npx tsc --noEmit (0 errors)
4. Build check: npx vite build (clean)
5. PR review + CI checks
6. Merge to main → auto-deploy
7. Health check: GET /api/v1/health
8. Rollback plan: git revert + redeploy
```
