// NavTabsData.ts
import { IconUser, IconSettings } from "@tabler/icons-react";
import { uniqueId } from "lodash";

export const accMenuItems = [
  {
    id: uniqueId(),
    title: "Account",
    icon: IconUser,
  },
  {
    id: uniqueId(),
    title: "Modify Account",
    icon: IconSettings,
  },
];
