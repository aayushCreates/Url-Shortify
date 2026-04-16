import { env } from "../config/env";

const BLOCKED_DOMAINS = [
  "blockthis.com",
  "spamdomain.org",
  "phishing-test.com",
];

const PRIVATE_IP_REGEX =
  /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|localhost)$/i;

export function isUrlSafe(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    // Prevent redirecting to our own URL shortener to avoid recursive redirects
    const appHost = new URL(env.BASE_URL).host;
    if (parsed.host === appHost) {
      return false;
    }

    // Block private IPs, loopback, and localhost
    if (PRIVATE_IP_REGEX.test(parsed.hostname)) {
      return false;
    }

    // Checking against hard-coded blocklist
    if (BLOCKED_DOMAINS.some((domain) => parsed.hostname.endsWith(domain))) {
      return false;
    }

    return true;
  } catch (error) {
    return false; // If new URL() fails to parse, it's strictly invalid.
  }
}
