import { customAlphabet } from "nanoid";

const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SLUG_LENGTH = 8;

const generate = customAlphabet(ALPHABET, SLUG_LENGTH);

export function generateSlug(): string {
  return generate();
}

// Validate custom slugs: alphanumeric + hyphens, 3-32 chars
const CUSTOM_SLUG_REGEX = /^[a-zA-Z0-9-]{3,32}$/;

export function isValidCustomSlug(slug: string): boolean {
  return CUSTOM_SLUG_REGEX.test(slug);
}
