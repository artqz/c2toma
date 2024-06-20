import { png2svg } from 'svg-png-converter';
import Fs, {  getFiles, MapsInfo } from './utils/Fs';

const path = "maps/c2/png"

const files = getFiles(path, ".png") 

async function init() {
  for (const file of files) {
  

      try {
  const src = Fs.readFileSync(
        `${path}/${file}`
      );
    const result = await png2svg({ 
  tracer: 'imagetracer', 
  optimize: true,
  input: src ,
  numberofcolors: 24, 
  pathomit: 1,
})
const _file = file.replace(".png", "")
console.log(src);

Fs.writeFileSync(`${path}/svg/${_file}.svg`, result.content)
console.log("save");
} catch (e) {
  console.log('error reading in file', e)
}
 
}
}

init()