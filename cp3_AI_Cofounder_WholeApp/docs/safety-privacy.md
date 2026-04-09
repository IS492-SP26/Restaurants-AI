# Safety And Privacy Notes

## PII handling

The founder form accepts free-text location and business-goal inputs. Those inputs may accidentally contain personal or sensitive information.

Current protections:

- `.env.local` is gitignored
- `.env.example` contains placeholders only
- the app does not persist founder data to a database today

Recommended handling:

- avoid entering personal names, phone numbers, or home addresses into the founder form
- if a database is added later, store only the minimum founder context required
- redact or hash direct identifiers in logs
- restrict access to raw prompt and completion logs

## Rate limits

Current repo state:

- no server-side rate limiting is implemented yet

Recommended mitigation before public deployment:

- per-IP throttling on `/api/suggestions`
- per-IP and per-session throttling on `/api/manual`
- background queue for long-running model calls
- abuse alerts on repeated failed or burst traffic

## Prompt injection / jailbreak / abuse mitigation

Current design strengths:

- structured JSON outputs are required for fine-tuned agents
- local data connectors constrain the agent context to known knowledge packs

Additional protections recommended:

- reject prompts asking the model to ignore its role or expose hidden instructions
- validate all model outputs before use
- strip unsafe or irrelevant user directives from downstream agent prompts
- maintain allowlisted tool usage only
- keep legal and financial outputs clearly framed as planning support, not professional advice

## Secrets handling

- keep API keys only in `.env.local` or the deployment secret manager
- never commit keys to git
- rotate keys that have been pasted into chat or other shared channels

## Output safety

Potential risks:

- overconfident legal guidance
- fake precision in financial guidance
- misuse of local regulatory assumptions outside the intended geography

Mitigations:

- preserve disclaimers in legal and financial sections
- display citations and agent mode where possible
- clearly label fallback vs fine-tuned behavior
- require local professional verification before launch decisions

## Deployment checklist

Before public launch:

1. add auth if manuals are tied to user accounts
2. add rate limiting
3. add request logging with redaction
4. add abuse monitoring
5. rotate development API keys
