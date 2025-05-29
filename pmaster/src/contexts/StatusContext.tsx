import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getProjectStatuses } from "../api/projects";
import type { ProjectStatus } from "../types/apiTypes";

interface StatusContextType {
  projectStatuses: ProjectStatus[];
  isLoading: boolean;
  error: string | null;
}

const StatusContext = createContext<StatusContextType>({
  projectStatuses: [],
  isLoading: true,
  error: null,
});

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await getProjectStatuses();
        setProjectStatuses(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load statuses"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  return (
    <StatusContext.Provider value={{ projectStatuses, isLoading, error }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatuses = () => useContext(StatusContext);
