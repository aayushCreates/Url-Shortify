import { Reader, ReaderModel } from "@maxmind/geoip2-node";
import path from "path";
import logger from "../config/logger";

let reader: ReaderModel | null = null;

export const initGeoIP = async () => {
  try {
    const dbPath = path.resolve(process.cwd(), "GeoLite2-City.mmdb");
    reader = await Reader.open(dbPath);
    logger.info("🌍 GeoIP database loaded successfully");
  } catch (error) {
    logger.warn(
      "⚠️ GeoIP database not found at root (GeoLite2-City.mmdb). Geographic analytics will be limited.",
    );
    reader = null;
  }
};

export interface GeoData {
  country: string | null;
  city: string | null;
}

const normalizeIP = (ip: string) => {
  //  handling IPv6
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }
  return ip;
};

export const lookupIP = (ip: string): GeoData => {
  if (!reader) {
    logger.warn("GeoIP reader not initialized");
    return { country: "Unknown", city: "Unknown" };
  }
  try {
    const normalizedIP = normalizeIP(ip);

    if (normalizedIP === "127.0.0.1" || normalizedIP === "::1") {
      return { country: "Localhost", city: "Localhost" };
    }

    const response = reader.city(normalizedIP);
    return {
      country: response.country?.names.en || null,
      city: response.city?.names.en || null,
    };
  } catch (error) {
    logger.error("GeoIP lookup failed", { ip, error });
    return { country: "Unknown", city: "Unknown" };
  }
};
