import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { FunctionOpenProject } from "../routers/GetRouter";
import OpenMenuContext from "../contexts/OpenProjectContext";
import type { OpenProject } from "../types/OpenProject";

export const OpenProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openProject, setOpenProject] = useState<OpenProject | null>(null);
  const [isLoadings, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    // 2. ถ้าเคย fetch ไปแล้ว ไม่ต้องทำซ้ำ
    if (hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    const fetchOpenProject = async () => {
      try {
        const response = await FunctionOpenProject();

        if (response?.success && response.data) {
          setOpenProject(response.data);
        } else {
          console.error("Failed to fetch open project: No data returned");
        }
      } catch (error) {
        console.error("Failed to fetch open project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenProject();
  }, []);

  return (
    <OpenMenuContext.Provider value={{ openProject, isLoadings }}>
      {children}
    </OpenMenuContext.Provider>
  );
};
