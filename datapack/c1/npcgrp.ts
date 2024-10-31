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
  params: z
    .object({
      outputBlending: z.number(),
      twoSided: z.boolean(),
    })
    .optional(),
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
  // params: z.object({ outputBlending: z.number(), twoSided: z.boolean() }),
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
  // Загружаем мешы
  const meshByName = new Map(
    z
      .object({ name: z.string(), path: z.string() })
      .array()
      .parse(
        JSON.parse(Fs.readFileSync("datapack/c1/models/meshes.json", "utf8"))
      )
      .map((t) => [t.name.toLowerCase(), t])
  );
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
  function findMatsByName(substring: string): { name: string; path: string }[] {
    // Фильтруем ключи, которые содержат нужную подстроку

    // Фильтруем материалы по точному совпадению с одной из частей имени
    return Array.from(matsByName.values()).filter((key) => {
      // Разбиваем имя на части по подчеркиванию

      // Проверяем, содержится ли подстрока как отдельная часть
      return (
        removeSuffix(substring.toLowerCase()) ===
        removeSuffix(key.name.toLowerCase())
      );
    });
  }

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
      const [_meshPath, _meshName] = (n.mesh_name as string).split(".");

      const meshPath =
        _meshPath === "LineageMonsters"
          ? _meshPath + "/SkeletalMesh"
          : "LineageNpcs/SkeletalMesh";

      const _mesh = meshByName.get(_meshName.toLowerCase());
      const meshName = _mesh ? _mesh.name : _meshName;

      let texturePath: string | undefined;
      const material = new Map<string, Material>();
      // let params: NpcGrp["params"] = {
      //   outputBlending: 0,
      //   twoSided: false,
      // };

      // Проверка, если texture_name — это массив или строка
      if (n.texture_name) {
        const textureNames = Array.isArray(n.texture_name)
          ? n.texture_name
          : [n.texture_name]; // Преобразуем в массив, если это строка

        // Обрабатываем каждый элемент texture_name
        textureNames.forEach((t) => {
          const [_texturePath, _textureName] = t.split(".");
          console.log(textureNames);

          texturePath =
            _texturePath === "LineageMonstersTex"
              ? _texturePath
              : "LineageNpcsTex";

          // загружаем все похожие материалы
          for (const mat of findMatsByName(
            removeAfterT0(_textureName.toLowerCase())
          )) {
            if (Fs.existsSync(`${mat.path}/${mat.name}.mat`)) {
              const matData = Fs.readFileSync(
                `${mat.path}/${mat.name}.mat`,
                "utf8"
              );
              const propsData = Fs.readFileSync(
                `${mat.path}/${mat.name}.props.txt`,
                "utf8"
              );

              // params = parseProps(propsData);

              const { diffuse, specular, opacity } = parseMat(matData);

              const tId = diffuse;

              tId &&
                material.set(tId, {
                  name: mat.name,
                  diffuse,
                  specular,
                  opacity,
                  params: parseProps(propsData),
                });
            }
          }

          // Проверяем существует-ли такая текстура
          const checkTexture = textureByName.get(_textureName.toLowerCase());

          if (checkTexture) {
            const tId = _textureName;

            tId &&
              material.set(tId, {
                diffuse: _textureName,
              });
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

            const { diffuse, specular, opacity } = parseMat(matData);

            const tId = diffuse;

            tId &&
              material.set(tId, {
                name: _textureName,
                diffuse,
                specular,
                opacity,
                params: parseProps(propsData),
              });
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
        // console.log(n.npc_name, anim);
      }

      const materialArr = Array.from(material.values());

      return {
        npc_id: parseInt(n.npc_id as string, 10), // Преобразуем строку в число с основанием 10
        npcName: n.npc_name as string, // Явно указываем, что npc_name — это строка
        meshPath,
        meshName,
        ...(texturePath && { texturePath }), // Добавляем texturePath только если оно существует
        ...(materialArr.length > 0 && { material: materialArr }), // Добавляем textureName только если массив не пуст
        ...(anim && { animation: anim.name }),
        ...(anim && { animationPath: anim.path.split("/").slice(3).join("/") }),
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

function parseProps(data: string): Material["params"] {
  const tmp = data.split("\r\n");
  let outputBlending = 0;
  let twoSided = false;
  for (const str of tmp) {
    const [key, value] = str.split(" = ");
    if (key === "OutputBlending") {
      const match = value.match(/\((\d+)\)/);
      outputBlending = match ? parseInt(match[1], 10) : 0;
    }
    if (key === "TwoSided") {
      twoSided = value === "true";
    }
  }

  return { outputBlending, twoSided };
}

function removeAfterT0(str: string): string {
  // Разделяем строку по '_t0' и берем первую часть
  return str.split("_t0")[0];
}

function removeSuffix(name: string): string {
  return name.replace(/_[mt]\d+.*$/, "");
}
