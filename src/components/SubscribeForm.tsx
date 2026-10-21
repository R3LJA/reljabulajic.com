"use client";

import { useId, useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

const MESSAGES: Record<string, string> = {
  invalid_email: "That email doesn't look right.",
  not_configured: "Signups open soon. The list isn't connected yet.",
};

const INPUT_CLASS =
  "min-w-0 flex-1 rounded-full border border-hairline-strong bg-background px-5 py-3 text-[15px] outline-none transition-colors placeholder:text-faint focus:border-accent";
const BUTTON_CLASS =
  "rounded-full bg-foreground px-6 py-3 text-[15px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60";
const DONE_CLASS = "rounded-2xl border border-hairline bg-foreground/[0.03] px-5 py-4 text-sm";
const FORM_CLASS = "flex flex-col gap-2.5 sm:flex-row";

export default function SubscribeForm({
  inputClassName = INPUT_CLASS,
  buttonClassName = BUTTON_CLASS,
  doneClassName = DONE_CLASS,
  formClassName = FORM_CLASS,
  buttonLabel = "Join the letter",
  placeholder = "you@email.com",
}: {
  inputClassName?: string;
  buttonClassName?: string;
  doneClassName?: string;
  formClassName?: string;
  buttonLabel?: string;
  placeholder?: string;
}) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      if (res.ok) {
        setStatus("done");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(MESSAGES[data.error ?? ""] ?? "Something went wrong. Try again in a minute.");
      setStatus("error");
    } catch {
      setError("Something went wrong. Try again in a minute.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className={doneClassName}>
        You&apos;re in. The next letter lands at the start of the month.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit} className={formClassName}>
        <label htmlFor={inputId} className="sr-only">
          Email
        </label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
        />
        {/* honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="hidden"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={buttonClassName}
        >
          {status === "sending" ? "Joining…" : buttonLabel}
        </button>
      </form>
      {status === "error" && (
        <p role="alert" className="mt-3 text-sm text-[#f87171]">
          {error}
        </p>
      )}
    </div>
  );
}
