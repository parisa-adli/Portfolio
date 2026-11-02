"use client";
import { useActionState } from "react";
import { sendContact } from "@/app/actions/contact";
import type { ContactState } from "@/lib/contact";

const FIELDS = [
  { name: "name", label: "name", type: "text", autoComplete: "name" },
  { name: "email", label: "email", type: "email", autoComplete: "email" },
] as const;

// Terminal-styled "transmission" form (§5.7). Works without JS (server action), errors inline.
export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { ok: false });
  const err = state.fieldErrors ?? {};

  if (state.ok)
    return (
      <div className="tx tx--done" role="status">
        <p className="tx__line">
          <span className="term__prompt">transmission</span> sent ✓
        </p>
        <p className="tx__line tx__muted">Message received. Thanks for reaching out.</p>
      </div>
    );

  return (
    <form action={action} className="tx" noValidate aria-describedby={state.error ? "tx-error" : undefined}>
      <div className="tx__bar">
        <span className="editor__dots" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="label">new transmission</span>
      </div>
      <div className="tx__body">
        {FIELDS.map((f) => (
          <div key={f.name} className="tx__field">
            <label htmlFor={`tx-${f.name}`} className="tx__label">
              <span aria-hidden="true">&gt; </span>
              {f.label}
            </label>
            <input
              id={`tx-${f.name}`}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required
              defaultValue={state.values?.[f.name]}
              aria-invalid={!!err[f.name]}
              aria-describedby={err[f.name] ? `tx-${f.name}-err` : undefined}
              className="tx__input"
            />
            {err[f.name] && (
              <p id={`tx-${f.name}-err`} className="tx__err">
                {err[f.name]![0]}
              </p>
            )}
          </div>
        ))}
        <div className="tx__field">
          <label htmlFor="tx-message" className="tx__label">
            <span aria-hidden="true">&gt; </span>message
          </label>
          <textarea
            id="tx-message"
            name="message"
            rows={5}
            required
            defaultValue={state.values?.message}
            aria-invalid={!!err.message}
            aria-describedby={err.message ? "tx-message-err" : undefined}
            className="tx__input"
          />
          {err.message && (
            <p id="tx-message-err" className="tx__err">
              {err.message[0]}
            </p>
          )}
        </div>
        {/* honeypot: hidden from people and assistive tech */}
        <div className="tx__hp" aria-hidden="true">
          <label htmlFor="tx-website">Website</label>
          <input id="tx-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        {state.error && (
          <p id="tx-error" className="tx__err" role="alert">
            {state.error}
          </p>
        )}
        <button type="submit" className="btn btn--primary tx__submit" disabled={pending}>
          {pending ? "transmitting…" : "transmit ↵"}
        </button>
      </div>
    </form>
  );
}
