import { loadZoneNamesC5 } from "../../datapack/c5/zonenames";
import { loadZoneNamesGF } from "../../datapack/gf/zonenames";
import { Chronicle } from "../types";

export function loadZones(deps: { chronicle: Chronicle }) {
  if (deps.chronicle === "c5") {
    const data = loadZoneNamesC5().filter((x) => x.img);
    return data;
  }
  if (deps.chronicle === "gf") {
    const data = loadZoneNamesGF().filter((x) => x.img);
    return data;
  }
}
