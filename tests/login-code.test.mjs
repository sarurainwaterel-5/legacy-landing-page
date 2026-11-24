import test from "node:test";
import assert from "node:assert/strict";
import { generateLoginCode, normalizeLoginCode, formatLoginCode, CODE_ALPHABET, CODE_LENGTH } from "../src/lib/login-code.js";

test("codes are 8 characters from the unambiguous alphabet and vary", () => {
  const codes = new Set(Array.from({ length: 2000 }, generateLoginCode));
  assert.equal(codes.size, 2000);
  for (const c of codes) {
    assert.equal(c.length, CODE_LENGTH);
    for (const ch of c) assert.ok(CODE_ALPHABET.includes(ch));
  }
  assert.ok(!/[01OIL]/.test(CODE_ALPHABET));
  assert.ok(CODE_ALPHABET.length ** CODE_LENGTH > 5e11, "brute force space");
});

test("typed codes round-trip through formatting", () => {
  const code = generateLoginCode();
  assert.equal(normalizeLoginCode(formatLoginCode(code).toLowerCase()), code);
  assert.equal(normalizeLoginCode(" abcd - efgh "), "ABCDEFGH");
});
