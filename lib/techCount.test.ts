import { test } from "node:test";
import assert from "node:assert/strict";
import { projectCount, techTip } from "./techCount.ts";

test("counts versioned stack entries but not look-alikes", () => {
  assert.equal(projectCount("React"), 5); // React 19, React, React 18, React 19, React 18 — not React Query/Hook Form/Router
  assert.equal(projectCount("Next.js"), 2);
  assert.equal(projectCount("Node.js"), 3); // via Express
  assert.equal(techTip("Next.js"), "Next.js — 2 projects");
});
