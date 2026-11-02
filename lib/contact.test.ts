import { test } from "node:test";
import assert from "node:assert/strict";
import { allow, validateContact } from "./contact.ts";

test("validates fields with inline messages", () => {
  const bad = validateContact({ name: "P", email: "nope", message: "short" });
  assert.ok(bad.fieldErrors?.name && bad.fieldErrors.email && bad.fieldErrors.message);
  const good = validateContact({ name: "Parisa", email: "a@b.co", message: "Let's build a dashboard." });
  assert.equal(good.data?.name, "Parisa");
});

test("rate limit: 3 per 10 minutes per IP", () => {
  const t = 1_000_000;
  assert.ok(allow("1.1.1.1", t) && allow("1.1.1.1", t + 1) && allow("1.1.1.1", t + 2));
  assert.equal(allow("1.1.1.1", t + 3), false);
  assert.ok(allow("2.2.2.2", t + 3), "other IPs unaffected");
  assert.ok(allow("1.1.1.1", t + 10 * 60 * 1000 + 1), "window slides");
});
