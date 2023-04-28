import express from "express"
import cors from "cors"
import _ from "lodash"
import Fs, { checkFile, saveFile } from './utils/Fs';


const app = express()
const port = 3000

const version_game = "c4"

app.use(express.json({limit: '50mb'})) // for parsing application/json
app.use(express.urlencoded({ extended: true, limit: '50mb' })) // for parsing application/x-www-form-urlencoded
app.use(cors())

const allNpcIds = new Set<number>()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/setNpcDetail", (req, res) => {
  const data = req.body.data
  const npcId = req.body.npcId
  const path = `npcs/${version_game}/${npcId}.json`;

  if (checkFile(path)) {
    saveFile(path, JSON.stringify(data));
    console.log(`[success]: c4, npcId: ${npcId} created`);
    res.json({msg: `[success]: c4, npcId: ${npcId} created`})
  } else {
    console.log(`[success]: c4, npcId: ${npcId} updated`);
    res.json({msg: `[success]: c4, npcId: ${npcId} updated`})
  }
})

app.post("/setMap", (req, res) => {
  const data = req.body.data
  const npcId = req.body.npcId
  const path = `maps/${version_game}/${npcId}.json`;

  if (checkFile(path)) {
    saveFile(path, JSON.stringify(data));
    console.log(`[success]: c4, map npcId: ${npcId} created`);
    res.json({msg: `[success]: c4, map npcId: ${npcId} created`})
  } else {
     console.log(`[success]: c4, map npcId: ${npcId} updated`);
    res.json({msg: `[success]: c4, map npcId: ${npcId} updated`})
  }
})

app.post("/setNpc", (req, res) => { 
  const data = req.body.data
  
  for (const npc of data) {
    allNpcIds.add(Number(npc.npc.npcClassId))
  }
  res.json({msg: `[success]: c4, npc list loaded`})
});

app.get("/nextNpc", (req, res) => { 
  const pathNpcs = `npcs/${version_game}/`;  
  const pathMaps = `maps/${version_game}/`; 
  
  const npcIds: number[] = []
  const mapIds: number[] = []

  Fs.readdirSync(pathNpcs).forEach(file => {
    npcIds.push(Number(file.split('.')[0]))
  });
  Fs.readdirSync(pathMaps).forEach(file => {
    mapIds.push(Number(file.split('.')[0]))
  });

  const difNpcIds = _.intersection(npcIds, mapIds)
  
  for (const dNpcId of difNpcIds) {
    allNpcIds.delete(dNpcId)
  }
  
  const nextNpcId = allNpcIds.values().next().value;
  console.log("осталось: "+Array.from(allNpcIds.values()).length);
  if (nextNpcId !== undefined) {
    res.json({msg: `[success]: next npc: ${nextNpcId}`, npcId: nextNpcId, v: version_game})
  } else res.status(204)
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

