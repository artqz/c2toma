import { loadZoneNamesC5 } from "../../datapack/c5/zonenames";
import { Chronicle } from "../types";

export function loadZones(deps: { chronicle: Chronicle }) {
  if (deps.chronicle === "c5") {
    const data = loadZoneNamesC5().filter((x) => x.img);
    return data;
  }
}
