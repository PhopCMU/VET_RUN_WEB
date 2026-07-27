import { createContext, useContext } from "react";
import type { OpenProject } from "../types/OpenProject";

type OpenProjectContextType = {
  openProject: OpenProject | any;
  isLoadings: boolean;
};

const OpenProjectContext = createContext<OpenProjectContextType>({
  openProject: {},
  isLoadings: true,
});

export const useOpenProject = () => useContext(OpenProjectContext);

export default OpenProjectContext;
