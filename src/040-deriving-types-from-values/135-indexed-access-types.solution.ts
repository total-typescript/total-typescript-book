import { Equal, Expect } from "@total-typescript/helpers";

export const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
  ONE_ON_ONE: "1on1",
  SELF_DIRECTED: "selfDirected",
  PLANNED_ONE_ON_ONE: "planned1on1",
  PLANNED_SELF_DIRECTED: "plannedSelfDirected",
} as const;

type ProgramModeMap = typeof programModeEnumMap;

// How do we make sure Group stays in sync with programModeEnumMap?
type Group = ProgramModeMap["GROUP"];

type test = Expect<Equal<Group, "group">>;
