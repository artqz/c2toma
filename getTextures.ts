import { Chronicle } from "./import/types";
import { createDir, saveFile } from "./utils/Fs";
import * as fs from "fs";
import * as path from "path";

// Функция для рекурсивного получения всех файлов в директории
function getFilesInDirectorySync(
  directoryPath: string
): { name: string; path: string }[] {
  let files: { name: string; path: string }[] = [];

  // Чтение содержимого директории синхронно
  const items = fs.readdirSync(directoryPath);

  // Обработка каждого элемента
  for (const item of items) {
    const fullPath = path.join(directoryPath, item);

    // Получаем информацию об элементе (файл или директория) синхронно
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Если это директория, рекурсивно получаем файлы из неё
      // const nestedFiles = getFilesInDirectorySync(fullPath);
      // files = files.concat(nestedFiles);
    } else if (stats.isFile()) {
      // Если это файл, добавляем его в массив

      files.push({ name: item.split(".")[0], path: directoryPath });
    }
  }

  return files;
}

const chronicle: Chronicle = "c1";

createDir(`datapack/${chronicle}/models`);
saveFile(
  `datapack/${chronicle}/models/textures.json`,
  JSON.stringify(
    [
      ...getFilesInDirectorySync(
        `datapack/${chronicle}/models/LineageMonstersTex/Texture`
      ),
      ...getFilesInDirectorySync(
        `datapack/${chronicle}/models/LineageNpcsTex/Texture`
      ),
    ],
    null,
    2
  )
);
saveFile(
  `datapack/${chronicle}/models/mats.json`,
  JSON.stringify(
    [
      ...getFilesInDirectorySync(
        `datapack/${chronicle}/models/LineageMonstersTex/Shader`
      ),
      ...getFilesInDirectorySync(
        `datapack/${chronicle}/models/LineageNpcsTex/Shader`
      ),
      ...getFilesInDirectorySync(
        `datapack/${chronicle}/models/LineageMonstersTex/FinalBlend`
      ),
      ...getFilesInDirectorySync(
        `datapack/${chronicle}/models/LineageNpcsTex/FinalBlend`
      ),
    ],
    null,
    2
  )
);
saveFile(
  `datapack/${chronicle}/models/animations.json`,
  JSON.stringify(
    [
      ...getFilesInDirectorySync(
        `datapack/${chronicle}/models/LineageMonsters/MeshAnimation`
      ),
      ...getFilesInDirectorySync(
        `datapack/${chronicle}/models/LineageNpcs/MeshAnimation`
      ),
    ],
    null,
    2
  )
);
