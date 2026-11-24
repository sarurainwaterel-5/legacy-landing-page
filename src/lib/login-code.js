import { randomInt } from "node:crypto";

// 31 unambiguous characters (no 0/O, 1/I/L). 8 characters ≈ 8.5e11 combinations, so a 10-minute
// code cannot be guessed by brute force even without a per-attempt counter.
export const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const CODE_LENGTH = 8;
export const CODE_TTL_SECONDS = 10 * 60;

export function generateLoginCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return code;
}

export function formatLoginCode(code) {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

// What the user typed -> the exact token next-auth stored (uppercase, no spaces or dashes).
export function normalizeLoginCode(input) {
  return String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}
