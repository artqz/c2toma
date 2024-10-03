import Fs from "fs";
import { z } from "zod";

// Определяем интерфейс NPC
interface NpcObject {
  [key: string]: string | string[]; // Значение может быть строкой или массивом строк
}

// Определяем схему через zod для проверки структуры NPC
export const NpcGrp = z.object({
  npc_id: z.number(),
  npcName: z.string(),
  classPath: z.string(),
  className: z.string(),
  texturePath: z.string().optional(),
  textures: z
    .object({ name: z.string(), material: z.string().optional() })
    .array()
    .optional(),
});

export type NpcGrp = z.infer<typeof NpcGrp>;

// Функция для загрузки файла и преобразования в JSON
export function loadNpcGrpDataC1() {
  const npcData = Fs.readFileSync("datapack/c1/txt/dec-npcgrp.txt", "utf16le");

  return toJson(npcData); // Преобразуем данные в JSON
}

// Функция для преобразования текста в JSON
function toJson(npcData: string) {
  // Загружаем текстуры
  const textureByName = new Map(
    z
      .object({ name: z.string(), path: z.string() })
      .array()
      .parse(
        JSON.parse(Fs.readFileSync("datapack/c1/models/textures.json", "utf8"))
      )
      .map((t) => [t.name, t])
  );
  // Загружаем материалы
  const matsByName = new Map(
    z
      .object({ name: z.string(), path: z.string() })
      .array()
      .parse(
        JSON.parse(Fs.readFileSync("datapack/c1/models/mats.json", "utf8"))
      )
      .map((t) => [t.name, t])
  );
  // Шаг 1. Разбиваем текст на отдельные NPC-блоки
  const npcBlocks = npcData.split("npc_begin").slice(1); // Убираем первый пустой элемент

  // Шаг 2. Преобразуем каждый блок в объект JSON
  const npcs: NpcObject[] = npcBlocks.map((block) => {
    const attributes = block
      .trim() // Убираем лишние пробелы и символы
      .replace("npc_end", "") // Убираем конец блока
      .split(/\t+/); // Используем табуляцию для разделения

    const npcObject: NpcObject = {};

    attributes.forEach((attr) => {
      const [key, value] = attr.split("="); // Разделяем ключ и значение
      if (value) {
        let cleanValue: string | string[] = value.replace(/[\[\]{}]/g, ""); // Убираем квадратные и фигурные скобки

        // Если значение содержит ';', преобразуем его в массив
        if (cleanValue.includes(";")) {
          cleanValue = cleanValue.split(";").map((item) => item.trim()); // Разбиваем по ';' и очищаем элементы
        }

        npcObject[key] = cleanValue;
      }
    });

    return npcObject;
  });

  // Шаг 3. Преобразуем массив объектов и валидируем схему через zod
  return NpcGrp.array().parse(
    npcs.map((n) => {
      // Разбиваем class_name на путь и имя класса
      const [classPath, className] = (n.class_name as string).split(".");

      let texturePath: string | undefined;
      const textures: { name: string; material?: string }[] = [];

      // Проверка, если texture_name — это массив или строка
      if (n.texture_name) {
        const textureNames = Array.isArray(n.texture_name)
          ? n.texture_name
          : [n.texture_name]; // Преобразуем в массив, если это строка

        // Обрабатываем каждый элемент texture_name
        textureNames.forEach((t) => {
          const [_texturePath, _textureName] = t.split(".");
          // Проверяем существует-ли такая текстура
          const checkTexture = textureByName.get(_textureName);

          if (checkTexture) {
            textures.push({ name: _textureName });
          } else {
            // Если нет текстуры проверяем материал
            const checkMat = matsByName.get(_textureName);
            if (checkMat) {
              // Достаем текстуры из материала
              const matData = Fs.readFileSync(
                `${checkMat.path}/${_textureName}.mat`,
                "utf8"
              );

              for (const tex of parseMat(matData)) {
                const checkTexture = textureByName.get(tex);
                if (checkTexture) {
                  textures.push({ name: tex, material: _textureName });
                } else {
                  console.log(`not_texture: ${_textureName}`);
                }
              }
            } else {
              console.log("huy");
            }
          }
          // texturePath = _texturePath; // Присваиваем путь к текстуре
          // textureName.push(_textureName); // Добавляем имя текстуры в массив
        });
      }

      // Возвращаем объект с правильной типизацией
      return {
        npc_id: parseInt(n.npc_id as string, 10), // Преобразуем строку в число с основанием 10
        npcName: n.npc_name as string, // Явно указываем, что npc_name — это строка
        classPath,
        className,
        ...(texturePath && { texturePath }), // Добавляем texturePath только если оно существует
        ...(textures.length > 0 && { textures }), // Добавляем textureName только если массив не пуст
      };
    })
  );
}

function parseMat(data: string) {
  const tmp = data.split("\r\n");
  const textures: string[] = [];

  for (const str of tmp) {
    textures.push(str.split("=")[1]);
  }

  return textures;
}
