import { ManagedMock } from "../../sniffer/mock/mock.types";
import z from "zod";

export type MockConfigSetup = ManagedMock & { snifferId: number };

const mockConfigValidator = z.object({
  method: z.string(),
  endpoint: z.string(),
  data: z.any(),
  status: z.number(),
  id: z.string(),
  isStarted: z.boolean(),
  snifferId: z.number(),
});

export const mocksConfigValidator = z.array(mockConfigValidator);
