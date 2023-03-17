import { createCipheriv, createDecipheriv, createHash } from "crypto";

export function decryptText(
  text: string,
  password: string,
  iv: string
): string {
  const cipherText = createDecipheriv(
    "aes-256-cbc",
    getBufferFromPassword(password),
    Buffer.from(iv, "base64")
  );
  return cipherText.update(text, "base64", "utf-8") + cipherText.final("utf-8");
}

export function encryptText(
  text: string,
  password: string,
  iv: string
): string {
  const cipherText = createCipheriv(
    "aes-256-cbc",
    getBufferFromPassword(password),
    Buffer.from(iv, "base64")
  );
  return (
    cipherText.update(text, "utf-8", "base64") + cipherText.final("base64")
  );
}

export function getHash(text: string): string {
  const hash = createHash("sha256");
  hash.update(text);
  return hash.digest("base64");
}

function getBufferFromPassword(password: string): Buffer {
  return Buffer.from(
    password.length > 32 ? password.substring(0, 32) : password.padEnd(32, "1")
  );
}
