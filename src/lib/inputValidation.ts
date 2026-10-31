const BCRYPT_MAX_PASSWORD_BYTES = 72;
const MAX_EMAIL_BYTES = 254;

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const email = value.trim().toLowerCase();
  if (!email || Buffer.byteLength(email, "utf8") > MAX_EMAIL_BYTES) return null;

  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || atIndex !== email.indexOf("@")) return null;

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (
    localPart.length > 64 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..") ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(localPart)
  ) {
    return null;
  }

  const labels = domain.split(".");
  if (labels.length < 2 || labels.some((label) =>
    label.length < 1 || label.length > 63 ||
    !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)
  )) {
    return null;
  }

  const topLevelDomain = labels[labels.length - 1];
  if (!/^[a-z]{2,63}$/i.test(topLevelDomain)) return null;

  return email;
}

export function normalizeUsername(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const username = value.normalize("NFC").trim();
  const characterCount = Array.from(username).length;
  if (
    characterCount < 2 || characterCount > 50 ||
    /[\u0000-\u001f\u007f-\u009f]/.test(username)
  ) {
    return null;
  }

  return username;
}

export function isValidRegistrationPassword(value: unknown): value is string {
  return typeof value === "string" &&
    Array.from(value).length >= 8 &&
    Buffer.byteLength(value, "utf8") <= BCRYPT_MAX_PASSWORD_BYTES;
}

export function isValidLoginPassword(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 &&
    Buffer.byteLength(value, "utf8") <= 1024;
}
