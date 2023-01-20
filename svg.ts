import Fs, {  getFiles, MapsInfo } from './utils/Fs';

const path = "maps/c2"

const files = getFiles(path, ".json") 

for (const file of files) {
  const src = Fs.readFileSync(
        `${path}/${file}`,
        "utf8"
      );
 
  const json = JSON.parse(src);
  const data = MapsInfo.parse(json);
   
  const base64Image = data.map;
  const _file = file.replace(".json", "")
  Fs.writeFileSync(`${path}/png/${_file}.png`, base64Image, {encoding: 'base64'});
}
