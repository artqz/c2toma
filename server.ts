import express from "express";
import cors from "cors";
import _ from "lodash";
import Fs, { checkFile, saveFile } from "./utils/Fs";
import { loadNpcNamesC3 } from "./datapack/c3/npcnames";

const app = express();
const port = 3000;

const version_game = "c1";

app.use(express.json({ limit: "50mb" })); // for parsing application/json
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // for parsing application/x-www-form-urlencoded
app.use(cors());

const allNpcIds = new Set<number>();

const iskl = new Set();

app.get("/", (req, res) => {
  res.send(`Осталось загрузить ${Array.from(allNpcIds.values()).length} НПЦ`);
});

app.post("/setNpcDetail", (req, res) => {
  const data = req.body.data;
  const npcId = req.body.npcId;
  const path = `npcs/${version_game}/${npcId}.json`;

  if (checkFile(path)) {
    saveFile(path, JSON.stringify(data));
    console.log(`[success]: ${version_game}, npcId: ${npcId} created`);
    res.json({ msg: `[success]: ${version_game}, npcId: ${npcId} created` });
  } else {
    console.log(`[success]: ${version_game}, npcId: ${npcId} updated`);
    res.json({ msg: `[success]: ${version_game}, npcId: ${npcId} updated` });
  }
});

app.post("/setMap", (req, res) => {
  const data = req.body.data;
  const npcId = req.body.npcId;
  const path = `maps/${version_game}/${npcId}.json`;

  if (checkFile(path)) {
    saveFile(path, JSON.stringify(data));
    console.log(`[success]: ${version_game}, map npcId: ${npcId} created`);
    res.json({
      msg: `[success]: ${version_game}, map npcId: ${npcId} created`,
    });
  } else {
    console.log(`[success]: ${version_game}, map npcId: ${npcId} updated`);
    res.json({
      msg: `[success]: ${version_game}, map npcId: ${npcId} updated`,
    });
  }
});

app.post("/setNpc", (req, res) => {
  const data = req.body.data;

  for (const npc of data) {
    if (!iskl.has(npc.npc.npcClassId)) {
      allNpcIds.add(Number(npc.npc.npcClassId));
    }
  }
  res.json({ msg: `[success]: ${version_game}, npc list loaded` });
});

app.get("/nextNpc", (req, res) => {
  const pathNpcs = `npcs/${version_game}/`;
  const pathMaps = `maps/${version_game}/`;

  const npcIds: number[] = [];
  const mapIds: number[] = [];

  Fs.readdirSync(pathNpcs).forEach((file) => {
    npcIds.push(Number(file.split(".")[0]));
  });
  Fs.readdirSync(pathMaps).forEach((file) => {
    mapIds.push(Number(file.split(".")[0]));
  });

  const difNpcIds = _.intersection(npcIds, mapIds);

  for (const dNpcId of difNpcIds) {
    allNpcIds.delete(dNpcId);
  }

  const nextNpcId = allNpcIds.values().next().value;
  console.log("осталось: " + Array.from(allNpcIds.values()).length);
  if (nextNpcId !== undefined) {
    res.json({
      msg: `[success]: next npc: ${nextNpcId}`,
      npcId: nextNpcId,
      v: version_game,
    });
  } else res.status(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
