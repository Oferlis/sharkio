import { useLog } from "../../log";
import { ManagedMock, Mock } from "../../sniffer/mock/mock.types";
import { ConfigLoader } from "../config-loader";
import {
  MockConfigSetup,
  mocksConfigValidator,
} from "./mock-file-config.types";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});
export class MockFileConfig extends ConfigLoader<MockConfigSetup> {
  constructor(path: string) {
    super(path);
    this.validator = mocksConfigValidator;
  }

  update(existingId: string, newConfig: any, isStarted: boolean): void {
    throw new Error("Method not implemented.");
  }

  add(mockConfig: MockConfigSetup): void {
    const isListed = this.configData.findIndex(
      (item) =>
        item.id === mockConfig.id && item.snifferId === mockConfig.snifferId,
    );
    if (isListed !== -1) {
      log.info("Mock already listed");
    }

    this.configData.push(mockConfig);
    this.writeToSetupFile();
  }

  remove(id: string, snifferId: number): void {
    const foundIndex = this.configData.findIndex(
      (item) => item.id === id && item.snifferId === snifferId,
    );
    if (foundIndex === -1) {
      throw new Error("item was not found");
    }
    this.configData.splice(foundIndex, 1);
    this.writeToSetupFile();
  }

  setIsStarted(id: string, isStarted: boolean): void {
    throw new Error("Method not implemented.");
  }
}
