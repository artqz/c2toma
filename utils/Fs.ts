import Fs from "fs";
import Path from "path"
import { z } from 'zod';

export function saveFile(path: string, data: string) {
  return Fs.writeFileSync(path, data);
}

export function checkFile(path: string) {
  return !Fs.existsSync(path);
}

export function loadFile(path: string) {
  return Fs.readFileSync(path, "utf8");
}

export function loadMap(path: string, filename: string) {
  const map = Fs.readFileSync(Path.join(path, filename), "utf8");

  return MapsInfo.parse(JSON.parse(map));
}

const MapsInfo = z.object({
  map: z.string()
})
type MapsInfo = z.infer<typeof MapsInfo>;

export function loadMaps(path: string) {
  const entries = Fs.readdirSync(path, "utf8");
  const result = entries.filter((file) => Path.extname(file) === ".json");

  const maps = new Map<number, MapsInfo>();
  for (const filename of result) {
    const npc = loadMap(path, filename);
    maps.set(parseInt(filename), npc);
  }
  console.log(maps);
  
  return Array.from(maps.values());
}