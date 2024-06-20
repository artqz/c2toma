import Fs from "fs";
import Path from "path";

const pathNpcs = "npcs/c3";
const pathMaps = "maps/c3";
const npcEntries = Fs.readdirSync(pathNpcs, "utf8");
const mapEntries = Fs.readdirSync(pathMaps, "utf8");
const mapsFiles = mapEntries
  .filter((file) => Path.extname(file) === ".json")
  .map((x) => parseInt(x));
const npcsFiles = npcEntries
  .filter((file) => Path.extname(file) === ".json")
  .map((x) => parseInt(x));
const sMapsFiles = new Set(mapsFiles);
console.log(npcsFiles.filter((e) => !sMapsFiles.has(e)));
