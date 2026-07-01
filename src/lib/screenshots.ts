import fs from "fs";
import path from "path";

/**
 * Lists screenshots dropped into public/apps/<slug>/screenshots/.
 * Returns public URL paths, sorted by filename, server-side only.
 */
export function getScreenshots(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "apps", slug, "screenshots");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .sort()
      .map((f) => `/apps/${slug}/screenshots/${f}`);
  } catch {
    return [];
  }
}
