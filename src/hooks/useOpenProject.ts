import { useContext } from "react";
import OpenProjectContext from "../contexts/OpenProjectContext";

export const useOpenProject = () => useContext(OpenProjectContext);