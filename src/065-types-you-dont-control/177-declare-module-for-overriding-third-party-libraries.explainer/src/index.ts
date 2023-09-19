import { z } from "zod";

const user = z.object({
  name: z.string(),
});
