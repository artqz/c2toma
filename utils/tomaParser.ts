import Fs from "fs";
import Path from "path";

export function tomaNpcsParser(path: string) {
  const entries = Fs.readdirSync(path, "utf8");
  console.log(entries);

  const files = new Map(
    entries
      .filter((file) => Path.extname(file) === ".json")
      .map((x) => [parseInt(x), parseInt(x)])
  );
  console.log(files);
}
