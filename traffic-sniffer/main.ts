require("dotenv/config");
import { SnifferFileConfig } from "./lib/setup-config/sniffer-setup-config/sniffer-file-config";
import { SnifferConfigSetup } from "./lib/setup-config/sniffer-setup-config/sniffer-file-config.types";
import { MockManagerController } from "./lib/sniffer-manager/mock-manager-controller";
import { SnifferManager } from "./lib/sniffer-manager/sniffer-manager";
import { SnifferManagerController } from "./lib/sniffer-manager/sniffer-manager-controller";
import { SnifferManagerServer } from "./lib/sniffer-manager/sniffer-manager-server";
import { SwaggerUiController } from "./lib/swagger/swagger-controller";
import { CollectionManager } from "./lib/collection-manager/collection-manager";
import { CollectionManagerController } from "./lib/collection-manager/collection-manager-controller";
import { CollectionFilePersistency } from "./lib/collection-manager/collection-file-persistency";

export const snifferSetupFilePath =
  process.env.SNIFFER_SETUP_FILE_PATH ?? "./sniffers-setup.json";

async function main() {
  const snifferFileConfig = new SnifferFileConfig(snifferSetupFilePath);
  const configData: SnifferConfigSetup[] = snifferFileConfig.getConfig();
  console.debug(configData);

  const collectionFilePersistency = new CollectionFilePersistency(
    "./collections.json",
  );

  const snifferManager = new SnifferManager(snifferFileConfig);
  const collectionManager = new CollectionManager(collectionFilePersistency);
  const collectionManagerController = new CollectionManagerController(
    collectionManager,
  );

  await snifferManager.loadSniffersFromConfig(configData);

  const snifferController = new SnifferManagerController(snifferManager);
  const mockManagerController = new MockManagerController(snifferManager);
  const swaggerUi = new SwaggerUiController();
  const snifferManagerServer = new SnifferManagerServer([
    snifferController,
    mockManagerController,
    collectionManagerController,
    swaggerUi,
  ]);

  snifferManagerServer.start();
}

main();
