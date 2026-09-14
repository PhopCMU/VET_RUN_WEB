import { createContext } from "react";
import type { OpenProject } from "../types/OpenProject";

type OpenProjectContextType = {
  openProject: OpenProject | null;
  isLoadings: boolean;
};

const OpenProjectContext = createContext<OpenProjectContextType>({
  openProject: null,
  isLoadings: true,
});

export default OpenProjectContext;
