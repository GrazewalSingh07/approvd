import crypto from "node:crypto";

export const generateReceipt = (userId) => {
  const timestamp = Date.now().toString(36); // Converts timestamp to base36 (shorter)
  const shortUserId = crypto.createHash("md5").update(userId).digest("hex").slice(0, 10); // Shorten userId

  return `${shortUserId}-${timestamp}`;
};
