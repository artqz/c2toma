import Fs from "fs";

export function saveFile(path: string, data: string) {
  return Fs.writeFileSync(path, data);
}

export function checkFile(path: string) {
  return !Fs.existsSync(path);
}