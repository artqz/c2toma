import Fs from "fs";
import { z } from "zod";

// Определяем интерфейс NPC
interface NpcObject {
  [key: string]: string | string[]; // Значение может быть строкой или массивом строк
}

//
const Material = z.object({
  name: z.string().optional(),
  diffuse: z.string(),
  specular: z.string().optional(),
  opacity: z.string().optional(),
});

// Определяем схему через zod для проверки структуры NPC
export const NpcGrp = z.object({
  npc_id: z.number(),
  npcName: z.string(),
  meshPath: z.string(),
  meshName: z.string(),
  texturePath: z.string().optional(),
  material: Material.array().optional(),
  animationPath: z.string().optional(),
  animation: z.string().optional(),
  params: z.object({ outputBlending: z.number() }),
});

export type Material = z.infer<typeof Material>;
export type NpcGrp = z.infer<typeof NpcGrp>;

// Функция для загрузки файла и преобразования в JSON
export function loadNpcGrpDataC1() {
  const npcData = Fs.readFileSync("datapack/c1/txt/dec-npcgrp.txt", "utf16le");

  return toJson(npcData); // Преобразуем данные в JSON
}

// Функция для преобразования текста в JSON
function toJson(npcData: string): NpcGrp[] {
  // Загружаем текстуры
  const textureByName = new Map(
    z
      .object({ name: z.string(), path: z.string() })
      .array()
      .parse(
        JSON.parse(Fs.readFileSync("datapack/c1/models/textures.json", "utf8"))
      )
      .map((t) => [t.name.toLowerCase(), t])
  );
  // Загружаем материалы
  const matsByName = new Map(
    z
      .object({ name: z.string(), path: z.string() })
      .array()
      .parse(
        JSON.parse(Fs.readFileSync("datapack/c1/models/mats.json", "utf8"))
      )
      .map((t) => [t.name.toLowerCase(), t])
  );
  // Загружаем анимации
  const animByName = new Map(
    z
      .object({ name: z.string(), path: z.string() })
      .array()
      .parse(
        JSON.parse(
          Fs.readFileSync("datapack/c1/models/animations.json", "utf8")
        )
      )
      .map((t) => {
        const nameArr = t.name.split("_");
        nameArr.pop();
        return [nameArr.join("_").toLowerCase(), t];
      })
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
      const [meshPath, meshName] = (n.mesh_name as string).split(".");

      let texturePath: string | undefined;
      const material: Material[] = [];
      const params: { outputBlending: number } = { outputBlending: 0 };

      // Проверка, если texture_name — это массив или строка
      if (n.texture_name) {
        const textureNames = Array.isArray(n.texture_name)
          ? n.texture_name
          : [n.texture_name]; // Преобразуем в массив, если это строка

        // Обрабатываем каждый элемент texture_name
        textureNames.forEach((t) => {
          const [_texturePath, _textureName] = t.split(".");
          // Проверяем существует-ли такая текстура
          const checkTexture = textureByName.get(_textureName.toLowerCase());

          if (checkTexture) {
            material.push({ diffuse: _textureName });
          }
          // Если нет текстуры проверяем материал
          const checkMat = matsByName.get(_textureName.toLowerCase());
          if (checkMat) {
            // Достаем текстуры из материала
            const matData = Fs.readFileSync(
              `${checkMat.path}/${_textureName}.mat`,
              "utf8"
            );
            const propsData = Fs.readFileSync(
              `${checkMat.path}/${_textureName}.props.txt`,
              "utf8"
            );
            // console.log(propsData);

            const { outputBlending } = parseProps(propsData);
            params.outputBlending = outputBlending;

            const { diffuse, specular, opacity } = parseMat(matData);

            material.push({ name: _textureName, diffuse, specular, opacity });
          } else {
            // console.log("huy");
          }
          // texturePath = _texturePath; // Присваиваем путь к текстуре
          // textureName.push(_textureName); // Добавляем имя текстуры в массив
        });
      }

      // Возвращаем объект с правильной типизацией
      const className = meshName.split("_");
      className.pop();

      let anim;
      anim = animByName.get(className.join("_").toLowerCase());
      if (anim) {
      } else {
        anim = animByName.get(
          (n.class_name as string).split(".")[1].toLowerCase()
        );
        //console.log(n.npc_name, anim);
      }

      return {
        npc_id: parseInt(n.npc_id as string, 10), // Преобразуем строку в число с основанием 10
        npcName: n.npc_name as string, // Явно указываем, что npc_name — это строка
        meshPath,
        meshName,
        ...(texturePath && { texturePath }), // Добавляем texturePath только если оно существует
        ...(material.length > 0 && { material }), // Добавляем textureName только если массив не пуст
        ...(anim && { animation: anim.name }),
        ...(anim && { animationPath: anim.path.split("/").slice(3).join("/") }),
        params,
      };
    })
  );
}

function parseMat(data: string) {
  const tmp = data.split("\r\n");
  let material: { diffuse: string; specular?: string; opacity?: string } = {
    diffuse: "",
  };

  for (const str of tmp) {
    if (str.split("=")[0] === "Diffuse") {
      material.diffuse = str.split("=")[1];
    }
    if (str.split("=")[0] === "Specular") {
      material.specular = str.split("=")[1];
    }
    if (str.split("=")[0] === "Opacity") {
      material.opacity = str.split("=")[1];
    }
  }

  return material;
}

function parseProps(data: string) {
  const tmp = data.split("\r\n");
  let outputBlending = 0;
  for (const str of tmp) {
    const [keys, value] = str.split(" = ");
    if (keys === "OutputBlending") {
      const match = value.match(/\((\d+)\)/);
      outputBlending = match ? parseInt(match[1], 10) : 0;
    }
  }

  return { outputBlending };
}
