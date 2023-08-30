import { ManagedMock } from "../../sniffer/mock/mock.types";
import z from "zod";

export type MockConfigSetup = ManagedMock;

const mockConfigValidator = z.object({
  methos: z.string(),
  endpoint: z.string(),
  data: z.any(),
  status: z.number(),
  id: z.string(),
  isStarted: z.boolean(),
});

export const mocksConfigValidator = z.array(mockConfigValidator);
