import { FileConfig } from "../file-config";
import { SnifferConfig } from "../../sniffer/sniffer";

export class SnifferFileConfig extends FileConfig {
  addSniffer(snifferConfig: SnifferConfig) {
    const addedObj = this.createSnifferSetup(snifferConfig, false);
    const isListed = this.configData.findIndex(
      (item) => item.id === snifferConfig.id,
    );

    if (isListed !== -1) {
      log.info("Sniffer already listed");
      return;
    }
    this.configData.push(addedObj);
    this.writeToSetupFile();
  }

  removeSniffer(port: number) {
    const foundIndex = this.configData.findIndex((item) => item.port === port);
    if (foundIndex === -1) {
      throw new Error("item was not found");
    }
    this.configData.splice(foundIndex, 1);
    this.writeToSetupFile();
  }

  setIsStarted(snifferId: string, isStarted: boolean) {
    const foundIndex = this.configData.findIndex(
      (item) => item.id === snifferId,
    );
    if (foundIndex === -1) {
      throw new Error("item was not found");
    }
    const updatedSetup = this.configData[foundIndex];
    updatedSetup.isStarted = isStarted;
    this.configData[foundIndex] = updatedSetup;
    this.writeToSetupFile();
  }
  createSnifferSetup(
    snifferConfig: SnifferConfig,
    isStarted: boolean,
  ): SnifferConfigSetup {
    return {
      id: snifferConfig.id,
      name: snifferConfig.name,
      downstreamUrl: snifferConfig.downstreamUrl,
      port: snifferConfig.port,
      isStarted: isStarted,
    };
  }
}
