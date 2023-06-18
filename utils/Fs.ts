import Fs from "fs";
import Path from "path";
import { z } from "zod";
export default Fs;

export function createDir(path: string) {
  if (!Fs.existsSync(path)) {
    Fs.mkdirSync(path, { recursive: true });
  }
}

export function saveFile(path: string, data: string) {
  return Fs.writeFileSync(path, data);
}

export function checkFile(path: string) {
  return !Fs.existsSync(path);
}

export function loadFile(path: string) {
  try {
    return Fs.readFileSync(path, "utf8");
  } catch (err) {
    return "none";
  }
}

export function loadMap(path: string, filename: string) {
  const map = Fs.readFileSync(Path.join(path, filename), "utf8");

  return MapsInfo.parse(JSON.parse(map));
}

type Chronicle = "c1" | "c2" | "c4";

export const MapsInfo = z.object({
  map: z.string(),
});
export type MapsInfo = z.infer<typeof MapsInfo>;

type Map = {
  npcId: number;
  map: string;
};

export function loadMaps() {
  const chronicles: Chronicle[] = ["c1", "c2", "c4"];
  for (const c of chronicles) {
    const path = `maps/${c}`;
    const entries = Fs.readdirSync(path, "utf8");
    const result = entries.filter((file) => Path.extname(file) === ".json");

    const maps = new Map<number, MapsInfo>();

    for (const filename of result) {
      const npc = loadMap(path, filename);
      maps.set(parseInt(filename), npc);
    }
  }

  return [];
}

export function getFiles(path: string, ext: ".json" | ".png") {
  const entries = Fs.readdirSync(path, "utf8");
  const result = entries.filter((file) => Path.extname(file) === ext);

  return result;
}
