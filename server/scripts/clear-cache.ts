import { redis } from "../src/loaders/redis";

async function clear() {
  console.log("Clearing url cache...");
  const keys = await redis.keys("url:*");
  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(`Cleared ${keys.length} keys.`);
  } else {
    console.log("No keys found.");
  }
  process.exit(0);
}

clear();
