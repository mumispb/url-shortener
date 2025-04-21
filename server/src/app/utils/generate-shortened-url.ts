import { nanoid } from "nanoid";
import { createHash } from "node:crypto";

const HASH_LENGTH = 4;
const RANDOM_LENGTH = 4;
const SHORTENED_URL_PREFIX = "brev.ly";

// A bit overengineered, but should guarantee a unique shortened url
// with no performance degradation
export function generateShortenedUrl(originalUrl: string) {
  const urlHash = createHash("md5")
    .update(originalUrl)
    .digest("hex")
    .substring(0, HASH_LENGTH);

  const randomChars = nanoid(RANDOM_LENGTH);

  return `https://${SHORTENED_URL_PREFIX}/${urlHash}${randomChars}`;
}
