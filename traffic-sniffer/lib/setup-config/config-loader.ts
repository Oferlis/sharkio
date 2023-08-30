import fsSync from "fs";
import fs from "fs/promises";
import { useLog } from "../log";
import { ZodError } from "zod";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export abstract class ConfigLoader<Type> {
  configData: Type[];
  path: string;
  validator: any;

  constructor(path: string) {
    this.configData = [];
    this.path = path;
  }

  getConfig(): Type[] {
    this.createFileIfNotExist(this.path);
    this.configData = this.readSetupFileData(this.path);

    console.info("Loaded config from file");
    return this.configData;
  }
  abstract update(existingId: string, newConfig: any, isStarted: boolean): void;
  abstract add(config: any): void;
  abstract remove(id: number): void;
  abstract setIsStarted(snifferId: string, isStarted: boolean): void;

  async createFileIfNotExist(path: string) {
    if (!fsSync.existsSync(path)) {
      fsSync.writeFileSync(path, JSON.stringify([]), { flag: "w" });
    }
  }

  readSetupFileData(path: string): Type[] {
    try {
      const fileData = fsSync.readFileSync(path, "utf8");
      const parsedData = JSON.parse(fileData);
      this.validator.parse(parsedData);

      return parsedData as Type[];
    } catch (e) {
      if (e instanceof ZodError) {
        console.warn("Config file is not valid");
        console.debug(e);
      } else {
        console.warn("failed to load config file");
      }

      this.path = this.path.split(".json")[0] + "-temp" + ".json";
      log.error(`Using a temporary config file`, {
        path,
      });

      return [];
    }
  }

  async writeToSetupFile() {
    await fs.writeFile(this.path, JSON.stringify(this.configData, null, 2));
  }
}
